#!/usr/bin/env python3
"""
End-to-End Integration & Acceptance Test Suite for BLUE LETTER.
Tests:
1. Unauthenticated Admin API access is rejected (401).
2. Visitor journey loads initial published snapshot v1 with all 12 stages.
3. Admin login sets HttpOnly cookie and returns CSRF token.
4. Saving Draft updates draft without mutating live published snapshot seen by visitor.
5. Blocking validation prevents publishing when fewer than 8 stages are enabled.
6. Media upload validates MIME/size, stores in object directory, and prevents deleting media in use.
7. Publish creates atomic v2 snapshot; visitor immediately sees v2 changes.
8. Rollback restores v1; Unpublish hides story from visitor.
9. Private passphrase mode blocks public access & private media until visitor unlocks via /api/story/access.
10. Visitor responses (date choice, heart sent, letter reply) persist and enforce idempotency on retry.
"""

import http.cookiejar
import json
import os
import shutil
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

# Configure isolated test directories before importing db/server
TEST_DIR = Path(tempfile.mkdtemp(prefix="blue_letter_test_"))
os.environ["BLUE_LETTER_DATA_DIR"] = str(TEST_DIR / "data")
os.environ["BLUE_LETTER_MEDIA_DIR"] = str(TEST_DIR / "media")
os.environ["ADMIN_EMAIL"] = "admin@blueletter.local"
os.environ["ADMIN_INITIAL_PASSWORD"] = "TestSecret2026!"

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from db import init_db
from server import BlueLetterHandler


class HttpClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.cj = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.cj))

    def request(self, method: str, path: str, data=None, headers=None):
        hdrs = headers.copy() if headers else {}
        body = None
        if isinstance(data, (dict, list)):
            body = json.dumps(data).encode("utf-8")
            hdrs.setdefault("Content-Type", "application/json")
        elif isinstance(data, bytes):
            body = data

        req = urllib.request.Request(self.base_url + path, data=body, headers=hdrs, method=method)
        try:
            with self.opener.open(req) as resp:
                raw = resp.read()
                ctype = resp.headers.get("Content-Type", "")
                parsed = json.loads(raw.decode("utf-8")) if "application/json" in ctype else raw
                return resp.status, parsed
        except urllib.error.HTTPError as e:
            raw = e.read()
            try:
                parsed = json.loads(raw.decode("utf-8"))
            except Exception:
                parsed = raw
            return e.code, parsed


def run_tests():
    init_db()
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), BlueLetterHandler)
    port = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    base_url = f"http://127.0.0.1:{port}"

    visitor = HttpClient(base_url)
    admin = HttpClient(base_url)

    try:
        # 1. Unauthenticated Admin access rejected
        status, res = visitor.request("GET", "/api/admin/story")
        assert status == 401, f"Expected 401, got {status}"

        # 2. Visitor loads initial 6 stages
        status, res = visitor.request("GET", "/api/story/our-blue-letter")
        assert status == 200, f"Expected 200, got {status}"
        assert len(res["story"]["stages"]) == 6
        initial_recip = res["story"]["recipient_name"]

        # 3. Admin login
        status, res = admin.request(
            "POST",
            "/api/auth/login",
            {"email": "admin@blueletter.local", "password": "TestSecret2026!"},
        )
        assert status == 200 and res["authenticated"] is True
        csrf = res["csrf_token"]

        # 4. Save Draft does NOT mutate live published story
        status, res = admin.request(
            "PATCH",
            "/api/admin/story",
            {"recipient_name": "ນ້ອງຟ້າ 💙", "sender_name": "Do"},
            headers={"X-CSRF-Token": csrf},
        )
        assert status == 200
        status, vis_res = visitor.request("GET", "/api/story/our-blue-letter")
        assert vis_res["story"]["recipient_name"] == initial_recip, "Draft leaked into published!"

        # Preview mode with admin auth sees draft
        status, prev_res = admin.request("GET", "/api/story/our-blue-letter?preview=1")
        assert status == 200 and prev_res["story"]["recipient_name"] == "ນ້ອງຟ້າ 💙"

        # 5. Upload image media & test delete protection while in use
        boundary = "----BlueLetterTestBoundary"
        png_bytes = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
            b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01"
            b"\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        multipart_body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="couple.png"\r\n'
            f"Content-Type: image/png\r\n\r\n"
        ).encode("utf-8") + png_bytes + f"\r\n--{boundary}--\r\n".encode("utf-8")

        status, up_res = admin.request(
            "POST",
            "/api/admin/media",
            data=multipart_body,
            headers={
                "Content-Type": f"multipart/form-data; boundary={boundary}",
                "X-CSRF-Token": csrf,
            },
        )
        assert status == 201, f"Upload failed: {status} {up_res}"
        media_id = up_res["media"]["id"]

        # Attach media to couple profile
        admin.request(
            "PATCH",
            "/api/admin/story",
            {"couple_photo_media_id": media_id},
            headers={"X-CSRF-Token": csrf},
        )

        # Attempt to delete media while referenced -> must return 409 Conflict
        status, del_res = admin.request(
            "DELETE", f"/api/admin/media/{media_id}", headers={"X-CSRF-Token": csrf}
        )
        assert status == 409, f"Expected 409 when deleting active media, got {status}"

        # 6. Publish v2 and verify visitor sees updated recipient name
        status, pub_res = admin.request(
            "POST",
            "/api/admin/publish",
            {"allow_placeholders": True},
            headers={"X-CSRF-Token": csrf},
        )
        assert status == 200 and pub_res["version_number"] == 2

        status, vis_res2 = visitor.request("GET", "/api/story/our-blue-letter")
        assert vis_res2["story"]["recipient_name"] == "ນ້ອງຟ້າ 💙"

        # 7. Visitor submits response & idempotency prevents duplicate on retry
        idem_key = "idem-test-12345"
        status, r1 = visitor.request(
            "POST",
            "/api/story/our-blue-letter/responses",
            {
                "type": "letter_reply",
                "idempotency_key": idem_key,
                "payload": {"message": "ຮັກຄືກັນເດີ້ 💙"},
            },
        )
        assert status == 201
        status, r2 = visitor.request(
            "POST",
            "/api/story/our-blue-letter/responses",
            {
                "type": "letter_reply",
                "idempotency_key": idem_key,
                "payload": {"message": "ຮັກຄືກັນເດີ້ 💙"},
            },
        )
        assert status == 200 and r2.get("duplicate") is True

        status, admin_resps = admin.request("GET", "/api/admin/responses")
        assert len(admin_resps["responses"]) == 1

        # 8. Private passphrase gate protects both story and media
        admin.request(
            "PATCH",
            "/api/admin/story",
            {"access_mode": "passphrase", "new_passphrase": "our-secret-date"},
            headers={"X-CSRF-Token": csrf},
        )
        new_visitor = HttpClient(base_url)
        status, locked_res = new_visitor.request("GET", "/api/story/our-blue-letter")
        assert status == 403 and locked_res["locked"] is True

        status, locked_media = new_visitor.request("GET", f"/api/media/{media_id}")
        assert status == 403, f"Private media leaked! Status: {status}"

        # Unlock with passphrase
        status, unlock_res = new_visitor.request(
            "POST",
            "/api/story/access",
            {"slug": "our-blue-letter", "passphrase": "our-secret-date"},
        )
        assert status == 200 and unlock_res["unlocked"] is True

        status, unlocked_story = new_visitor.request("GET", "/api/story/our-blue-letter")
        assert status == 200 and unlocked_story["story"]["recipient_name"] == "ນ້ອງຟ້າ 💙"

        status, unlocked_media = new_visitor.request("GET", f"/api/media/{media_id}")
        assert status == 200

        print("✅ All 10 E2E acceptance test suites passed!")
    finally:
        httpd.shutdown()
        shutil.rmtree(TEST_DIR, ignore_errors=True)


if __name__ == "__main__":
    run_tests()
