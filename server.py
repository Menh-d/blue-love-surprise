#!/usr/bin/env python3
"""
BLUE LETTER — ຈົດໝາຍສີຟ້າຈາກຫົວໃຈ 💙
Production-ready HTTP Server & REST API
Implements all visitor and Admin CMS endpoints, session cookies, CSRF protection,
rate limiting, multipart file upload with MIME/size validation, private media gating,
atomic publish/unpublish/rollback snapshots, and idempotent visitor responses.
"""

import cgi
import datetime
import hashlib
import html
import http.cookies
import json
import mimetypes
import os
import re
import secrets
import shutil
import sys
import time
import urllib.parse
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from db import (
    BASE_DIR,
    DATA_DIR,
    DEFAULT_STORY_ID,
    DEFAULT_STORY_SLUG,
    MEDIA_DIR,
    build_story_snapshot,
    check_readiness_and_warnings,
    get_connection,
    get_media_dict,
    hash_password,
    hash_token,
    init_db,
    is_media_referenced,
    now_iso,
    verify_password,
)

PUBLIC_DIR = BASE_DIR / "public"
PORT = int(os.environ.get("PORT", "8080"))
HOST = os.environ.get("HOST", "127.0.0.1")

# Upload limits from brief section 8:
# Image: 10MB, Audio: 20MB, Video: 50MB
MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_AUDIO_BYTES = 20 * 1024 * 1024
MAX_VIDEO_BYTES = 50 * 1024 * 1024

ALLOWED_MIMES = {
    "image/jpeg": MAX_IMAGE_BYTES,
    "image/png": MAX_IMAGE_BYTES,
    "image/webp": MAX_IMAGE_BYTES,
    "image/gif": MAX_IMAGE_BYTES,
    "image/svg+xml": MAX_IMAGE_BYTES,
    "audio/mpeg": MAX_AUDIO_BYTES,
    "audio/mp3": MAX_AUDIO_BYTES,
    "audio/mp4": MAX_AUDIO_BYTES,
    "audio/x-m4a": MAX_AUDIO_BYTES,
    "audio/m4a": MAX_AUDIO_BYTES,
    "audio/wav": MAX_AUDIO_BYTES,
    "audio/ogg": MAX_AUDIO_BYTES,
    "video/mp4": MAX_VIDEO_BYTES,
    "video/webm": MAX_VIDEO_BYTES,
    "video/quicktime": MAX_VIDEO_BYTES,
}

# Simple in-memory rate limiter: { (ip, bucket): [timestamps] }
RATE_LIMITS = {}


def check_rate_limit(ip: str, bucket: str, max_requests: int, window_seconds: int) -> bool:
    now = time.time()
    key = (ip, bucket)
    history = RATE_LIMITS.get(key, [])
    history = [t for t in history if now - t < window_seconds]
    if len(history) >= max_requests:
        RATE_LIMITS[key] = history
        return False
    history.append(now)
    RATE_LIMITS[key] = history
    return True


def sanitize_text(val, max_len: int = 5000) -> str:
    if val is None:
        return ""
    s = str(val).strip()
    if len(s) > max_len:
        s = s[:max_len]
    return s


class BlueLetterHandler(BaseHTTPRequestHandler):
    server_version = "BlueLetterHTTP/1.0"

    def log_message(self, fmt, *args):
        # Clean concise logging
        sys.stderr.write(f"[BLUE-LETTER] {self.address_string()} - {fmt % args}\n")

    def _send_json(self, status: int, payload: dict, extra_headers: list = None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if extra_headers:
            for k, v in extra_headers:
                self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self, max_bytes: int = 2 * 1024 * 1024) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        if length > max_bytes:
            raise ValueError("Payload too large")
        raw = self.rfile.read(length)
        return json.loads(raw.decode("utf-8"))

    def _get_cookies(self) -> http.cookies.SimpleCookie:
        cookie = http.cookies.SimpleCookie()
        raw_cookie = self.headers.get("Cookie")
        if raw_cookie:
            cookie.load(raw_cookie)
        return cookie

    def _get_session(self, conn, cookie_name: str):
        cookies = self._get_cookies()
        if cookie_name not in cookies:
            return None
        raw_token = cookies[cookie_name].value
        if not raw_token:
            return None
        token_hash = hash_token(raw_token)
        row = conn.execute(
            "SELECT * FROM sessions WHERE id_hash = ?", (token_hash,)
        ).fetchone()
        if not row:
            return None
        if row["expires_at"] < now_iso():
            conn.execute("DELETE FROM sessions WHERE id_hash = ?", (token_hash,))
            conn.commit()
            return None
        return row

    def _require_admin(self, conn, check_csrf: bool = False):
        sess = self._get_session(conn, "bl_admin_session")
        if not sess or not sess["admin_id"]:
            self._send_json(401, {"error": "ກະລຸນາເຂົ້າສູ່ລະບົບ Admin ກ່ອນ (Unauthorized)"})
            return None
        if check_csrf:
            csrf_header = self.headers.get("X-CSRF-Token", "")
            if not csrf_header or not secrets.compare_digest(csrf_header, sess["csrf_token"]):
                self._send_json(403, {"error": "CSRF Token ບໍ່ຖືກຕ້ອງ ກະລຸນາໂຫຼດໜ້າໃໝ່"})
                return None
        admin = conn.execute("SELECT id, email, created_at FROM admins WHERE id = ?", (sess["admin_id"],)).fetchone()
        if not admin:
            self._send_json(401, {"error": "ບໍ່ພົບບັນຊີ Admin"})
            return None
        return {"admin": dict(admin), "session": dict(sess)}

    def _has_visitor_access(self, conn, story_row) -> bool:
        if story_row["access_mode"] != "passphrase":
            return True
        # Admin also has access
        admin_sess = self._get_session(conn, "bl_admin_session")
        if admin_sess and admin_sess["admin_id"]:
            return True
        vis_sess = self._get_session(conn, "bl_visitor_session")
        if vis_sess and vis_sess["visitor_scope"] == story_row["id"]:
            return True
        return False

    def _make_cookie_header(self, name: str, value: str, max_age: int, http_only: bool = True) -> tuple:
        parts = [
            f"{name}={value}",
            "Path=/",
            f"Max-Age={max_age}",
            "SameSite=Lax",
        ]
        if http_only:
            parts.append("HttpOnly")
        # Enable Secure when served over HTTPS / production proxy
        if self.headers.get("X-Forwarded-Proto") == "https" or os.environ.get("COOKIE_SECURE") == "1":
            parts.append("Secure")
        return ("Set-Cookie", "; ".join(parts))

    # ==================== ROUTING ====================

    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == "/api/auth/me":
            return self.handle_auth_me()
        if path == "/api/admin/story":
            return self.handle_admin_get_story()
        if path == "/api/admin/responses":
            return self.handle_admin_get_responses()
        if path == "/api/admin/backup":
            return self.handle_admin_backup()
        if path.startswith("/api/story/"):
            slug = path[len("/api/story/") :].strip("/")
            return self.handle_get_story(slug, query)
        if path.startswith("/api/media/"):
            media_id = path[len("/api/media/") :].strip("/")
            return self.handle_get_media(media_id)

        # Frontend routes
        if path == "/admin" or path.startswith("/admin/"):
            return self._serve_static_file(PUBLIC_DIR / "admin.html")
        if path == "/" or path.startswith("/s/"):
            return self._serve_static_file(PUBLIC_DIR / "index.html")

        # Static assets
        rel = path.lstrip("/")
        target = (PUBLIC_DIR / rel).resolve()
        if str(target).startswith(str(PUBLIC_DIR.resolve())) and target.is_file():
            return self._serve_static_file(target)

        self._send_json(404, {"error": "Not found"})

    def do_POST(self):
        parsed = urllib.parse.urlsplit(self.path)
        path = parsed.path

        if path == "/api/auth/login":
            return self.handle_auth_login()
        if path == "/api/auth/logout":
            return self.handle_auth_logout()
        if path == "/api/story/access":
            return self.handle_story_access()
        if path == "/api/admin/media":
            return self.handle_admin_upload_media()
        if path == "/api/admin/publish":
            return self.handle_admin_publish()
        if path == "/api/admin/unpublish":
            return self.handle_admin_unpublish()
        if path == "/api/admin/rollback":
            return self.handle_admin_rollback()
        if path == "/api/admin/password":
            return self.handle_admin_change_password()
        if path == "/api/admin/restore":
            return self.handle_admin_restore()
        if path.startswith("/api/story/") and path.endswith("/responses"):
            slug = path[len("/api/story/") : -len("/responses")].strip("/")
            return self.handle_post_response(slug)

        self._send_json(404, {"error": "Not found"})

    def do_PATCH(self):
        parsed = urllib.parse.urlsplit(self.path)
        path = parsed.path
        if path == "/api/admin/story":
            return self.handle_admin_patch_story()
        self._send_json(404, {"error": "Not found"})

    def do_DELETE(self):
        parsed = urllib.parse.urlsplit(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == "/api/admin/responses":
            return self.handle_admin_delete_response(query)
        if path.startswith("/api/admin/media/"):
            media_id = path[len("/api/admin/media/") :].strip("/")
            return self.handle_admin_delete_media(media_id)

        self._send_json(404, {"error": "Not found"})

    # ==================== HANDLERS ====================

    def _serve_static_file(self, file_path: Path):
        if not file_path.exists():
            self._send_json(404, {"error": "File not found"})
            return
        ctype, _ = mimetypes.guess_type(str(file_path))
        if not ctype:
            ctype = "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"
        data = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(data)

    def handle_auth_login(self):
        ip = self.client_address[0]
        if not check_rate_limit(ip, "admin_login", max_requests=10, window_seconds=60):
            return self._send_json(429, {"error": "ພະຍາຍາມເຂົ້າລະບົບຫຼາຍເກີນໄປ ກະລຸນາລໍຖ້າ 1 ນາທີ"})

        try:
            body = self._read_json()
        except Exception:
            return self._send_json(400, {"error": "Invalid JSON"})

        email = sanitize_text(body.get("email", ""), 200).lower()
        password = str(body.get("password", ""))

        conn = get_connection()
        try:
            admin = conn.execute("SELECT * FROM admins WHERE email = ?", (email,)).fetchone()
            if not admin or not verify_password(password, admin["password_hash"]):
                return self._send_json(401, {"error": "ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ"})

            raw_token = secrets.token_urlsafe(32)
            csrf_token = secrets.token_hex(24)
            expires = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)).isoformat()
            conn.execute(
                """
                INSERT INTO sessions (id_hash, admin_id, visitor_scope, csrf_token, expires_at, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (hash_token(raw_token), admin["id"], None, csrf_token, expires, now_iso()),
            )
            conn.commit()
            cookie_hdr = self._make_cookie_header("bl_admin_session", raw_token, 7 * 86400, True)
            return self._send_json(
                200,
                {
                    "authenticated": True,
                    "admin": {"id": admin["id"], "email": admin["email"]},
                    "csrf_token": csrf_token,
                },
                extra_headers=[cookie_hdr],
            )
        finally:
            conn.close()

    def handle_auth_logout(self):
        conn = get_connection()
        try:
            cookies = self._get_cookies()
            if "bl_admin_session" in cookies:
                raw_token = cookies["bl_admin_session"].value
                conn.execute("DELETE FROM sessions WHERE id_hash = ?", (hash_token(raw_token),))
                conn.commit()
            cookie_hdr = self._make_cookie_header("bl_admin_session", "", 0, True)
            return self._send_json(200, {"ok": True}, extra_headers=[cookie_hdr])
        finally:
            conn.close()

    def handle_auth_me(self):
        conn = get_connection()
        try:
            sess = self._get_session(conn, "bl_admin_session")
            if not sess or not sess["admin_id"]:
                return self._send_json(200, {"authenticated": False})
            admin = conn.execute(
                "SELECT id, email, created_at FROM admins WHERE id = ?", (sess["admin_id"],)
            ).fetchone()
            if not admin:
                return self._send_json(200, {"authenticated": False})
            return self._send_json(
                200,
                {
                    "authenticated": True,
                    "admin": dict(admin),
                    "csrf_token": sess["csrf_token"],
                },
            )
        finally:
            conn.close()

    def handle_story_access(self):
        ip = self.client_address[0]
        if not check_rate_limit(ip, "story_access", max_requests=12, window_seconds=60):
            return self._send_json(429, {"error": "ລອງລະຫັດຫຼາຍເທື່ອເກີນໄປ ກະລຸນາລໍຖ້າບຶດໜຶ່ງ"})

        try:
            body = self._read_json()
        except Exception:
            return self._send_json(400, {"error": "Invalid JSON"})

        slug = sanitize_text(body.get("slug") or DEFAULT_STORY_SLUG, 120)
        passphrase = str(body.get("passphrase", "")).strip()

        conn = get_connection()
        try:
            story = conn.execute("SELECT * FROM stories WHERE slug = ?", (slug,)).fetchone()
            if not story:
                story = conn.execute("SELECT * FROM stories WHERE id = ?", (DEFAULT_STORY_ID,)).fetchone()
            if not story:
                return self._send_json(404, {"error": "ບໍ່ພົບເລື່ອງລາວນີ້"})

            if story["access_mode"] != "passphrase" or not story["passphrase_hash"]:
                return self._send_json(200, {"unlocked": True})

            if not verify_password(passphrase, story["passphrase_hash"]):
                return self._send_json(401, {"error": "ລະຫັດຜ່ານເຂົ້າຊົມບໍ່ຖືກຕ້ອງ ລອງອີກເທື່ອເດີ້ 💙"})

            raw_token = secrets.token_urlsafe(32)
            csrf_token = secrets.token_hex(16)
            expires = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=3)).isoformat()
            conn.execute(
                """
                INSERT INTO sessions (id_hash, admin_id, visitor_scope, csrf_token, expires_at, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (hash_token(raw_token), None, story["id"], csrf_token, expires, now_iso()),
            )
            conn.commit()
            cookie_hdr = self._make_cookie_header("bl_visitor_session", raw_token, 3 * 86400, True)
            return self._send_json(200, {"unlocked": True}, extra_headers=[cookie_hdr])
        finally:
            conn.close()

    def handle_get_story(self, slug: str, query: dict):
        preview_mode = query.get("preview", ["0"])[0] == "1"
        conn = get_connection()
        try:
            story = conn.execute("SELECT * FROM stories WHERE slug = ?", (slug,)).fetchone()
            if not story:
                story = conn.execute("SELECT * FROM stories WHERE id = ?", (DEFAULT_STORY_ID,)).fetchone()
            if not story:
                return self._send_json(404, {"error": "ບໍ່ພົບເລື່ອງລາວນີ້"})

            if preview_mode:
                # Preview requires admin auth and returns live draft without saving responses
                auth = self._require_admin(conn, check_csrf=False)
                if not auth:
                    return
                draft_snapshot = build_story_snapshot(conn, story["id"], version_number=0)
                draft_snapshot["is_preview"] = True
                draft_snapshot["published_version_id"] = "preview-draft"
                return self._send_json(200, {"locked": False, "story": draft_snapshot})

            # Check published state
            if not story["published_version_id"]:
                return self._send_json(
                    404,
                    {
                        "error": "ເລື່ອງລາວນີ້ກຳລັງຖືກກະກຽມຢູ່ (ຍັງບໍ່ທັນເປີດໃຫ້ເຂົ້າຊົມ 💙)",
                        "unpublished": True,
                    },
                )

            # Check private passphrase gate on server before sending any story content
            if not self._has_visitor_access(conn, story):
                return self._send_json(
                    403,
                    {
                        "locked": True,
                        "slug": story["slug"],
                        "recipient_name": story["recipient_name"],
                        "message": "ຈົດໝາຍສະບັບນີ້ຖືກລັອກໄວ້ສຳລັບຄົນພິເສດ ກະລຸນາໃສ່ລະຫັດຜ່ານເພື່ອເປີດອ່ານ 💙",
                    },
                )

            ver = conn.execute(
                "SELECT * FROM story_versions WHERE id = ?", (story["published_version_id"],)
            ).fetchone()
            if not ver:
                return self._send_json(404, {"error": "ບໍ່ພົບຂໍ້ມູນເວີຊັນທີ່ເຜີຍແຜ່"})

            snapshot = json.loads(ver["snapshot_json"])
            snapshot["is_preview"] = False
            snapshot["published_version_id"] = ver["id"]
            snapshot["version_number"] = ver["version_number"]
            snapshot["published_at"] = ver["created_at"]
            return self._send_json(200, {"locked": False, "story": snapshot})
        finally:
            conn.close()

    def handle_get_media(self, media_id: str):
        conn = get_connection()
        try:
            story = conn.execute("SELECT * FROM stories WHERE id = ?", (DEFAULT_STORY_ID,)).fetchone()
            if story and not self._has_visitor_access(conn, story):
                return self._send_json(403, {"error": "Private media requires authorization"})

            media = conn.execute("SELECT * FROM media WHERE id = ?", (media_id,)).fetchone()
            if not media:
                return self._send_json(404, {"error": "Media not found"})

            file_path = (MEDIA_DIR / media["storage_key"]).resolve()
            if not str(file_path).startswith(str(MEDIA_DIR.resolve())) or not file_path.is_file():
                return self._send_json(404, {"error": "Media file missing on disk"})

            data = file_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", media["mime_type"])
            self.send_header("Content-Length", str(len(data)))
            self.send_header(
                "Cache-Control",
                "private, max-age=300" if story and story["access_mode"] == "passphrase" else "public, max-age=3600",
            )
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(data)
        finally:
            conn.close()

    # ==================== ADMIN ENDPOINTS ====================

    def handle_admin_get_story(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=False)
            if not auth:
                return

            story = conn.execute("SELECT * FROM stories WHERE id = ?", (DEFAULT_STORY_ID,)).fetchone()
            draft_snapshot = build_story_snapshot(conn, DEFAULT_STORY_ID, version_number=0)
            readiness = check_readiness_and_warnings(draft_snapshot)

            versions_rows = conn.execute(
                "SELECT id, version_number, created_at FROM story_versions WHERE story_id = ? ORDER BY version_number DESC",
                (DEFAULT_STORY_ID,),
            ).fetchall()
            versions = [dict(v) for v in versions_rows]

            media_list = list(get_media_dict(conn).values())
            for m in media_list:
                m["usages"] = is_media_referenced(conn, m["id"])

            response_count = conn.execute(
                "SELECT COUNT(*) AS cnt FROM responses WHERE story_id = ?", (DEFAULT_STORY_ID,)
            ).fetchone()["cnt"]

            return self._send_json(
                200,
                {
                    "draft": draft_snapshot,
                    "has_passphrase": bool(story["passphrase_hash"]),
                    "published_version_id": story["published_version_id"],
                    "updated_at": story["updated_at"],
                    "readiness": readiness,
                    "versions": versions,
                    "media": media_list,
                    "response_count": response_count,
                },
            )
        finally:
            conn.close()

    def handle_admin_patch_story(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return

            try:
                body = self._read_json(max_bytes=5 * 1024 * 1024)
            except Exception as e:
                return self._send_json(400, {"error": f"ຂໍ້ມູນ JSON ບໍ່ຖືກຕ້ອງ: {e}"})

            story = conn.execute("SELECT * FROM stories WHERE id = ?", (DEFAULT_STORY_ID,)).fetchone()
            if not story:
                return self._send_json(404, {"error": "Story not found"})

            ts = now_iso()
            with conn:
                # 1. Update profile & top-level fields if present
                sender_name = sanitize_text(body.get("sender_name", story["sender_name"]), 120)
                recipient_name = sanitize_text(body.get("recipient_name", story["recipient_name"]), 120)
                sender_nickname = sanitize_text(body.get("sender_nickname", story["sender_nickname"]), 80)
                recipient_nickname = sanitize_text(body.get("recipient_nickname", story["recipient_nickname"]), 80)
                slug = re.sub(r"[^a-zA-Z0-9_-]", "-", sanitize_text(body.get("slug", story["slug"]), 80)).strip("-") or DEFAULT_STORY_SLUG
                special_date = sanitize_text(body.get("special_date", story["special_date"]), 60)
                couple_photo_media_id = body.get("couple_photo_media_id", story["couple_photo_media_id"])

                theme = json.loads(story["theme_json"] or "{}")
                if isinstance(body.get("theme"), dict):
                    theme.update(body["theme"])

                music = json.loads(story["music_config_json"] or "{}")
                if isinstance(body.get("music"), dict):
                    music.update(body["music"])

                gift = json.loads(story["gift_config_json"] or "{}")
                if isinstance(body.get("gift"), dict):
                    gift.update(body["gift"])

                access_mode = body.get("access_mode", story["access_mode"])
                if access_mode not in ("public", "passphrase"):
                    access_mode = "public"

                passphrase_hash = story["passphrase_hash"]
                if "new_passphrase" in body and str(body["new_passphrase"]).strip():
                    passphrase_hash = hash_password(str(body["new_passphrase"]).strip())
                elif access_mode == "passphrase" and not passphrase_hash:
                    return self._send_json(
                        400,
                        {"error": "ກະລຸນາຕັ້ງລະຫັດຜ່ານສຳລັບຜູ້ຮັບກ່ອນເປີດໂໝດ Private Passphrase"},
                    )

                conn.execute(
                    """
                    UPDATE stories SET
                        slug = ?, sender_name = ?, recipient_name = ?,
                        sender_nickname = ?, recipient_nickname = ?,
                        couple_photo_media_id = ?, special_date = ?,
                        theme_json = ?, access_mode = ?, passphrase_hash = ?,
                        music_config_json = ?, gift_config_json = ?, updated_at = ?
                    WHERE id = ?
                    """,
                    (
                        slug,
                        sender_name,
                        recipient_name,
                        sender_nickname,
                        recipient_nickname,
                        couple_photo_media_id,
                        special_date,
                        json.dumps(theme, ensure_ascii=False),
                        access_mode,
                        passphrase_hash,
                        json.dumps(music, ensure_ascii=False),
                        json.dumps(gift, ensure_ascii=False),
                        ts,
                        DEFAULT_STORY_ID,
                    ),
                )

                # 2. Update stages if provided
                if isinstance(body.get("stages"), list):
                    for idx, st in enumerate(body["stages"], start=1):
                        st_id = sanitize_text(st.get("id"), 100)
                        if not st_id:
                            continue
                        title = sanitize_text(st.get("title", ""), 300)
                        st_body = sanitize_text(st.get("body", ""), 8000)
                        cta = sanitize_text(st.get("cta", "ໄປຕໍ່ 💙"), 150)
                        hint = sanitize_text(st.get("hint", ""), 500)
                        enabled = 1 if st.get("enabled", True) else 0
                        pos = int(st.get("position", idx))
                        cfg = st.get("config") if isinstance(st.get("config"), dict) else {}
                        conn.execute(
                            """
                            UPDATE stages SET
                                position = ?, enabled = ?, title = ?, body = ?, cta = ?, hint = ?, config_json = ?
                            WHERE id = ? AND story_id = ?
                            """,
                            (
                                pos,
                                enabled,
                                title,
                                st_body,
                                cta,
                                hint,
                                json.dumps(cfg, ensure_ascii=False),
                                st_id,
                                DEFAULT_STORY_ID,
                            ),
                        )

                # 3. Update memories if provided
                if isinstance(body.get("memories"), list):
                    conn.execute("DELETE FROM memories WHERE story_id = ?", (DEFAULT_STORY_ID,))
                    for idx, mem in enumerate(body["memories"], start=1):
                        mem_id = sanitize_text(mem.get("id") or f"mem-{uuid.uuid4().hex[:8]}", 80)
                        date_label = sanitize_text(mem.get("date_label", ""), 120)
                        title = sanitize_text(mem.get("title", ""), 200)
                        caption = sanitize_text(mem.get("caption", ""), 2000)
                        media_id = mem.get("media_id") or None
                        conn.execute(
                            """
                            INSERT INTO memories (id, story_id, date_label, title, caption, media_id, position)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                            """,
                            (mem_id, DEFAULT_STORY_ID, date_label, title, caption, media_id, idx),
                        )

                # 4. Update media metadata (alt_text / focal_point) if provided
                if isinstance(body.get("media_updates"), list):
                    for mu in body["media_updates"]:
                        m_id = sanitize_text(mu.get("id"), 100)
                        alt_text = sanitize_text(mu.get("alt_text", ""), 300)
                        focal_point = sanitize_text(mu.get("focal_point", "50% 50%"), 60)
                        conn.execute(
                            "UPDATE media SET alt_text = ?, focal_point = ? WHERE id = ?",
                            (alt_text, focal_point, m_id),
                        )

            draft_snapshot = build_story_snapshot(conn, DEFAULT_STORY_ID, version_number=0)
            readiness = check_readiness_and_warnings(draft_snapshot)
            return self._send_json(
                200,
                {
                    "ok": True,
                    "message": "ບັນທຶກຮ່າງ (Draft) ສຳເລັດແລ້ວ 💙",
                    "updated_at": ts,
                    "draft": draft_snapshot,
                    "readiness": readiness,
                },
            )
        finally:
            conn.close()

    def handle_admin_upload_media(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return

            ctype = self.headers.get("Content-Type", "")
            if "multipart/form-data" not in ctype:
                return self._send_json(400, {"error": "Expected multipart/form-data"})

            environ = {
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": ctype,
                "CONTENT_LENGTH": self.headers.get("Content-Length", "0"),
            }
            form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ=environ)
            if "file" not in form:
                return self._send_json(400, {"error": "ບໍ່ພົບໄຟລ໌ທີ່ອັບໂຫຼດ"})

            file_item = form["file"]
            if not getattr(file_item, "filename", None):
                return self._send_json(400, {"error": "ຊື່ໄຟລ໌ບໍ່ຖືກຕ້ອງ"})

            orig_name = Path(file_item.filename).name
            mime_type = (file_item.type or "").lower().strip()
            if not mime_type or mime_type == "application/octet-stream":
                guessed, _ = mimetypes.guess_type(orig_name)
                if guessed:
                    mime_type = guessed.lower()

            if mime_type not in ALLOWED_MIMES:
                return self._send_json(
                    400,
                    {
                        "error": f"ບໍ່ຮອງຮັບປະເພດໄຟລ໌ '{mime_type}'. ຮອງຮັບສະເພາະ ຮູບພາບ (JPG/PNG/WebP), ສຽງ (MP3/M4A/WAV) ແລະ ວິດີໂອ (MP4/WebM)."
                    },
                )

            max_allowed = ALLOWED_MIMES[mime_type]
            data = file_item.file.read(max_allowed + 1)
            if len(data) > max_allowed:
                limit_mb = max_allowed // (1024 * 1024)
                return self._send_json(
                    413,
                    {"error": f"ຂະໜາດໄຟລ໌ໃຫຍ່ເກີນກຳນົດ (ສູງສຸດ {limit_mb} MB ສຳລັບ {mime_type})"},
                )

            if len(data) == 0:
                return self._send_json(400, {"error": "ໄຟລ໌ວ່າງເປົ່າ (0 bytes)"})

            alt_text = sanitize_text(form.getvalue("alt_text", ""), 300)
            focal_point = sanitize_text(form.getvalue("focal_point", "50% 50%"), 60)

            ext = Path(orig_name).suffix.lower() or ".bin"
            ext = re.sub(r"[^a-z0-9.]", "", ext)[:10] or ".bin"
            media_id = f"med-{uuid.uuid4().hex[:12]}"
            storage_key = f"{media_id}{ext}"

            MEDIA_DIR.mkdir(parents=True, exist_ok=True)
            (MEDIA_DIR / storage_key).write_bytes(data)

            ts = now_iso()
            conn.execute(
                """
                INSERT INTO media (id, storage_key, original_name, mime_type, bytes, alt_text, focal_point, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (media_id, storage_key, orig_name, mime_type, len(data), alt_text, focal_point, ts),
            )
            conn.commit()

            media_obj = {
                "id": media_id,
                "url": f"/api/media/{media_id}",
                "original_name": orig_name,
                "mime_type": mime_type,
                "bytes": len(data),
                "alt_text": alt_text,
                "focal_point": focal_point,
                "created_at": ts,
                "usages": [],
            }
            return self._send_json(201, {"ok": True, "media": media_obj})
        finally:
            conn.close()

    def handle_admin_delete_media(self, media_id: str):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return

            media = conn.execute("SELECT * FROM media WHERE id = ?", (media_id,)).fetchone()
            if not media:
                return self._send_json(404, {"error": "ບໍ່ພົບໄຟລ໌ Media ນີ້"})

            usages = is_media_referenced(conn, media_id)
            if usages:
                return self._send_json(
                    409,
                    {
                        "error": f"ບໍ່ສາມາດລຶບໄຟລ໌ນີ້ໄດ້ ເພາະກຳລັງຖືກໃຊ້ຢູ່ໃນ: {', '.join(usages)}",
                        "usages": usages,
                    },
                )

            file_path = MEDIA_DIR / media["storage_key"]
            if file_path.exists():
                file_path.unlink()
            conn.execute("DELETE FROM media WHERE id = ?", (media_id,))
            conn.commit()
            return self._send_json(200, {"ok": True, "deleted_id": media_id})
        finally:
            conn.close()

    def handle_admin_publish(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return

            try:
                body = self._read_json()
            except Exception:
                body = {}

            allow_placeholders = bool(body.get("allow_placeholders", False))
            draft = build_story_snapshot(conn, DEFAULT_STORY_ID, version_number=0)
            readiness = check_readiness_and_warnings(draft)

            if not readiness["can_publish"]:
                return self._send_json(
                    400,
                    {
                        "error": "ຍັງບໍ່ສາມາດ Publish ໄດ້: " + " | ".join(readiness["blocking_errors"]),
                        "readiness": readiness,
                    },
                )

            if readiness["has_placeholders"] and not allow_placeholders:
                return self._send_json(
                    409,
                    {
                        "requires_confirmation": True,
                        "error": "ຍັງມີບາງຂໍ້ມູນເປັນຄ່າ Placeholder. ກະລຸນາກວດສອບ ຫຼື ຢືນຢັນວ່າຕ້ອງການ Publish ທັນທີ.",
                        "readiness": readiness,
                    },
                )

            max_ver_row = conn.execute(
                "SELECT COALESCE(MAX(version_number), 0) AS max_v FROM story_versions WHERE story_id = ?",
                (DEFAULT_STORY_ID,),
            ).fetchone()
            next_v = int(max_ver_row["max_v"]) + 1
            ver_id = f"ver-{next_v}-{uuid.uuid4().hex[:6]}"
            ts = now_iso()

            snapshot = build_story_snapshot(conn, DEFAULT_STORY_ID, version_number=next_v)
            snapshot["published_version_id"] = ver_id
            snapshot["published_at"] = ts

            with conn:
                conn.execute(
                    """
                    INSERT INTO story_versions (id, story_id, version_number, snapshot_json, created_at)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (ver_id, DEFAULT_STORY_ID, next_v, json.dumps(snapshot, ensure_ascii=False), ts),
                )
                conn.execute(
                    "UPDATE stories SET published_version_id = ?, updated_at = ? WHERE id = ?",
                    (ver_id, ts, DEFAULT_STORY_ID),
                )

            return self._send_json(
                200,
                {
                    "ok": True,
                    "message": f"Publish ສຳເລັດແລ້ວ (Version v{next_v}) 💙",
                    "published_version_id": ver_id,
                    "version_number": next_v,
                    "published_at": ts,
                },
            )
        finally:
            conn.close()

    def handle_admin_unpublish(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return
            ts = now_iso()
            conn.execute(
                "UPDATE stories SET published_version_id = NULL, updated_at = ? WHERE id = ?",
                (ts, DEFAULT_STORY_ID),
            )
            conn.commit()
            return self._send_json(
                200,
                {
                    "ok": True,
                    "message": "ປິດການເຂົ້າຊົມຊົ່ວຄາວ (Unpublished) ສຳເລັດແລ້ວ",
                    "published_version_id": None,
                },
            )
        finally:
            conn.close()

    def handle_admin_rollback(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return
            body = self._read_json()
            version_id = sanitize_text(body.get("version_id"), 100)
            ver = conn.execute(
                "SELECT * FROM story_versions WHERE id = ? AND story_id = ?",
                (version_id, DEFAULT_STORY_ID),
            ).fetchone()
            if not ver:
                return self._send_json(404, {"error": "ບໍ່ພົບເວີຊັນທີ່ຕ້ອງການຍ້ອນກັບ (Rollback)"})

            ts = now_iso()
            conn.execute(
                "UPDATE stories SET published_version_id = ?, updated_at = ? WHERE id = ?",
                (version_id, ts, DEFAULT_STORY_ID),
            )
            conn.commit()
            return self._send_json(
                200,
                {
                    "ok": True,
                    "message": f"ຍ້ອນກັບໄປໃຊ້ Version v{ver['version_number']} ສຳເລັດແລ້ວ 💙",
                    "published_version_id": version_id,
                    "version_number": ver["version_number"],
                },
            )
        finally:
            conn.close()

    def handle_post_response(self, slug: str):
        ip = self.client_address[0]
        if not check_rate_limit(ip, "visitor_response", max_requests=25, window_seconds=60):
            return self._send_json(429, {"error": "ສົ່ງຂໍ້ມູນໄວເກີນໄປ ກະລຸນາລໍຖ້າບຶດໜຶ່ງ 💙"})

        try:
            body = self._read_json()
        except Exception:
            return self._send_json(400, {"error": "Invalid JSON"})

        if body.get("is_preview"):
            # Brief requirement: "Preview ເປັນ draft ທີ່ມີ auth; ການທົດສອບບໍ່ບັນທຶກເປັນຄຳຕອບຈິງ."
            return self._send_json(
                200,
                {
                    "ok": True,
                    "simulated_preview": True,
                    "message": "ທົດສອບສົ່ງໃນໂໝດ Preview ສຳເລັດ (ບໍ່ໄດ້ບັນທຶກເປັນຄຳຕອບຈິງ)",
                },
            )

        conn = get_connection()
        try:
            story = conn.execute("SELECT * FROM stories WHERE slug = ?", (slug,)).fetchone()
            if not story:
                story = conn.execute("SELECT * FROM stories WHERE id = ?", (DEFAULT_STORY_ID,)).fetchone()
            if not story:
                return self._send_json(404, {"error": "Story not found"})

            if not self._has_visitor_access(conn, story):
                return self._send_json(403, {"error": "ກະລຸນາປົດລັອກລະຫັດຜ່ານກ່ອນສົ່ງຄຳຕອບ"})

            resp_type = sanitize_text(body.get("type"), 50)
            if resp_type not in ("date_choice", "heart_sent", "letter_reply"):
                return self._send_json(400, {"error": "ປະເພດຄຳຕອບບໍ່ຖືກຕ້ອງ"})

            idempotency_key = sanitize_text(body.get("idempotency_key"), 120)
            if not idempotency_key:
                idempotency_key = f"auto-{uuid.uuid4().hex}"

            # Check idempotency
            existing = conn.execute(
                "SELECT id, created_at FROM responses WHERE idempotency_key = ?",
                (idempotency_key,),
            ).fetchone()
            if existing:
                return self._send_json(
                    200,
                    {
                        "ok": True,
                        "duplicate": True,
                        "response_id": existing["id"],
                        "created_at": existing["created_at"],
                        "message": "ສົ່ງສຳເລັດແລ້ວ 💙",
                    },
                )

            raw_payload = body.get("payload") if isinstance(body.get("payload"), dict) else {}
            clean_payload = {}
            for k, v in raw_payload.items():
                clean_payload[sanitize_text(k, 60)] = sanitize_text(v, 3000)

            if resp_type == "letter_reply" and not clean_payload.get("message", "").strip():
                return self._send_json(400, {"error": "ກະລຸນາພິມຂໍ້ຄວາມຄຳຕອບກ່ອນກົດສົ່ງ 💙"})

            resp_id = f"resp-{uuid.uuid4().hex[:12]}"
            ts = now_iso()
            conn.execute(
                """
                INSERT INTO responses (id, story_id, version_id, type, payload_json, idempotency_key, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    resp_id,
                    story["id"],
                    story["published_version_id"],
                    resp_type,
                    json.dumps(clean_payload, ensure_ascii=False),
                    idempotency_key,
                    ts,
                ),
            )
            conn.commit()
            return self._send_json(
                201,
                {
                    "ok": True,
                    "response_id": resp_id,
                    "created_at": ts,
                    "message": "ສົ່ງສຳເລັດ 💙 ຂໍ້ຄວາມຂອງເຈົ້າຖືກບັນທຶກໄວ້ແລ້ວ",
                },
            )
        finally:
            conn.close()

    def handle_admin_get_responses(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=False)
            if not auth:
                return
            rows = conn.execute(
                "SELECT * FROM responses WHERE story_id = ? ORDER BY created_at DESC",
                (DEFAULT_STORY_ID,),
            ).fetchall()
            items = []
            for r in rows:
                items.append(
                    {
                        "id": r["id"],
                        "version_id": r["version_id"],
                        "type": r["type"],
                        "payload": json.loads(r["payload_json"] or "{}"),
                        "created_at": r["created_at"],
                    }
                )
            return self._send_json(200, {"responses": items})
        finally:
            conn.close()

    def handle_admin_delete_response(self, query: dict):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return
            resp_id = sanitize_text((query.get("id") or [""])[0], 100)
            if not resp_id:
                return self._send_json(400, {"error": "Missing response id"})
            conn.execute("DELETE FROM responses WHERE id = ? AND story_id = ?", (resp_id, DEFAULT_STORY_ID))
            conn.commit()
            return self._send_json(200, {"ok": True, "deleted_id": resp_id})
        finally:
            conn.close()

    def handle_admin_change_password(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return
            body = self._read_json()
            current_pw = str(body.get("current_password", ""))
            new_pw = str(body.get("new_password", ""))
            new_email = sanitize_text(body.get("email", auth["admin"]["email"]), 200).lower()

            admin_row = conn.execute(
                "SELECT * FROM admins WHERE id = ?", (auth["admin"]["id"],)
            ).fetchone()
            if not verify_password(current_pw, admin_row["password_hash"]):
                return self._send_json(400, {"error": "ລະຫັດຜ່ານປັດຈຸບັນບໍ່ຖືກຕ້ອງ"})

            if new_pw and len(new_pw) < 8:
                return self._send_json(400, {"error": "ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ"})

            pw_hash = hash_password(new_pw) if new_pw else admin_row["password_hash"]
            conn.execute(
                "UPDATE admins SET email = ?, password_hash = ? WHERE id = ?",
                (new_email, pw_hash, auth["admin"]["id"]),
            )
            conn.commit()
            return self._send_json(200, {"ok": True, "message": "ອັບເດດຂໍ້ມູນບັນຊີ Admin ສຳເລັດແລ້ວ"})
        finally:
            conn.close()

    def handle_admin_backup(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=False)
            if not auth:
                return
            draft = build_story_snapshot(conn, DEFAULT_STORY_ID, version_number=0)
            responses = [
                {
                    "id": r["id"],
                    "version_id": r["version_id"],
                    "type": r["type"],
                    "payload": json.loads(r["payload_json"] or "{}"),
                    "created_at": r["created_at"],
                }
                for r in conn.execute("SELECT * FROM responses WHERE story_id = ?", (DEFAULT_STORY_ID,)).fetchall()
            ]
            backup_data = {
                "app": "BLUE_LETTER",
                "exported_at": now_iso(),
                "draft": draft,
                "responses": responses,
            }
            return self._send_json(200, backup_data)
        finally:
            conn.close()

    def handle_admin_restore(self):
        conn = get_connection()
        try:
            auth = self._require_admin(conn, check_csrf=True)
            if not auth:
                return
            body = self._read_json(max_bytes=5 * 1024 * 1024)
            draft = body.get("draft")
            if not isinstance(draft, dict) or "stages" not in draft:
                return self._send_json(400, {"error": "ໄຟລ໌ Backup ບໍ່ຖືກຕ້ອງ"})

            # Reuse patch logic by forwarding draft fields
            ts = now_iso()
            with conn:
                conn.execute(
                    """
                    UPDATE stories SET
                        sender_name = ?, recipient_name = ?, sender_nickname = ?, recipient_nickname = ?,
                        special_date = ?, theme_json = ?, music_config_json = ?, gift_config_json = ?, updated_at = ?
                    WHERE id = ?
                    """,
                    (
                        sanitize_text(draft.get("sender_name", "[ຊື່ຜູ້ສົ່ງ]"), 120),
                        sanitize_text(draft.get("recipient_name", "[ຊື່ແຟນ]"), 120),
                        sanitize_text(draft.get("sender_nickname", "ຂ້ອຍ"), 80),
                        sanitize_text(draft.get("recipient_nickname", "ເຈົ້າ"), 80),
                        sanitize_text(draft.get("special_date", ""), 60),
                        json.dumps(draft.get("theme", {}), ensure_ascii=False),
                        json.dumps(draft.get("music", {}), ensure_ascii=False),
                        json.dumps(draft.get("gift", {}), ensure_ascii=False),
                        ts,
                        DEFAULT_STORY_ID,
                    ),
                )
                for idx, st in enumerate(draft.get("stages", []), start=1):
                    conn.execute(
                        """
                        UPDATE stages SET
                            position = ?, enabled = ?, title = ?, body = ?, cta = ?, hint = ?, config_json = ?
                        WHERE id = ? AND story_id = ?
                        """,
                        (
                            int(st.get("position", idx)),
                            1 if st.get("enabled", True) else 0,
                            sanitize_text(st.get("title", ""), 300),
                            sanitize_text(st.get("body", ""), 8000),
                            sanitize_text(st.get("cta", "ໄປຕໍ່ 💙"), 150),
                            sanitize_text(st.get("hint", ""), 500),
                            json.dumps(st.get("config", {}), ensure_ascii=False),
                            st.get("id"),
                            DEFAULT_STORY_ID,
                        ),
                    )
            return self._send_json(200, {"ok": True, "message": "ກູ້ຄືນຂໍ້ມູນ (Restore Draft) ສຳເລັດແລ້ວ 💙"})
        finally:
            conn.close()


def run_server():
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), BlueLetterHandler)
    print(f"💙 BLUE LETTER server listening on http://{HOST}:{PORT}")
    print(f"   Visitor Journey: http://{HOST}:{PORT}/")
    print(f"   Admin CMS:       http://{HOST}:{PORT}/admin")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down BLUE LETTER server...")
        server.server_close()


if __name__ == "__main__":
    run_server()
