# BLUE LETTER — ຈົດໝາຍສີຟ້າຈາກຫົວໃຈ 💙

ເວັບໄຊເຊີໄພຣສ໌ແຟນ ໃນຮູບແບບ **Interactive Love Story 12 ດ່ານ** ພ້ອມລະບົບ **Admin CMS ແທ້** (Database + Object Storage + Draft/Publish Snapshot + Private Passphrase Protection) ຕາມຂໍ້ກຳນົດໃນ `Blue_Love_Surprise_Web_Brief.md`.

---

## 1. ການເລີ່ມຕົ້ນໃຊ້ງານ (Quick Start)

### 1.1 ຕັ້ງຄ່າ Environment Variables (ທາງເລືອກ)
ຄັດລອກໄຟລ໌ `.env.example` ເພື່ອກຳນົດຄ່າເລີ່ມຕົ້ນ:
```bash
cp .env.example .env
```

### 1.2 ລັນລະບົບເວັບ & Database Migration ອັດຕະໂນມັດ
```bash
python3 server.py
```
ເມື່ອເປີດຄັ້ງທຳອິດ ລະບົບຈະລັນ SQLite Migration (`migrations/001_init.sql`) ແລະ ສ້າງຂໍ້ມູນເລີ່ມຕົ້ນ (Seed Content) ທັງ 12 ດ່ານໂດຍອັດຕະໂນມັດ.

- **ໜ້າເວັບສຳລັບແຟນ (Visitor Journey):** `http://127.0.0.1:8080/` ຫຼື `http://127.0.0.1:8080/s/our-blue-letter`
- **ໜ້າຈັດການ Admin CMS:** `http://127.0.0.1:8080/admin`

---

## 2. ບັນຊີ Admin & ການປ່ຽນ/ກູ້ຄືນລະຫັດຜ່ານ

- **ອີເມວເລີ່ມຕົ້ນ:** `admin@blueletter.local`
- **ລະຫັດຜ່ານເລີ່ມຕົ້ນ (ສຳລັບ Local Setup):** `BlueLove2026!` *(ຫຼື ຄ່າຈາກ `ADMIN_INITIAL_PASSWORD`)*

### ວິທີປ່ຽນ ຫຼື ກູ້ຄືນລະຫັດຜ່ານ Admin ຜ່ານ Server CLI (Server-side Recovery)
ຫາກລືມລະຫັດຜ່ານ ຫຼື ຕ້ອງການສ້າງບັນຊີ Admin ໃໝ່ເທິງ Server ໂດຍກົງ:
```bash
python3 scripts/manage_admin.py --email admin@blueletter.local --password "NewStrongPassword2026!"
```

---

## 3. ໂຄງສ້າງລະບົບ (Architecture & Data Model)

- `server.py` — HTTP & REST API Server (Auth, CSRF Protection, Rate Limiting, Multipart Upload Validation, Private Media Gate, Idempotent Responses).
- `db.py` — SQLite Database Manager (WAL mode), PBKDF2-HMAC-SHA256 Password Hashing (`200,000` iterations), Atomic Snapshot Builder & Readiness Validator.
- `seed_data.py` — ຂໍ້ມູນຕົ້ນສະບັບພາສາລາວທັງ 12 ດ່ານ ພ້ອມປ້າຍກຳກັບ `[Placeholder]` ທີ່ຊັດເຈນໂດຍບໍ່ສ້າງຂໍ້ມູນສົມມຸດປອມ.
- `migrations/001_init.sql` — ຕາຕະລາງ `admins`, `stories`, `stages`, `memories`, `media`, `story_versions`, `responses`, `sessions`.
- `public/index.html`, `public/styles.css`, `public/app.js` — ໜ້າເວັບຝັ່ງຜູ້ຮັບ 12 ດ່ານ (Mobile-first, Noto Sans Lao typography, Web Audio API + BGM Controller, Reduced Motion, Touch & Keyboard Fallbacks).
- `public/admin.html`, `public/admin.js` — ໜ້າຈັດການ Admin CMS ຄົບທັງ 10 ໝວດ (Overview, Couple Profile, Stage Editor, Memories, Music & Voice, Gift, Appearance, Responses, Preview & Publish, Settings).
- `data/blue_letter.db` — ຖານຂໍ້ມູນ SQLite.
- `media/` — ໂຟນເດີເກັບໄຟລ໌ຮູບພາບ/ສຽງ/ວິດີໂອແຍກຈາກຖານຂໍ້ມູນ (ສົ່ງຜ່ານ `/api/media/:id` ທີ່ກວດສອບສິດກ່ອນສະເໝີ).

---

## 4. ການສຳຮອງຂໍ້ມູນ (Backup & Restore)

1. **ຜ່ານໜ້າ Admin UI:** ເຂົ້າໄປທີ່ `/admin` → ໝວດ **Settings** → ກົດ **ດາວໂຫຼດ Backup JSON**.
2. **ຜ່ານລະບົບໄຟລ໌ Server:** ສຳຮອງໂຟນເດີ `data/` (ໄຟລ໌ SQLite) ແລະ `media/` (ໄຟລ໌ຮູບ/ສຽງທັງໝົດ).

---

## 5. ການທົດສອບລະບົບ (Running E2E Tests)

```bash
python3 tests/test_e2e.py
```
