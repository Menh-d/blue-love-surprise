"""
Seed data for Blue Letter — ເວັບ Surprise ວັນເກີດແຟນ (6 ດ່ານ ແບບເບິ່ງງ່າຍ ເຂົ້າໃຈງ່າຍ)
- ໜ້າທຳອິດ: ມີແຕ່ຊອງຈົດໝາຍເທິງພື້ນຫຼັງລາຍຜ້າ Gingham ສີຟ້າ-ຄຣີມ.
- 6 ດ່ານ: ແຕ່ລະດ່ານເປັນກາດຈົດໝາຍສີແດງ-ຂາວ (Style #txt #soobin.jpeg) ພ້ອມຮູບຄູ່, ຂໍ້ຄວາມສັ້ນໆ, ຕົວເລືອກ Icon 3 ອັນ ແລະ ລາກດາວໄປຕໍ່ເສັ້ນ (1 -> 6).
- ໜ້າສຸດທ້າຍ (ຫຼັງວາງດາວດວງທີ 6): ເສັ້ນດາວທັງ 6 ດວງເຊື່ອມເປັນ HAPPY BIRTHDAY ພ້ອມຈົດໝາຍອວຍພອນວັນເກີດ ແລະ ຮູບຄວາມຊົງຈຳທັງ 8 ຮູບ.
"""

DEFAULT_STORY_ID = "story-blue-letter-1"
DEFAULT_STORY_SLUG = "our-blue-letter"

DEFAULT_THEME = {
    "bg_color": "#FDFBF2",
    "primary_blue": "#8CC8FF",
    "cta_blue": "#E52B2B",
    "text_navy": "#1E293B",
    "night_navy": "#0F1E3A",
    "lavender_accent": "#FFE4E6",
    "paper_cream": "#FFFDF7",
    "font_family": "'Noto Sans Lao', 'Phetsarath OT', -apple-system, BlinkMacSystemFont, sans-serif",
    "effect_intensity": "normal",
    "reduced_motion_default": False,
}

DEFAULT_MEDIA = [
    {
        "id": "med-do-fan-01",
        "storage_key": "med-do-fan-01.jpeg",
        "original_name": "Do_and_fan_smile_night.jpeg",
        "mime_type": "image/jpeg",
        "bytes": 64134,
        "alt_text": "ຮອຍຍິ້ມຂອງເຈົ້າເວລາແນມຫາກັນ",
        "focal_point": "50% 30%",
    },
    {
        "id": "med-do-fan-02",
        "storage_key": "med-do-fan-02.jpeg",
        "original_name": "Do_and_fan_holding_hands.jpeg",
        "mime_type": "image/jpeg",
        "bytes": 119967,
        "alt_text": "ຈັບມືກັນໃນຄືນພິເສດ",
        "focal_point": "50% 35%",
    },
    {
        "id": "med-do-fan-03",
        "storage_key": "med-do-fan-03.jpeg",
        "original_name": "Do_and_fan_bamboo_deer.jpeg",
        "mime_type": "image/jpeg",
        "bytes": 231104,
        "alt_text": "ທາງນ້ອຍໆໃນສວນໄຜ່ກັບກວາງນ້ອຍ",
        "focal_point": "50% 35%",
    },
    {
        "id": "med-do-fan-04",
        "storage_key": "med-do-fan-04.jpeg",
        "original_name": "Do_and_fan_bamboo_selfie.jpeg",
        "mime_type": "image/jpeg",
        "bytes": 107656,
        "alt_text": "ຮູບເຊວຟີ່ຄູ່ໃນສວນໄຜ່",
        "focal_point": "50% 30%",
    },
    {
        "id": "med-do-fan-05",
        "storage_key": "med-do-fan-05.jpeg",
        "original_name": "Do_and_fan_movie_date_1.jpeg",
        "mime_type": "image/jpeg",
        "bytes": 102286,
        "alt_text": "ເດດເບິ່ງໜັງຄູ່ກັນ",
        "focal_point": "50% 35%",
    },
    {
        "id": "med-do-fan-06",
        "storage_key": "med-do-fan-06.jpeg",
        "original_name": "Do_and_fan_movie_date_2.jpeg",
        "mime_type": "image/jpeg",
        "bytes": 93285,
        "alt_text": "ປີ້ໜັງຄູ່ F8 & F9",
        "focal_point": "50% 40%",
    },
    {
        "id": "med-do-fan-07",
        "storage_key": "med-do-fan-07.jpeg",
        "original_name": "Do_and_fan_movie_date_3.jpeg",
        "mime_type": "image/jpeg",
        "bytes": 69172,
        "alt_text": "ຊູສອງນິ້ວຫຼັງປີ້ໜັງ",
        "focal_point": "50% 40%",
    },
    {
        "id": "med-do-fan-08",
        "storage_key": "med-do-fan-08.jpeg",
        "original_name": "Do_and_fan_night_selfie.jpeg",
        "mime_type": "image/jpeg",
        "bytes": 137990,
        "alt_text": "ຄ່ຳຄືນທີ່ອົບອຸ່ນຂອງເຮົາ",
        "focal_point": "50% 30%",
    },
]

DEFAULT_MUSIC_CONFIG = {
    "bgm_media_id": None,
    "bgm_title": "Soft Romantic Melody",
    "bgm_volume": 0.25,
    "sfx_volume": 0.15,
    "featured_song_media_id": None,
    "featured_song_title": "ທຳນອງເພງຂອງເຮົາ 💙",
    "featured_song_artist": "From. Do",
    "voice_note_media_id": None,
    "voice_note_title": "ຂໍ້ຄວາມສຽງຈາກ Do",
    "voice_note_transcript": "ຂອບໃຈທີ່ຄ່ອຍໆເປີດອ່ານ ແລະ ຕໍ່ດາວມາເທື່ອລະດວງເດີ້ 💙",
}

DEFAULT_GIFT_CONFIG = {
    "gift_type": "coupon",
    "coupon_title": "ຄູປອງວັນພິເສດຕາມໃຈເຈົ້າ 1 ມື້ເຕັມ 💙",
    "coupon_description": "ເຈົ້າເລືອກສະຖານທີ່ ແລະ ກິດຈະກຳທີ່ຢາກໄປ — Do ພາໄປເອງທຸກບ່ອນເລີຍ!",
    "coupon_code": "BLUE-LETTER-LOVE",
    "gift_message": "ຂໍໃຫ້ທຸກມື້ຂອງເຈົ້າເຕັມໄປດ້ວຍຮອຍຍິ້ມ ແລະ ຄວາມສຸກສະເໝີເດີ້.",
    "gift_media_id": "med-do-fan-01",
    "has_real_appointment": False,
    "appointment_date": "",
    "appointment_time": "",
    "appointment_location": "",
    "appointment_note": "",
}

# 6 clear star coordinates along a gentle arc across the sky
STAR_MAP_COORDS = [
    {"x": 14, "y": 65},  # 1
    {"x": 28, "y": 35},  # 2
    {"x": 43, "y": 55},  # 3
    {"x": 58, "y": 30},  # 4
    {"x": 73, "y": 55},  # 5
    {"x": 86, "y": 32},  # 6
]

DEFAULT_STAGES = [
    {
        "id": "stage-01-start",
        "type": "stage_step",
        "position": 1,
        "enabled": 1,
        "title": "ຈຸດເລີ່ມຂອງຄວາມລັບ",
        "body": "ມີບາງຄຳທີ່ຕັ້ງໃຈເກັບໄວ້ໃນຊອງຈົດໝາຍນີ້… ຄ່ອຍໆເລືອກ icon ແລ້ວລາກດາວໄປຕໍ່ກັນເທື່ອລະດ່ານເດີ້.",
        "cta": "ໄປດ່ານທີ 2 →",
        "hint": "ເລືອກ 1 icon ແລ້ວລາກດາວໄປໃສ່ຈຸດທີ 1",
        "config": {
            "star_index": 1,
            "star_x": 14,
            "star_y": 65,
            "photo_media_id": "med-do-fan-01",
            "photo_caption": "ຮອຍຍິ້ມທຳອິດທີ່ເຮັດໃຫ້ໃຈຟູ 💙",
            "question": "ມື້ນີ້ ເຈົ້າຢາກເລີ່ມເປີດຄວາມລັບນີ້ດ້ວຍຫຍັງ?",
            "icon_choices": [
                {"id": "s1-1", "icon": "💌", "label": "ຈົດໝາຍ", "bridge_text": "ດາວດວງທີ 1 ສະຫວ່າງແລ້ວ… ໄປເບິ່ງຮອຍຍິ້ມຂອງເຈົ້າໃນດ່ານຕໍ່ໄປກັນ!"},
                {"id": "s1-2", "icon": "✨", "label": "ປະກາຍດາວ", "bridge_text": "ປະກາຍດາວດວງທຳອິດເລີ່ມສ່ອງແສງແລ້ວ… ໄປດ່ານທີ 2 ກັນເລີຍ!"},
                {"id": "s1-3", "icon": "💙", "label": "ຫົວໃຈ", "bridge_text": "ໃຊ້ຫົວໃຈນຳທາງໄປຫາດ່ານທີ 2 ນຳກັນເລີຍ!"},
            ],
        },
    },
    {
        "id": "stage-02-smile",
        "type": "stage_step",
        "position": 2,
        "enabled": 1,
        "title": "ຮອຍຍິ້ມຂອງເຈົ້າ",
        "body": "ທຸກຄັ້ງທີ່ເຈົ້າຍິ້ມ ໂລກທັງໃບຄືກັບສົດໃສຂຶ້ນມາທັນທີ ໂດຍສະເພາະເວລາທີ່ເຮົາຈັບມືກັນ.",
        "cta": "ໄປດ່ານທີ 3 →",
        "hint": "ເລືອກ icon ຮອຍຍິ້ມ ແລ້ວລາກດາວດວງທີ 2",
        "config": {
            "star_index": 2,
            "star_x": 28,
            "star_y": 35,
            "photo_media_id": "med-do-fan-02",
            "photo_caption": "ຈັບມືກັນໄວ້ແບບນີ້ດົນໆເດີ້ 🤝✨",
            "question": "ຮອຍຍິ້ມແບບໃດທີ່ເຈົ້າຢາກສົ່ງໃຫ້ກັນໃນມື້ນີ້?",
            "icon_choices": [
                {"id": "s2-1", "icon": "😊", "label": "ຍິ້ມອ່ອນໆ", "bridge_text": "ຮອຍຍິ້ມອ່ອນໆຂອງເຈົ້າ ພາເຮົາຍ່າງຕໍ່ໄປໃນທາງນ້ອຍໆຂອງເຮົາ..."},
                {"id": "s2-2", "icon": "😄", "label": "ຍິ້ມກວ້າງ", "bridge_text": "ຮອຍຍິ້ມກວ້າງທີ່ສົດໃສ ເຊື່ອມເສັ້ນດາວໄປຫາດ່ານທີ 3 ແລ້ວ!"},
                {"id": "s2-3", "icon": "🥰", "label": "ຍິ້ມເຂີນ", "bridge_text": "ຍິ້ມໜ້າຮັກແບບນີ້ ໄປເບິ່ງຄວາມຊົງຈຳດ່ານຕໍ່ໄປນຳກັນເລີຍ!"},
            ],
        },
    },
    {
        "id": "stage-03-path",
        "type": "stage_step",
        "position": 3,
        "enabled": 1,
        "title": "ທາງນ້ອຍໆຂອງເຮົາ",
        "body": "ບໍ່ວ່າຈະເປັນທາງຍ່າງໃນສວນໄຜ່ ຫຼື ໄປທ່ຽວໃສກໍຕາມ ພໍມີເຈົ້າຍ່າງຂ້າງໆ ກໍກາຍເປັນມື້ພິເສດສະເໝີ.",
        "cta": "ໄປດ່ານທີ 4 →",
        "hint": "ເລືອກ icon ແລ້ວລາກດາວດວງທີ 3",
        "config": {
            "star_index": 3,
            "star_x": 43,
            "star_y": 55,
            "photo_media_id": "med-do-fan-03",
            "photo_caption": "ຍ່າງຫຼິ້ນນຳກັນ ມີກວາງນ້ອຍມາທັກທາຍ 🦌🌿",
            "question": "ລະຫວ່າງທາງທີ່ໄປນຳກັນ ເຈົ້າມັກສິ່ງໃດທີ່ສຸດ?",
            "icon_choices": [
                {"id": "s3-1", "icon": "📷", "label": "ຮູບພາບ", "bridge_text": "ທຸກຮູບພາບທີ່ຖ່າຍໄວ້ ມີຄຳໃນໃຈທີ່ຢາກບອກເຈົ້າຊ່ອນຢູ່..."},
                {"id": "s3-2", "icon": "🌷", "label": "ທຳມະຊາດ", "bridge_text": "ບັນຍາກາດດີໆ ພາເຮົາມາເຖິງຄຳທີ່ຢາກບອກເຈົ້າໃນດ່ານທີ 4..."},
                {"id": "s3-3", "icon": "☕", "label": "ຄາເຟ່", "bridge_text": "ຄວາມອົບອຸ່ນລະຫວ່າງທາງ ພາໄປສູ່ຄຳໃນໃຈທີ່ຢາກບອກເຈົ້າ..."},
            ],
        },
    },
    {
        "id": "stage-04-words",
        "type": "stage_step",
        "position": 4,
        "enabled": 1,
        "title": "ຄຳທີ່ຢາກບອກ",
        "body": "ອາດບໍ່ໄດ້ເວົ້າຄຳຫວານເກັ່ງທຸກມື້ ແຕ່ທຸກມື້ທີ່ມີເຈົ້າຢູ່ຄຽງຂ້າງ ແມ່ນມື້ທີ່ດີທີ່ສຸດແທ້ໆ.",
        "cta": "ໄປດ່ານທີ 5 →",
        "hint": "ເລືອກ icon ຄຳໃນໃຈ ແລ້ວລາກດາວດວງທີ 4",
        "config": {
            "star_index": 4,
            "star_x": 58,
            "star_y": 30,
            "photo_media_id": "med-do-fan-04",
            "photo_caption": "ເກັບທຸກຮອຍຍິ້ມໄວ້ໃນຄວາມຊົງຈຳຂອງເຮົາ 💙",
            "question": "ຄຳໃດທີ່ກົງກັບຄວາມຮູ້ສຶກໃນໃຈຕອນນີ້ທີ່ສຸດ?",
            "icon_choices": [
                {"id": "s4-1", "icon": "💭", "label": "ຄິດເຖິງ", "bridge_text": "ຄວາມຄິດເຖິງເຊື່ອມດາວດວງທີ 4 ໄປຫາຄວາມອົບອຸ່ນຂອງເຮົາ..."},
                {"id": "s4-2", "icon": "🫶", "label": "ຂອບໃຈ", "bridge_text": "ຂອບໃຈທີ່ຢູ່ຂ້າງກັນສະເໝີ… ໄປດ່ານທີ 5 ກັນເລີຍ!"},
                {"id": "s4-3", "icon": "🌟", "label": "ພິເສດ", "bridge_text": "ເພາະເຈົ້າຄືຄົນພິເສດ… ໄປຮັບຄວາມອົບອຸ່ນໃນດ່ານທີ 5 ກັນ!"},
            ],
        },
    },
    {
        "id": "stage-05-warmth",
        "type": "stage_step",
        "position": 5,
        "enabled": 1,
        "title": "ຄວາມອົບອຸ່ນຂ້າງກັນ",
        "body": "ບໍ່ວ່າຈະໄປເບິ່ງໜັງ ຫຼື ນັ່ງຟັງເພງສະບາຍໆ ຂໍແຄ່ມີເຈົ້າຢູ່ຂ້າງໆ ກໍອົບອຸ່ນຫົວໃຈທີ່ສຸດແລ້ວ.",
        "cta": "ໄປດ່ານສຸດທ້າຍ →",
        "hint": "ເລືອກ icon ຄວາມອົບອຸ່ນ ແລ້ວລາກດາວດວງທີ 5",
        "config": {
            "star_index": 5,
            "star_x": 73,
            "star_y": 55,
            "photo_media_id": "med-do-fan-05",
            "photo_caption": "ເວລາແຫ່ງຄວາມສຸກ ທີ່ໄດ້ໄປເບິ່ງໜັງນຳກັນ 🎬🎟️",
            "question": "ຄວາມອົບອຸ່ນແບບໃດທີ່ເຈົ້າມັກທີ່ສຸດເວລາຢູ່ນຳກັນ?",
            "icon_choices": [
                {"id": "s5-1", "icon": "🤗", "label": "ກອດອຸ່ນໆ", "bridge_text": "ອ້ອມກອດນີ້ພາເຈົ້າມາຮອດດາວດວງສຸດທ້າຍແລ້ວ!"},
                {"id": "s5-2", "icon": "🎬", "label": "ເບິ່ງໜັງນຳກັນ", "bridge_text": "ເຫຼືອພຽງດາວດວງສຸດທ້າຍ ຄວາມລັບທັງໝົດກຳລັງຈະເປີດອອກ!"},
                {"id": "s5-3", "icon": "🎵", "label": "ຟັງເພງນຳກັນ", "bridge_text": "ສຽງເພງພາເຮົາມາເຖິງດາວດວງສຸດທ້າຍແລ້ວ!"},
            ],
        },
    },
    {
        "id": "stage-06-final-letter",
        "type": "final_letter",
        "position": 6,
        "enabled": 1,
        "title": "ດາວດວງສຸດທ້າຍ",
        "body": "ເລືອກພອນທີ່ເຈົ້າປາຖະໜາ ແລ້ວລາກດາວດວງທີ 6 ໄປວາງ ເພື່ອເປີດເຜີຍຄຳລັບເທິງທ້ອງຟ້າ!",
        "cta": "ເປີດຄຳອວຍພອນວັນເກີດ 🎂✨",
        "hint": "ເລືອກ icon ແລະ ວາງດາວດວງທີ 6 ເພື່ອເປີດໜ້າ Surprise ສຸດທ້າຍ",
        "config": {
            "star_index": 6,
            "star_x": 86,
            "star_y": 32,
            "photo_media_id": "med-do-fan-08",
            "photo_caption": "ຄ່ຳຄືນພິເສດຂອງເຮົາສອງຄົນ 🌙💙",
            "question": "ກ່ອນວາງດາວດວງສຸດທ້າຍ… ເລືອກພອນທີ່ເຈົ້າຢາກໄດ້ທີ່ສຸດ:",
            "icon_choices": [
                {"id": "s6-1", "icon": "🌠", "label": "ຄວາມສຸກ", "bridge_text": "ດາວຄົບທັງ 6 ດວງແລ້ວ! ກົດເປີດເບິ່ງ Surprise ວັນເກີດເລີຍ 🎂"},
                {"id": "s6-2", "icon": "💫", "label": "ຄວາມຝັນ", "bridge_text": "ດາວຄົບທັງ 6 ດວງແລ້ວ! ກົດເປີດເບິ່ງ Surprise ວັນເກີດເລີຍ 🎂"},
                {"id": "s6-3", "icon": "💙", "label": "ຄວາມຮັກ", "bridge_text": "ດາວຄົບທັງ 6 ດວງແລ້ວ! ກົດເປີດເບິ່ງ Surprise ວັນເກີດເລີຍ 🎂"},
            ],
            "birthday_letter": (
                "ສຸກສັນວັນເກີດເດີ້ຄົນພິເສດຂອງ Do! 🎂💙\n\n"
                "ເສັ້ນດາວທັງ 6 ດວງທີ່ເຈົ້າຄ່ອຍໆເລືອກ ແລະ ລາກມາເຊື່ອມຕໍ່ກັນ ໄດ້ພາເຮົາມາຫາຄຳວ່າ HAPPY BIRTHDAY ໃນໜ້າສຸດທ້າຍນີ້ແລ້ວ.\n\n"
                "ຂອບໃຈທີ່ເຂົ້າມາເປັນຄວາມສຸກ, ເປັນຮອຍຍິ້ມ ແລະ ເປັນຄົນສຳຄັນໃນທຸກໆມື້. "
                "ຂໍໃຫ້ວັນເກີດປີນີ້ມີແຕ່ສິ່ງດີໆ, ສຸຂະພາບແຂງແຮງ, ມີຄວາມສຸກຫຼາຍໆ ແລະ ຢູ່ສ້າງຄວາມຊົງຈຳດີໆນຳກັນໄປດົນໆເລີຍເດີ້ 💙"
            ),
            "letter_date": "Birthday Surprise",
            "send_heart_label": "💙 ສົ່ງຫົວໃຈກັບໄປ",
            "write_reply_label": "✍️ ຂຽນຄຳຕອບກັບຜູ້ສົ່ງ",
            "reply_placeholder": "ຂຽນຄວາມຮູ້ສຶກ ຫຼື ຄຳຕອບຝາກໄວ້ໃຫ້ຜູ້ສົ່ງ...",
            "privacy_notice": "ຄຳຕອບຂອງເຈົ້າຈະຖືກບັນທຶກໄວ້ໃຫ້ຜູ້ສົ່ງເປີດອ່ານໃນໜ້າ Admin.",
        },
    },
]

DEFAULT_MEMORIES = [
    {
        "id": "mem-01",
        "date_label": "ຮູບທີ 1",
        "title": "ຮອຍຍິ້ມຂອງເຈົ້າ",
        "caption": "ທຸກຄັ້ງທີ່ແນມຫາກັນ ຮອຍຍິ້ມຂອງເຈົ້າເຮັດໃຫ້ໂລກສົດໃສສະເໝີ 💙",
        "media_id": "med-do-fan-01",
        "position": 1,
    },
    {
        "id": "mem-02",
        "date_label": "ຮູບທີ 2",
        "title": "ຈັບມືກັນໄວ້",
        "caption": "ຊ່ວງເວລາທີ່ຈັບມືກັນ ອົບອຸ່ນຄືກັບສີຂອງມື້ພິເສດ ✨",
        "media_id": "med-do-fan-02",
        "position": 2,
    },
    {
        "id": "mem-03",
        "date_label": "ຮູບທີ 3",
        "title": "ຍ່າງຫຼິ້ນສວນໄຜ່ກັບກວາງນ້ອຍ",
        "caption": "ທາງນ້ອຍໆທີ່ເຮົາຍ່າງໄປນຳກັນ ມີແຕ່ຄວາມຊົງຈຳດີໆ 🦌🌿",
        "media_id": "med-do-fan-03",
        "position": 3,
    },
    {
        "id": "mem-04",
        "date_label": "ຮູບທີ 4",
        "title": "ດີໃຈທີ່ມີເຈົ້າ",
        "caption": "ທຸກຮູບທີ່ຖ່າຍນຳກັນ ແທນຄຳຂອບໃຈແລະຄວາມຄິດເຖິງ 💭",
        "media_id": "med-do-fan-04",
        "position": 4,
    },
    {
        "id": "mem-05",
        "date_label": "ຮູບທີ 5",
        "title": "ເດດເບິ່ງໜັງຄູ່ກັນ",
        "caption": "ໃຊ້ເວລາຟັງສຽງແລະເບິ່ງໜັງຂ້າງໆກັນ 🎬",
        "media_id": "med-do-fan-05",
        "position": 5,
    },
    {
        "id": "mem-06",
        "date_label": "ຮູບທີ 6",
        "title": "ປີ້ໜັງຄູ່ F8 & F9",
        "caption": "ເກັບທຸກລາຍລະອຽດນ້ອຍໆໄວ້ເປັນຄວາມຊົງຈຳຂອງເຮົາສອງຄົນ 🎟️",
        "media_id": "med-do-fan-06",
        "position": 6,
    },
    {
        "id": "mem-07",
        "date_label": "ຮູບທີ 7",
        "title": "ໄປໃສກໍມ່ວນເມື່ອມີເຈົ້າ",
        "caption": "ບໍ່ວ່າຈະໄປບ່ອນໃດ ຂໍແຄ່ມີເຈົ້າໄປນຳກໍພິເສດທຸກບ່ອນ ✌️",
        "media_id": "med-do-fan-07",
        "position": 7,
    },
    {
        "id": "mem-08",
        "date_label": "ຮູບທີ 8",
        "title": "ຄວາມອົບອຸ່ນຂ້າງກັນ",
        "caption": "ຂອບໃຈທີ່ເປັນຄວາມອົບອຸ່ນໃຫ້ກັນໃນທຸກໆມື້ 🤗💙",
        "media_id": "med-do-fan-08",
        "position": 8,
    },
]
