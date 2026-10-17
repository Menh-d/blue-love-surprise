-- 001_init.sql: BLUE LETTER Database Schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    sender_name TEXT NOT NULL DEFAULT '[ຊື່ຜູ້ສົ່ງ]',
    recipient_name TEXT NOT NULL DEFAULT '[ຊື່ແຟນ]',
    sender_nickname TEXT NOT NULL DEFAULT 'ຂ້ອຍ',
    recipient_nickname TEXT NOT NULL DEFAULT 'ເຈົ້າ',
    couple_photo_media_id TEXT,
    special_date TEXT NOT NULL DEFAULT '',
    theme_json TEXT NOT NULL DEFAULT '{}',
    access_mode TEXT NOT NULL DEFAULT 'public', -- 'public' or 'passphrase'
    passphrase_hash TEXT,
    published_version_id TEXT,
    music_config_json TEXT NOT NULL DEFAULT '{}',
    gift_config_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stages (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL,
    type TEXT NOT NULL,
    position INTEGER NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    cta TEXT NOT NULL,
    hint TEXT NOT NULL DEFAULT '',
    config_json TEXT NOT NULL DEFAULT '{}',
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL,
    date_label TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL,
    media_id TEXT,
    position INTEGER NOT NULL,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    storage_key TEXT UNIQUE NOT NULL,
    original_name TEXT NOT NULL DEFAULT '',
    mime_type TEXT NOT NULL,
    bytes INTEGER NOT NULL,
    alt_text TEXT NOT NULL DEFAULT '',
    focal_point TEXT NOT NULL DEFAULT '50% 50%',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS story_versions (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    snapshot_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL,
    version_id TEXT,
    type TEXT NOT NULL, -- 'date_choice', 'heart_sent', 'letter_reply'
    payload_json TEXT NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id_hash TEXT PRIMARY KEY,
    admin_id TEXT,
    visitor_scope TEXT, -- e.g. story_id for unlocked private stories
    csrf_token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stages_story_pos ON stages(story_id, position);
CREATE INDEX IF NOT EXISTS idx_memories_story_pos ON memories(story_id, position);
CREATE INDEX IF NOT EXISTS idx_versions_story ON story_versions(story_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_responses_story ON responses(story_id, created_at DESC);
