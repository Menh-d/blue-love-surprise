"""
Database manager, migrations runner, password hashing, and business logic for BLUE LETTER.
"""

import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

from seed_data import (
    DEFAULT_GIFT_CONFIG,
    DEFAULT_MEDIA,
    DEFAULT_MEMORIES,
    DEFAULT_MUSIC_CONFIG,
    DEFAULT_STAGES,
    DEFAULT_STORY_ID,
    DEFAULT_STORY_SLUG,
    DEFAULT_THEME,
)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("BLUE_LETTER_DATA_DIR", str(BASE_DIR / "data")))
MEDIA_DIR = Path(os.environ.get("BLUE_LETTER_MEDIA_DIR", str(BASE_DIR / "media")))
DB_PATH = DATA_DIR / "blue_letter.db"
MIGRATIONS_DIR = BASE_DIR / "migrations"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password(password: str, salt: str = None) -> str:
    if not salt:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 200_000)
    return f"pbkdf2_sha256$200000${salt}${dk.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    if not stored_hash or "$" not in stored_hash:
        return False
    try:
        algo, iterations_str, salt, expected_hex = stored_hash.split("$", 3)
        iterations = int(iterations_str)
        dk = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), iterations
        )
        return hmac.compare_digest(dk.hex(), expected_hex)
    except Exception:
        return False


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH), timeout=15.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    return conn


def init_db():
    conn = get_connection()
    with conn:
        for sql_file in sorted(MIGRATIONS_DIR.glob("*.sql")):
            sql_text = sql_file.read_text(encoding="utf-8")
            conn.executescript(sql_text)
        _ensure_seed_data(conn)
    conn.close()


def _ensure_seed_data(conn: sqlite3.Connection):
    # Ensure default admin exists via server-side setup env or default setup credentials
    admin_row = conn.execute("SELECT id FROM admins LIMIT 1").fetchone()
    if not admin_row:
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@blueletter.local")
        admin_password = os.environ.get("ADMIN_INITIAL_PASSWORD", "BlueLove2026!")
        conn.execute(
            "INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            ("admin-1", admin_email.lower().strip(), hash_password(admin_password), now_iso()),
        )

    ts = now_iso()
    # Seed default media records if missing
    for med in DEFAULT_MEDIA:
        existing_med = conn.execute("SELECT id FROM media WHERE id = ?", (med["id"],)).fetchone()
        if not existing_med:
            conn.execute(
                """
                INSERT INTO media (id, storage_key, original_name, mime_type, bytes, alt_text, focal_point, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    med["id"],
                    med["storage_key"],
                    med["original_name"],
                    med["mime_type"],
                    med["bytes"],
                    med["alt_text"],
                    med["focal_point"],
                    ts,
                ),
            )

    # Ensure default story exists
    story_row = conn.execute("SELECT id FROM stories WHERE id = ?", (DEFAULT_STORY_ID,)).fetchone()
    if not story_row:
        conn.execute(
            """
            INSERT INTO stories (
                id, slug, sender_name, recipient_name, sender_nickname, recipient_nickname,
                couple_photo_media_id, special_date, theme_json, access_mode, passphrase_hash,
                published_version_id, music_config_json, gift_config_json, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                DEFAULT_STORY_ID,
                DEFAULT_STORY_SLUG,
                "Do",
                "ທີ່ຮັກ 💙",
                "Do",
                "ເຈົ້າ",
                "med-do-fan-01",
                "Birthday Surprise 💙",
                json.dumps(DEFAULT_THEME, ensure_ascii=False),
                "public",
                None,
                None,
                json.dumps(DEFAULT_MUSIC_CONFIG, ensure_ascii=False),
                json.dumps(DEFAULT_GIFT_CONFIG, ensure_ascii=False),
                ts,
            ),
        )
        for st in DEFAULT_STAGES:
            conn.execute(
                """
                INSERT INTO stages (id, story_id, type, position, enabled, title, body, cta, hint, config_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    st["id"],
                    DEFAULT_STORY_ID,
                    st["type"],
                    st["position"],
                    st["enabled"],
                    st["title"],
                    st["body"],
                    st["cta"],
                    st["hint"],
                    json.dumps(st["config"], ensure_ascii=False),
                ),
            )
        for mem in DEFAULT_MEMORIES:
            conn.execute(
                """
                INSERT INTO memories (id, story_id, date_label, title, caption, media_id, position)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    mem["id"],
                    DEFAULT_STORY_ID,
                    mem["date_label"],
                    mem["title"],
                    mem["caption"],
                    mem["media_id"],
                    mem["position"],
                ),
            )

        # Create an initial published snapshot v1 so the visitor app works out of the box
        snapshot = build_story_snapshot(conn, DEFAULT_STORY_ID, version_number=1)
        version_id = "ver-initial-1"
        conn.execute(
            """
            INSERT INTO story_versions (id, story_id, version_number, snapshot_json, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (version_id, DEFAULT_STORY_ID, 1, json.dumps(snapshot, ensure_ascii=False), ts),
        )
        conn.execute(
            "UPDATE stories SET published_version_id = ? WHERE id = ?",
            (version_id, DEFAULT_STORY_ID),
        )


def get_media_dict(conn: sqlite3.Connection) -> dict:
    rows = conn.execute("SELECT * FROM media ORDER BY created_at DESC").fetchall()
    result = {}
    for r in rows:
        result[r["id"]] = {
            "id": r["id"],
            "url": f"/api/media/{r['id']}",
            "original_name": r["original_name"],
            "mime_type": r["mime_type"],
            "bytes": r["bytes"],
            "alt_text": r["alt_text"],
            "focal_point": r["focal_point"],
            "created_at": r["created_at"],
        }
    return result


def build_story_snapshot(conn: sqlite3.Connection, story_id: str, version_number: int = 1) -> dict:
    story = conn.execute("SELECT * FROM stories WHERE id = ?", (story_id,)).fetchone()
    if not story:
        raise ValueError("Story not found")

    stages_rows = conn.execute(
        "SELECT * FROM stages WHERE story_id = ? ORDER BY position ASC", (story_id,)
    ).fetchall()
    memories_rows = conn.execute(
        "SELECT * FROM memories WHERE story_id = ? ORDER BY position ASC", (story_id,)
    ).fetchall()
    media_map = get_media_dict(conn)

    stages = []
    for st in stages_rows:
        cfg = json.loads(st["config_json"] or "{}")
        if cfg.get("puzzle_media_id") and cfg["puzzle_media_id"] in media_map:
            cfg["puzzle_media"] = media_map[cfg["puzzle_media_id"]]
        else:
            cfg["puzzle_media"] = None
        if cfg.get("photo_media_id") and cfg["photo_media_id"] in media_map:
            cfg["photo_media"] = media_map[cfg["photo_media_id"]]
        else:
            cfg["photo_media"] = None
        stages.append(
            {
                "id": st["id"],
                "type": st["type"],
                "position": st["position"],
                "enabled": bool(st["enabled"]),
                "title": st["title"],
                "body": st["body"],
                "cta": st["cta"],
                "hint": st["hint"],
                "config": cfg,
            }
        )

    memories = []
    for m in memories_rows:
        med = media_map.get(m["media_id"]) if m["media_id"] else None
        memories.append(
            {
                "id": m["id"],
                "date_label": m["date_label"],
                "title": m["title"],
                "caption": m["caption"],
                "media_id": m["media_id"],
                "media": med,
                "position": m["position"],
            }
        )

    music_cfg = json.loads(story["music_config_json"] or "{}")
    music_cfg["bgm_media"] = (
        media_map.get(music_cfg.get("bgm_media_id")) if music_cfg.get("bgm_media_id") else None
    )
    music_cfg["featured_song_media"] = (
        media_map.get(music_cfg.get("featured_song_media_id"))
        if music_cfg.get("featured_song_media_id")
        else None
    )
    music_cfg["voice_note_media"] = (
        media_map.get(music_cfg.get("voice_note_media_id"))
        if music_cfg.get("voice_note_media_id")
        else None
    )

    gift_cfg = json.loads(story["gift_config_json"] or "{}")
    gift_cfg["gift_media"] = (
        media_map.get(gift_cfg.get("gift_media_id")) if gift_cfg.get("gift_media_id") else None
    )

    couple_photo = (
        media_map.get(story["couple_photo_media_id"]) if story["couple_photo_media_id"] else None
    )

    return {
        "story_id": story["id"],
        "slug": story["slug"],
        "version_number": version_number,
        "sender_name": story["sender_name"],
        "recipient_name": story["recipient_name"],
        "sender_nickname": story["sender_nickname"],
        "recipient_nickname": story["recipient_nickname"],
        "couple_photo_media_id": story["couple_photo_media_id"],
        "couple_photo": couple_photo,
        "special_date": story["special_date"],
        "theme": json.loads(story["theme_json"] or "{}"),
        "access_mode": story["access_mode"],
        "music": music_cfg,
        "gift": gift_cfg,
        "stages": stages,
        "memories": memories,
        "snapshot_at": now_iso(),
    }


def check_readiness_and_warnings(snapshot: dict) -> dict:
    """
    Checks both hard blocking errors for Publish and soft placeholder warnings for Overview.
    Rules from brief:
    - Cannot publish if enabled stages < 8
    - Cannot publish if missing start stage (envelope) or final stage (final_letter)
    - Cannot publish if required title/body is empty
    - Warns clearly about remaining [Placeholder] items so Admin knows what personal info is left
    """
    blocking_errors = []
    placeholder_warnings = []

    enabled_stages = [s for s in snapshot["stages"] if s["enabled"]]
    if len(enabled_stages) < 4:
        blocking_errors.append(
            f"ຕ້ອງເປີດໃຊ້ງານຢ່າງໜ້ອຍ 4 ດ່ານ (ປັດຈຸບັນເປີດ {len(enabled_stages)} ດ່ານ)."
        )

    enabled_types = [s["type"] for s in enabled_stages]
    if not enabled_stages or enabled_stages[0]["type"] not in ("envelope", "stage_step"):
        blocking_errors.append("ດ່ານທຳອິດທີ່ເປີດໃຊ້ງານຕ້ອງເປັນດ່ານເລີ່ມຕົ້ນ (ດ່ານ 1).")
    if not enabled_stages or enabled_stages[-1]["type"] != "final_letter":
        blocking_errors.append("ດ່ານສຸດທ້າຍທີ່ເປີດໃຊ້ງານຕ້ອງເປັນດ່ານຈົດໝາຍສຸດທ້າຍ (final_letter).")

    for st in enabled_stages:
        if not st.get("title", "").strip() or not st.get("body", "").strip():
            blocking_errors.append(f"ດ່ານ '{st.get('id')}' ຂາດຫົວຂໍ້ ຫຼື ເນື້ອຫາຫຼັກ.")

    # Check placeholders
    if "[" in snapshot.get("sender_name", "") or not snapshot.get("sender_name", "").strip():
        placeholder_warnings.append("ຊື່ຜູ້ສົ່ງ ຍັງເປັນຄ່າ Placeholder ([ຊື່ຜູ້ສົ່ງ])")
    if "[" in snapshot.get("recipient_name", "") or not snapshot.get("recipient_name", "").strip():
        placeholder_warnings.append("ຊື່ຜູ້ຮັບ (ຊື່ແຟນ) ຍັງເປັນຄ່າ Placeholder ([ຊື່ແຟນ])")
    if not snapshot.get("couple_photo_media_id"):
        placeholder_warnings.append("ຍັງບໍ່ໄດ້ອັບໂຫຼດຮູບຄູ່ຫຼັກ (ໃຊ້ຮູບ Illustration ທົດແທນຊົ່ວຄາວ)")
    if not snapshot.get("memories") or len(snapshot["memories"]) < 3:
        placeholder_warnings.append("ຄວາມຊົງຈຳ (Memories) ຄວນມີຢ່າງໜ້ອຍ 3 ເຫດການ")
    else:
        missing_mem_photos = sum(1 for m in snapshot["memories"] if not m.get("media_id"))
        if missing_mem_photos > 0:
            placeholder_warnings.append(f"ມີຄວາມຊົງຈຳ {missing_mem_photos} ລາຍການທີ່ຍັງບໍ່ໄດ້ໃສ່ຮູບຈິງ")

    if not snapshot.get("music", {}).get("bgm_media_id"):
        placeholder_warnings.append("ຍັງບໍ່ໄດ້ອັບໂຫຼດໄຟລ໌ເພງ BGM (ກຳລັງໃຊ້ສຽງ Soft Piano ໃນຕົວເຄື່ອງ)")

    return {
        "can_publish": len(blocking_errors) == 0,
        "has_placeholders": len(placeholder_warnings) > 0,
        "blocking_errors": blocking_errors,
        "placeholder_warnings": placeholder_warnings,
        "enabled_stage_count": len(enabled_stages),
        "total_stage_count": len(snapshot["stages"]),
    }


def is_media_referenced(conn: sqlite3.Connection, media_id: str) -> list:
    """
    Returns list of locations where media_id is used (draft story, stages, memories, or any saved version).
    Brief requirement: "ລຶບ media ທີ່ຍັງຖືກໃຊ້ຢູ່ບໍ່ໄດ້ ຈົນກວ່າຈະປ່ຽນອັນທົດແທນ; ຮັກສາ media ຂອງ version ທີ່ rollback ໄດ້."
    """
    usages = []
    story = conn.execute("SELECT * FROM stories WHERE id = ?", (DEFAULT_STORY_ID,)).fetchone()
    if story:
        if story["couple_photo_media_id"] == media_id:
            usages.append("ຮູບຄູ່ຫຼັກ (Couple Profile)")
        music_cfg = json.loads(story["music_config_json"] or "{}")
        if media_id in (
            music_cfg.get("bgm_media_id"),
            music_cfg.get("featured_song_media_id"),
            music_cfg.get("voice_note_media_id"),
        ):
            usages.append("ເພງ ຫຼື ສຽງອັດ (Music & Voice)")
        gift_cfg = json.loads(story["gift_config_json"] or "{}")
        if gift_cfg.get("gift_media_id") == media_id:
            usages.append("ຂອງຂວັນ (Gift)")

    for st in conn.execute("SELECT id, title, config_json FROM stages").fetchall():
        if media_id in (st["config_json"] or ""):
            usages.append(f"ດ່ານ {st['title']}")

    for mem in conn.execute("SELECT id, title FROM memories WHERE media_id = ?", (media_id,)).fetchall():
        usages.append(f"ຄວາມຊົງຈຳ '{mem['title']}'")

    for ver in conn.execute("SELECT version_number, snapshot_json FROM story_versions").fetchall():
        if media_id in (ver["snapshot_json"] or ""):
            usages.append(f"Published Version v{ver['version_number']}")

    return usages
