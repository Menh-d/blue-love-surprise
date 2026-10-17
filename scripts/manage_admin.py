#!/usr/bin/env python3
"""
Server-side Admin setup & password recovery script for BLUE LETTER.
Usage:
  python3 scripts/manage_admin.py --email admin@blueletter.local --password "NewStrongPassword123!"
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from db import get_connection, hash_password, init_db, now_iso


def main():
    parser = argparse.ArgumentParser(description="Create or reset Admin credentials on the server.")
    parser.add_argument("--email", required=True, help="Admin email address")
    parser.add_argument("--password", required=True, help="New Admin password (min 8 chars)")
    args = parser.parse_args()

    if len(args.password) < 8:
        print("Error: Password must be at least 8 characters.", file=sys.stderr)
        sys.exit(1)

    init_db()
    conn = get_connection()
    email = args.email.lower().strip()
    pw_hash = hash_password(args.password)

    with conn:
        row = conn.execute("SELECT id FROM admins WHERE email = ?", (email,)).fetchone()
        if row:
            conn.execute("UPDATE admins SET password_hash = ? WHERE id = ?", (pw_hash, row["id"]))
            print(f"✓ Updated password for Admin '{email}'")
        else:
            conn.execute(
                "INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (f"admin-{email}", email, pw_hash, now_iso()),
            )
            print(f"✓ Created Admin '{email}'")
    conn.close()


if __name__ == "__main__":
    main()
