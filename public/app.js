/**
 * Blue WishBox — Complete Interactive Birthday Surprise
 *
 * Flow:
 * 0. Lock Screen (#envelope-screen): 3x3 Tic-Tac-Toe "Love is always a good idea <3" (like _ - 2026-10-17T182328.150.jpeg in Blue Theme)
 * 1. Page 1 (#page-1): 3D Blue Envelope -> Animated Paper Sliding Out -> Typewriter Message -> "ອອກເດີນທາງ" Button
 * 2. Page 2 (#page-2): Full-Screen Love Stars Constellation (No pre-drawn heart lines! Zoomed in on each love star 1..8 -> Zooms out at #8 to reveal Heart Constellation -> Auto-Transitions to Page 3)
 * 3. Page 3 (#page-3): Archive Pinboard Memory Path (MSR Foto style: Washi tape, pushpins, taut connecting string, tap message card -> develops into photo -> Auto-Transitions to Page 4 when all opened)
 * 4. Page 4 (#page-4): Interactive Acrylic Magnet Jigsaw Puzzle (matching _ - 2026-10-17T185035.226.jpeg)
 *    - 6 acrylic magnet puzzle pieces (3x2 grid) that the user drags and connects themselves!
 *    - When all 6 pieces are assembled, zooms out to reveal Full Photo Collage Wall & Grand "Happy Birthday My Love! 💙🎂" Finale!
 */

(function () {
  "use strict";

  const DEFAULT_PLACEHOLDER_IMG = "/assets/couple-placeholder.svg";

  // 8 Love Stars arranged in a symmetric Heart Constellation (0..100 coordinate space)
  const HEART_STARS = [
    {
      id: 1,
      x: 50,
      y: 28,
      icon: "💫",
      label: "ດາວແຫ່ງຮອຍຍິ້ມທຳອິດ",
      whisper: "💫 ດາວດວງທີ 1 (ຮອຍຍິ້ມທຳອິດ): ວິນາທີທຳອິດທີ່ໄດ້ເຫັນຮອຍຍິ້ມຂອງເຈົ້າ ໂລກທັງໃບກໍສົດໃສຂຶ້ນທັນທີ 💙",
    },
    {
      id: 2,
      x: 30,
      y: 15,
      icon: "🌙",
      label: "ດາວແຫ່ງຄວາມອົບອຸ່ນ",
      whisper: "🌙 ດາວດວງທີ 2 (ຄວາມອົບອຸ່ນ): ທຸກຄຳເວົ້າ ແລະ ຄວາມໃສ່ໃຈຂອງເຈົ້າ ເຮັດໃຫ້ໃຈອົບອຸ່ນສະເໝີ",
    },
    {
      id: 3,
      x: 13,
      y: 31,
      icon: "🤝",
      label: "ດາວແຫ່ງການຈັບມື",
      whisper: "🤝 ດາວດວງທີ 3 (ການຈັບມື): ຂອບໃຈທີ່ຈັບມືກັນໄວ້ແໜ້ນໆ ບໍ່ວ່າຈະຜ່ານເລື່ອງລາວໃດໆ 💙",
    },
    {
      id: 4,
      x: 25,
      y: 55,
      icon: "✨",
      label: "ດາວແຫ່ງຄວາມເຂົ້າໃຈ",
      whisper: "✨ ດາວດວງທີ 4 (ຄວາມເຂົ້າໃຈ): ຢູ່ກັບເຈົ້າແລ້ວສະບາຍໃຈທີ່ສຸດ ເປັນຕົວຂອງຕົວເອງໄດ້ທຸກຢ່າງ",
    },
    {
      id: 5,
      x: 50,
      y: 78,
      icon: "💎",
      label: "ດາວແຫ່ງຄວາມຫ່ວງໃຍ",
      whisper: "💎 ດາວດວງທີ 5 (ຄວາມຫ່ວງໃຍ): ທຸກຄວາມຫ່ວງໃຍເລັກໆນ້ອຍໆຈາກເຈົ້າ ມີຄ່າສຳລັບຂ້ອຍສະເໝີ",
    },
    {
      id: 6,
      x: 75,
      y: 55,
      icon: "🌟",
      label: "ດາວແຫ່ງກຳລັງໃຈ",
      whisper: "🌟 ດາວດວງທີ 6 (ກຳລັງໃຈ): ເຈົ້າຄືພະລັງບວກ ແລະ ກຳລັງໃຈທີ່ດີທີ່ສຸດໃນທຸກໆມື້",
    },
    {
      id: 7,
      x: 87,
      y: 31,
      icon: "🌌",
      label: "ດາວແຫ່ງຄຳສັນຍາ",
      whisper: "🌌 ດາວດວງທີ 7 (ຄຳສັນຍາ): ສັນຍາວ່າຈະດູແລ ແລະ ຢູ່ຄຽງຂ້າງເຈົ້າແບບນີ້ໄປດົນໆ",
    },
    {
      id: 8,
      x: 70,
      y: 15,
      icon: "💙",
      label: "ດາວແຫ່ງຮັກແທ້",
      whisper:
        "💙 ດາວແຫ່ງຄວາມຮັກທັງ 8 ດວງລຽງກັນເປັນ 'ຮູບຫົວໃຈສີຟ້າ' ແລ້ວ... ກຳລັງພາເຈົ້າໄປສູ່ເສັ້ນທາງຮູບຄວາມຊົງຈຳ ✨",
    },
  ];

  // Twinkling background stars across full-screen sky
  const BG_TWINKLE_STARS = Array.from({ length: 68 }, (_, i) => ({
    x: (i * 37 + 11) % 97 + 1.5,
    y: (i * 53 + 7) % 94 + 3,
    size: (i % 3) + 1.5,
    delay: ((i * 0.31) % 3.2).toFixed(2),
  }));

  // 6 Scrapbook Memories matching the user's reference style (3 rows per set: Lined Note Card + Polaroid + 3D Pushpins)
  const SCRAPBOOK_MEMORIES = [
    {
      id: 0,
      title: "MOMENT 01",
      image: "./media/med-do-fan-01.jpeg",
      caption: "ຮອຍຍິ້ມທີ່ເຮັດໃຫ້ໃຈຟູ 💙",
      message: "ຈື່ມື້ທີ່ເຮົາແນມຫາກັນແລ້ວຍິ້ມໃຫ້ກັນແບບນີ້ໄດ້ບໍ່? ຮອຍຍິ້ມເຈົ້າໜ້າຮັກທີ່ສຸດເລີຍ 💙",
    },
    {
      id: 1,
      title: "MOMENT 02",
      image: "./media/med-do-fan-02.jpeg",
      caption: "ຈັບມືກັນໄວ້ດົນໆເດີ້ ✨",
      message: "ທຸກຄັ້ງທີ່ໄດ້ຈັບມືເຈົ້າ ມັນຄືຊ່ວງເວລາທີ່ອົບອຸ່ນໃຈທີ່ສຸດໃນໂລກເລີຍ ✨",
    },
    {
      id: 2,
      title: "MOMENT 03",
      image: "./media/med-do-fan-03.jpeg",
      caption: "ຍ່າງຫຼິ້ນສວນໄຜ່ນຳກັນ 🦌",
      message: "ມື້ທີ່ເຮົາໄປຍ່າງຫຼິ້ນສວນໄຜ່ກັບກວາງນ້ອຍນຳກັນ ມ່ວນ ແລະ ມີຄວາມສຸກຫຼາຍ 🦌💙",
    },
    {
      id: 3,
      title: "MOMENT 04",
      image: "./media/med-do-fan-04.jpeg",
      caption: "ດີໃຈທີ່ມີເຈົ້າຢູ່ຂ້າງໆ 💎",
      message: "ບໍ່ວ່າຈະໄປໃສ ຫຼື ເຮັດຫຍັງ ຂໍພຽງແຕ່ມີເຈົ້າຢູ່ຂ້າງໆ ທຸກຢ່າງກະພິເສດຂຶ້ນມາທັນທີ 💎",
    },
    {
      id: 4,
      title: "MOMENT 05",
      image: "./media/med-do-fan-05.jpeg",
      caption: "ເດດເບິ່ງໜັງຄູ່ກັນ 🎬",
      message: "ໄປເບິ່ງໜັງຄູ່ກັນ ນັ່ງຂ້າງໆກັນ ຢາກຢຸດເວລາໄວ້ແບບນີ້ດົນໆເລີຍ 🎬💙",
    },
    {
      id: 5,
      title: "MOMENT 06",
      image: "./media/med-do-fan-06.jpeg",
      caption: "ທຸກມຸມທີ່ມີເຈົ້າຄືຄວາມສຸກ 🌟",
      message: "ຂອບໃຈທີ່ເຂົ້າມາເປັນຄວາມຊົງຈຳທີ່ດີທີ່ສຸດໃນທຸກໆມື້ຂອງຂ້ອຍເດີ້ 🌙💙",
    },
  ];

  // 6 Alternating Scrapbook Row Configurations for all memories flowing down:
  // Row 1: Card Left (Red Pin) + Polaroid Right (Blue Pin, +8.5deg)
  // Row 2: Polaroid Left (Yellow Pin, -9.5deg) + Card Right (Green Pin)
  // Row 3: Card Left (Blue Pin) + Polaroid Right (Red Pin, +7.5deg)
  // Row 4: Polaroid Left (Blue Pin, -9deg) + Card Right (Yellow Pin)
  // Row 5: Card Left (Green Pin) + Polaroid Right (Blue Pin, +8deg)
  // Row 6: Polaroid Left (Red Pin, -8.5deg) + Card Right (Green Pin)
  const SCRAPBOOK_ROW_CONFIGS = [
    {
      cardSide: "left",
      cardPin: "red",
      polSide: "right",
      polPin: "blue",
      polRotate: "8.5deg",
    },
    {
      polSide: "left",
      polPin: "yellow",
      polRotate: "-9.5deg",
      cardSide: "right",
      cardPin: "green",
    },
    {
      cardSide: "left",
      cardPin: "blue",
      polSide: "right",
      polPin: "red",
      polRotate: "7.5deg",
    },
    {
      polSide: "left",
      polPin: "blue",
      polRotate: "-9deg",
      cardSide: "right",
      cardPin: "yellow",
    },
    {
      cardSide: "left",
      cardPin: "green",
      polSide: "right",
      polPin: "blue",
      polRotate: "8deg",
    },
    {
      polSide: "left",
      polPin: "red",
      polRotate: "-8.5deg",
      cardSide: "right",
      cardPin: "green",
    },
  ];

  // 6 Jigsaw Puzzle Pieces for Full Hero Couple Photo (2 cols x 3 rows)
  const JIGSAW_PIECES_CONFIG = [
    {
      id: 0,
      row: 0,
      col: 0,
      hint: "ເທິງຊ້າຍ",
      edges: { top: 0, right: 1, bottom: 1, left: 0 },
    },
    {
      id: 1,
      row: 0,
      col: 1,
      hint: "ເທິງຂວາ",
      edges: { top: 0, right: 0, bottom: -1, left: -1 },
    },
    {
      id: 2,
      row: 1,
      col: 0,
      hint: "ກາງຊ້າຍ",
      edges: { top: -1, right: -1, bottom: 1, left: 0 },
    },
    {
      id: 3,
      row: 1,
      col: 1,
      hint: "ກາງຂວາ",
      edges: { top: 1, right: 0, bottom: -1, left: 1 },
    },
    {
      id: 4,
      row: 2,
      col: 0,
      hint: "ລຸ່ມຊ້າຍ",
      edges: { top: -1, right: 1, bottom: 0, left: 0 },
    },
    {
      id: 5,
      row: 2,
      col: 1,
      hint: "ລຸ່ມຂວາ",
      edges: { top: 1, right: 0, bottom: 0, left: -1 },
    },
  ];

  function resolveMediaUrl(url) {
    if (!url) return "./assets/couple-placeholder.svg";
    if (url.startsWith("/api/media/")) {
      const id = url.replace("/api/media/", "");
      return `./media/${id}.jpeg`;
    }
    return url;
  }

  // Live editable config
  const CONFIG = {
    receiverName: "ຄົນພິເສດ",
    senderName: "Do",
    pinCode: "1402",
    pinHint: "ແຕະວາງຫົວໃຈສີຟ້າ 3 ດວງໃຫ້ລຽງກັນ 💙",
    pinImage: "./media/med-do-fan-01.jpeg",
    jigsawImage: "./media/med-do-fan-01.jpeg",
    pinCaption: "You & Me 💙",
    plaqueText: "✨ DO & FAN 💙 YOU & ME FOREVER ✨",
    anniversaryDate: "2025-10-17",
    letterSalutation: "ເຖິງ ຄົນພິເສດຂອງຂ້ອຍ,",
    letterParagraph1:
      "ຍັງຈື່ຮອຍຍິ້ມທຳອິດທີ່ເຮົາແນມຫາກັນໄດ້ສະເໝີ ຕັ້ງແຕ່ວິນາທີນັ້ນຂ້ອຍກໍຮູ້ເລີຍວ່າເຈົ້າຄືຄົນທີ່ພິເສດແທ້ໆ.",
    letterParagraph2:
      "ທຸກຊ່ວງເວລາທີ່ເຮົາໄດ້ຍ່າງຫຼິ້ນນຳກັນ, ໄປເບິ່ງໜັງນຳກັນ ຫຼື ແມ່ນແຕ່ມື້ທຳມະດາໆ ກໍກາຍເປັນມື້ທີ່ອົບອຸ່ນທີ່ສຸດເມື່ອມີເຈົ້າຢູ່ຂ້າງໆ.",
    letterParagraph3:
      "ຂອບໃຈທີ່ເຂົ້າມາເປັນຄວາມສຸກ, ເປັນຮອຍຍິ້ມ ແລະ ເປັນກຳລັງໃຈທີ່ດີທີ່ສຸດໃຫ້ກັນໃນທຸກໆມື້ເດີ້.",
    letterParagraph4:
      "ຂ້ອຍໄດ້ເຊື່ອງຄວາມຊົງຈຳ ແລະ ຂອງຂວັນພິເສດໄວ້ໃນດວງດາວທັງໝົດນີ້ ລອງອອກເດີນທາງໄປເປີດເບິ່ງນຳກັນເດີ້ 💙",
    letterSignature: "ດ້ວຍຮັກຈາກ,",
    celebrationTitle: "Happy Birthday My Love! 🎂💙",
    celebrationMessage:
      "ສຸກສັນວັນເກີດເດີ້ຄົນພິເສດ! ຂອບໃຈທີ່ເຂົ້າມາເປັນຄວາມສຸກທີ່ສຸດໃນໂລກເລີຍ ຂໍໃຫ້ປີນີ້ເຕັມໄປດ້ວຍຮອຍຍິ້ມ, ສຸຂະພາບແຂງແຮງ ແລະ ຢູ່ສ້າງຄວາມຊົງຈຳດີໆນຳກັນໄປທຸກໆປີເລີຍເດີ້ 😘💙",
    couponTitle: "ຄູປອງວັນເກີດຕາມໃຈເຈົ້າ 1 ມື້ເຕັມ 💙",
    couponCode: "BLUE-BIRTHDAY",
    polaroids: [
      { image: "./media/med-do-fan-01.jpeg", caption: "ຮອຍຍິ້ມທີ່ເຮັດໃຫ້ໃຈຟູ 💙" },
      { image: "./media/med-do-fan-02.jpeg", caption: "ຈັບມືກັນໄວ້ດົນໆເດີ້ ✨" },
      { image: "./media/med-do-fan-03.jpeg", caption: "ຍ່າງຫຼິ້ນສວນໄຜ່ກັບກວາງນ້ອຍ 🦌" },
      { image: "./media/med-do-fan-04.jpeg", caption: "ດີໃຈທີ່ມີເຈົ້າຢູ່ຂ້າງໆ 💎" },
      { image: "./media/med-do-fan-05.jpeg", caption: "ເດດເບິ່ງໜັງຄູ່ກັນ 🎬" },
      { image: "./media/med-do-fan-06.jpeg", caption: "ທຸກມຸມທີ່ມີເຈົ້າຄືຄວາມສຸກ 🌟" },
      { image: "./media/med-do-fan-07.jpeg", caption: "ຢູ່ຍິ້ມນຳກັນແບບນີ້ຕະຫຼອດໄປ 💫" },
      { image: "./media/med-do-fan-08.jpeg", caption: "ຄ່ຳຄືນທີ່ອົບອຸ່ນຂອງເຮົາ 🌙" },
    ],
  };

  const state = {
    slug: "our-blue-letter",
    isPreview: new URLSearchParams(window.location.search).get("preview") === "1",
    story: null,
    unlocked: false,
    tttHearts: [false, false, false], // 3 diagonal heart slots on Tic-Tac-Toe lock screen
    activePage: 1, // 1: Envelope, 2: Love Stars Constellation, 3: MSR Foto Archive Path, 4: Jigsaw Workshop -> Collage + Happy Birthday
    envelopeOpening: false,
    letterOpened: false,
    typingTimer: null,
    starsConnected: 0, // 0..8 on Page 2
    manualOverviewZoom: false,
    autoTransitionTimer: null,
    archiveOpened: [false, false, false, false, false, false], // 6 memories on Page 3
    lightboxPhoto: null, // Holds active enlarged photo data
    jigsawPositions: null, // Dynamic { x, y, rot } for 6 pieces on Page 4
    jigsawGroups: null, // Clusters of connected piece indices, e.g. [[0, 1], [2], ...]
    jigsawCompleted: false, // True when all 6 pieces are snapped into 1 unit
    confettiActive: false,
    replySent: false,
    replyText: "",
  };

  // ==================== AUDIO ENGINE ====================
  class MusicController {
    constructor() {
      this.ctx = null;
      this.bgmEl = null;
      this.synthTimer = null;
      this.synthIdx = 0;
      this.isPlaying = false;
      this.userMuted = false;
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    }

    setupMediaUrl(url) {
      if (this.bgmEl) {
        this.bgmEl.pause();
        this.bgmEl = null;
      }
      if (url) {
        this.bgmEl = new Audio(url);
        this.bgmEl.loop = true;
        this.bgmEl.volume = 0.3;
      }
    }

    play() {
      if (this.userMuted) return;
      this.isPlaying = true;
      this.updateButtonUI();
      this.ensureContext();
      if (this.bgmEl) {
        this.bgmEl.play().catch(() => {});
      } else {
        this.startRomanticPiano();
      }
    }

    pause() {
      this.isPlaying = false;
      if (this.bgmEl) this.bgmEl.pause();
      if (this.synthTimer) {
        clearInterval(this.synthTimer);
        this.synthTimer = null;
      }
      this.updateButtonUI();
    }

    toggle() {
      if (this.isPlaying) {
        this.userMuted = true;
        this.pause();
      } else {
        this.userMuted = false;
        this.play();
      }
    }

    updateButtonUI() {
      const btn = document.getElementById("music-toggle");
      if (!btn) return;
      btn.classList.toggle("muted", !this.isPlaying);
      btn.classList.toggle("playing", this.isPlaying);
    }

    startRomanticPiano() {
      if (this.synthTimer) clearInterval(this.synthTimer);
      const notes = [261.63, 329.63, 392.0, 493.88, 349.23, 440.0, 523.25, 392.0];
      const step = () => {
        if (!this.isPlaying || document.hidden) return;
        this.playTone(notes[this.synthIdx % notes.length], 2.1, 0.06);
        this.synthIdx++;
      };
      step();
      this.synthTimer = setInterval(step, 2200);
    }

    playTone(freq, dur = 0.3, vol = 0.08) {
      if (this.userMuted) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(vol, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.04);
      } catch (e) {}
    }

    playChime() {
      this.playTone(587.33, 0.2, 0.09);
      setTimeout(() => this.playTone(880, 0.35, 0.09), 90);
    }

    playStarArpeggio() {
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((n, idx) => {
        setTimeout(() => this.playTone(n, 0.45, 0.09), idx * 95);
      });
    }
  }

  const music = new MusicController();

  // ==================== FLOATING BLUE HEARTS BACKGROUND CANVAS ====================
  function initFloatingHeartsCanvas() {
    const canvas = document.getElementById("canvas-hearts");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let hearts = [];
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", resize);
    resize();

    const bluePalette = [
      "59, 130, 246",
      "96, 165, 250",
      "37, 99, 235",
      "147, 197, 253",
    ];

    class Heart {
      constructor(spreadY) {
        this.reset();
        if (spreadY) this.y = Math.random() * window.innerHeight;
      }
      reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + Math.random() * 25;
        this.size = Math.random() * 14 + 8;
        this.speed = Math.random() * 0.95 + 0.45;
        this.opacity = Math.random() * 0.36 + 0.14;
        this.sway = Math.random() * 1.4 - 0.7;
        this.swaySpeed = Math.random() * 0.02 + 0.005;
        this.swayTime = Math.random() * 100;
        this.rgb = bluePalette[Math.floor(Math.random() * bluePalette.length)];
      }
      update(dtFactor) {
        this.y -= this.speed * dtFactor;
        this.swayTime += this.swaySpeed * dtFactor;
        this.x += Math.sin(this.swayTime) * this.sway * dtFactor;
        if (this.y < -this.size) this.reset();
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.moveTo(0, -this.size / 4);
        ctx.bezierCurveTo(
          this.size / 2,
          -this.size,
          this.size * 1.2,
          -this.size / 3,
          0,
          this.size * 0.8
        );
        ctx.bezierCurveTo(
          -this.size * 1.2,
          -this.size / 3,
          -this.size / 2,
          -this.size,
          0,
          -this.size / 4
        );
        ctx.closePath();
        ctx.fillStyle = `rgba(${this.rgb}, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 36; i++) hearts.push(new Heart(true));

    let lastTime = performance.now();
    function loop(currentTime) {
      const dt = Math.min((currentTime - lastTime) / 16.67, 2.5) || 1;
      lastTime = currentTime;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      hearts.forEach((h) => {
        h.update(dt);
        h.draw();
      });
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  // 3D Fluffy Blue Heart SVG (matches _ - 2026-10-17T182328.150.jpeg in Blue Theme)
  function renderFluffyBlueHeartSvg(idx) {
    return `
      <svg class="ttt-fluffy-heart" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fluffyBlueGrad${idx}" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#93c5fd" />
            <stop offset="42%" stop-color="#3b82f6" />
            <stop offset="78%" stop-color="#1d4ed8" />
            <stop offset="100%" stop-color="#1e3a8a" />
          </radialGradient>
        </defs>
        <path
          fill="url(#fluffyBlueGrad${idx})"
          d="M50,86 C50,86 10,60 10,33 C10,18 22,10 34,10 C42,10 48,15 50,21 C52,15 58,10 66,10 C78,10 90,18 90,33 C90,60 50,86 50,86 Z"
        />
        <ellipse cx="33" cy="27" rx="10" ry="6" fill="rgba(255,255,255,0.28)" transform="rotate(-25 33 27)" />
      </svg>
    `;
  }

  function renderTicTacToeHeartSlot(slotIdx) {
    const placed = state.tttHearts[slotIdx];
    return `
      <button
        type="button"
        class="ttt-heart-slot"
        data-ttt-slot="${slotIdx}"
        aria-label="ວາງຫົວໃຈສີຟ້າດວງທີ ${slotIdx + 1}"
      >
        ${
          placed
            ? renderFluffyBlueHeartSvg(slotIdx)
            : `<div class="ttt-heart-placeholder">
                 <span style="font-size:1.25rem;">💙</span>
                 <span>ແຕະ</span>
               </div>`
        }
      </button>
    `;
  }

  // ==================== CONSTELLATION CAMERA & LINES ====================
  function getConstellationArenaTransform() {
    const allDone = state.starsConnected >= HEART_STARS.length;
    if (allDone) {
      return "translate(-50%, -50%) scale(1) translate(0%, 0%)";
    }
    const targetIdx = Math.min(state.starsConnected, HEART_STARS.length - 1);
    const targetStar = HEART_STARS[targetIdx];
    const scale = window.innerWidth < 680 ? 2.2 : 2.5;
    const offsetX = 50 - targetStar.x;
    const offsetY = 50 - targetStar.y;
    return `translate(-50%, -50%) scale(${scale}) translate(${offsetX}%, ${offsetY}%)`;
  }

  function getHeartPolygonPoints() {
    return HEART_STARS.map((s) => `${s.x},${s.y}`).join(" ");
  }

  function renderConstellationSvgLines() {
    const completed = state.starsConnected >= HEART_STARS.length;
    if (!completed) {
      return `
        <polygon
          id="heart-constellation-polygon"
          class="heart-constellation-fill"
          points="${getHeartPolygonPoints()}"
        />
        <g id="constellation-active-lines-group"></g>
      `;
    }

    // ALL 8 STARS ARE CONNECTED -> REVEAL THE FULL HEART CONSTELLATION!
    const lines = [];
    for (let i = 0; i < HEART_STARS.length; i++) {
      const from = HEART_STARS[i];
      const to = HEART_STARS[(i + 1) % HEART_STARS.length];
      lines.push(
        `<line
          class="constellation-heart-line"
          style="animation-delay: ${(i * 0.1).toFixed(2)}s;"
          x1="${from.x}"
          y1="${from.y}"
          x2="${to.x}"
          y2="${to.y}"
        />`
      );
    }

    return `
      <polygon
        id="heart-constellation-polygon"
        class="heart-constellation-fill revealed"
        points="${getHeartPolygonPoints()}"
      />
      <g id="constellation-active-lines-group">
        ${lines.join("")}
      </g>
    `;
  }

  // ==================== REALISTIC 3D PUSHPIN SVG ====================
  function renderPushpinSvg(color) {
    const colorMap = {
      red: { light: "#fca5a5", main: "#ef4444", dark: "#b91c1c", darkest: "#7f1d1d" },
      blue: { light: "#93c5fd", main: "#3b82f6", dark: "#1d4ed8", darkest: "#1e3a8a" },
      yellow: { light: "#fef08a", main: "#eab308", dark: "#ca8a04", darkest: "#78350f" },
      green: { light: "#86efac", main: "#10b981", dark: "#047857", darkest: "#064e3b" },
    };
    const c = colorMap[color] || colorMap.red;
    return `
      <svg class="scrapbook-pin-svg" viewBox="0 0 28 36" width="22" height="28" aria-hidden="true">
        <defs>
          <radialGradient id="pin-grad-${color}" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="${c.light}" />
            <stop offset="35%" stop-color="${c.main}" />
            <stop offset="80%" stop-color="${c.dark}" />
            <stop offset="100%" stop-color="${c.darkest}" />
          </radialGradient>
        </defs>
        <ellipse cx="17" cy="31" rx="6.5" ry="3.2" fill="rgba(15, 23, 42, 0.38)" />
        <ellipse cx="14" cy="24.5" rx="6.5" ry="3.2" fill="url(#pin-grad-${color})" />
        <path d="M 9.5,12 C 9.5,18 8.5,22.5 14,24 C 19.5,22.5 18.5,18 18.5,12 Z" fill="url(#pin-grad-${color})" />
        <circle cx="14" cy="9.5" r="7.5" fill="url(#pin-grad-${color})" />
        <ellipse cx="11.5" cy="7" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.85" transform="rotate(-30 11.5 7)" />
      </svg>
    `;
  }

  // ==================== SCRAPBOOK PINBOARD (CONTINUOUS VERTICAL FLOW) ====================
  function renderScrapbookBoard() {
    const nextIdx = state.archiveOpened.findIndex((v) => !v);

    return `
      <div class="scrapbook-board-container" id="scrapbook-board-container">
        ${SCRAPBOOK_MEMORIES.map((item, itemIdx) => {
          const isRevealed = state.archiveOpened[itemIdx];
          const isNext = itemIdx === nextIdx;
          const cfg = SCRAPBOOK_ROW_CONFIGS[itemIdx % SCRAPBOOK_ROW_CONFIGS.length];
          const dynamicImg = (CONFIG.polaroids && CONFIG.polaroids[itemIdx]?.image) || item.image;
          const dynamicCap = (CONFIG.polaroids && CONFIG.polaroids[itemIdx]?.caption) || item.caption;

          const cardHtml = `
            <div class="scrapbook-card-item side-${cfg.cardSide}" data-archive-idx="${itemIdx}">
              <div class="scrapbook-pin-wrapper">
                ${renderPushpinSvg(cfg.cardPin)}
              </div>
              <div class="scrapbook-card-header">
                <span class="scrapbook-card-title">${escapeHtml(item.title)}</span>
                <span class="scrapbook-card-badge">${isRevealed ? "✓ ເປີດແລ້ວ" : "📸 ແຕະເປີດ"}</span>
              </div>
              <div class="scrapbook-card-message">
                “${escapeHtml(item.message)}”
              </div>
            </div>
          `;

          const polHtml = `
            <div
              class="scrapbook-polaroid-item side-${cfg.polSide} ${isRevealed ? "revealed" : ""} ${isNext ? "next-target" : ""}"
              data-archive-idx="${itemIdx}"
              data-is-polaroid="1"
              style="--rot: ${cfg.polRotate};"
            >
              <div class="scrapbook-pin-wrapper">
                ${renderPushpinSvg(cfg.polPin)}
              </div>
              <div class="scrapbook-polaroid-window">
                <div class="scrapbook-film-overlay">
                  <div style="font-size:1.1rem; margin-bottom:2px;">📸</div>
                  <div style="font-size:0.68rem; font-weight:700;">ແຕະເປີດຮູບ</div>
                </div>
                <img
                  class="scrapbook-photo-img"
                  src="${escapeHtml(resolveMediaUrl(dynamicImg))}"
                  alt="${escapeHtml(item.title)}"
                  onerror="this.src='${DEFAULT_PLACEHOLDER_IMG}'"
                />
              </div>
              <div class="scrapbook-polaroid-caption">
                ${isRevealed ? escapeHtml(dynamicCap) : "ຄວາມຊົງຈຳທີ " + (itemIdx + 1)}
              </div>
            </div>
          `;

          return `
            <div class="scrapbook-row scrapbook-row-${itemIdx}" id="scrapbook-row-${itemIdx}">
              ${cfg.cardSide === "left" ? cardHtml + polHtml : polHtml + cardHtml}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // ==================== LIGHTBOX MODAL FOR SCRAPBOOK PHOTO ====================
  function renderScrapbookLightbox() {
    if (!state.lightboxPhoto) return "";
    return `
      <div class="scrapbook-lightbox active" id="scrapbook-lightbox">
        <div class="scrapbook-lightbox-backdrop" id="scrapbook-lightbox-backdrop"></div>
        <div class="scrapbook-lightbox-dialog">
          <button type="button" class="scrapbook-lightbox-close" id="btn-close-lightbox">✕</button>
          <img
            src="${escapeHtml(resolveMediaUrl(state.lightboxPhoto.image))}"
            class="scrapbook-lightbox-img"
            alt="${escapeHtml(state.lightboxPhoto.title)}"
          />
          <div class="scrapbook-lightbox-caption">${escapeHtml(state.lightboxPhoto.caption)}</div>
          <div class="scrapbook-lightbox-message">“${escapeHtml(state.lightboxPhoto.message)}”</div>
        </div>
      </div>
    `;
  }

  // ==================== JIGSAW PIECE SVG PATH GENERATOR ====================
  // Generates the exact interlocking puzzle outline with outward tabs (+1) and inward holes (-1)
  function buildJigsawPathD(top, right, bottom, left) {
    let d = "M 0,0 ";

    // Top edge (0,0 -> 100,0)
    if (top === 1) {
      d += "L 35,0 C 37,-4 32,-8 36,-13 C 40,-18 60,-18 64,-13 C 68,-8 63,-4 65,0 L 100,0 ";
    } else if (top === -1) {
      d += "L 35,0 C 37,4 32,8 36,13 C 40,18 60,18 64,13 C 68,8 63,4 65,0 L 100,0 ";
    } else {
      d += "L 100,0 ";
    }

    // Right edge (100,0 -> 100,100)
    if (right === 1) {
      d += "L 100,35 C 104,37 108,32 113,36 C 118,40 118,60 113,64 C 108,68 104,63 100,65 L 100,100 ";
    } else if (right === -1) {
      d += "L 100,35 C 96,37 92,32 87,36 C 82,40 82,60 87,64 C 92,68 96,63 100,65 L 100,100 ";
    } else {
      d += "L 100,100 ";
    }

    // Bottom edge (100,100 -> 0,100)
    if (bottom === 1) {
      d += "L 65,100 C 63,104 68,108 64,113 C 60,118 40,118 36,113 C 32,108 37,104 35,100 L 0,100 ";
    } else if (bottom === -1) {
      d += "L 65,100 C 63,96 68,92 64,87 C 60,82 40,82 36,87 C 32,92 37,96 35,100 L 0,100 ";
    } else {
      d += "L 0,100 ";
    }

    // Left edge (0,100 -> 0,0)
    if (left === 1) {
      d += "L 0,65 C -4,63 -8,68 -13,64 C -18,60 -18,40 -13,36 C -8,32 -4,37 0,35 L 0,0 ";
    } else if (left === -1) {
      d += "L 0,65 C 4,63 8,68 13,64 C 18,60 18,40 13,36 C 8,32 4,37 0,35 L 0,0 ";
    } else {
      d += "L 0,0 ";
    }

    d += "Z";
    return d;
  }

  // ==================== JIGSAW METRICS & SCATTER LAYOUT ====================
  function getJigsawMetrics(stageWidth) {
    const isMobile = stageWidth < 520;
    const coreSize = isMobile ? 80 : 100;
    const pieceSize = isMobile ? 112 : 140;
    return { coreSize, pieceSize, isMobile };
  }

  // Scatter positions matching media_1792307652569_5e4fd4f9.png:
  // Row 1: Pieces 0, 1, 2, 3 (badges 1, 2, 3, 4)
  // Row 2: Pieces 4, 5 (badges 5, 6)
  function getInitialJigsawPositions(stageWidth) {
    const { pieceSize, isMobile } = getJigsawMetrics(stageWidth);
    if (!isMobile) {
      const stepX = Math.min((stageWidth - pieceSize) / 3.2, 145);
      const startX = Math.max(12, (stageWidth - (stepX * 3 + pieceSize)) / 2);
      const row1Y = 22;
      const row2Y = 215;
      const startRow2X = startX + stepX * 0.7;

      return [
        { x: Math.round(startX + 0 * stepX), y: row1Y, rot: -7 },
        { x: Math.round(startX + 1 * stepX), y: row1Y + 8, rot: 8 },
        { x: Math.round(startX + 2 * stepX), y: row1Y + 3, rot: -5 },
        { x: Math.round(startX + 3 * stepX), y: row1Y + 6, rot: 9 },
        { x: Math.round(startRow2X + 0 * stepX * 1.2), y: row2Y, rot: -8 },
        { x: Math.round(startRow2X + 1 * stepX * 1.2), y: row2Y - 5, rot: 6 },
      ];
    } else {
      const colWidth = pieceSize + 18;
      const startColX = Math.max(10, (stageWidth - colWidth * 2) / 2);
      return [
        { x: Math.round(startColX), y: 12, rot: -6 },
        { x: Math.round(startColX + colWidth), y: 16, rot: 7 },
        { x: Math.round(startColX), y: 145, rot: -5 },
        { x: Math.round(startColX + colWidth), y: 150, rot: 8 },
        { x: Math.round(startColX), y: 280, rot: -7 },
        { x: Math.round(startColX + colWidth), y: 285, rot: 6 },
      ];
    }
  }

  // ==================== REAL PHOTO JIGSAW PIECE SVG GENERATOR ====================
  // Cuts a single high-definition hero couple photo into 6 interlocking jigsaw pieces (2 cols x 3 rows)
  function renderPhotoJigsawPieceSvg(pieceIdx) {
    const p = JIGSAW_PIECES_CONFIG[pieceIdx];
    const pathD = buildJigsawPathD(
      p.edges.top,
      p.edges.right,
      p.edges.bottom,
      p.edges.left
    );
    const photoUrl = resolveMediaUrl(
      CONFIG.jigsawImage || CONFIG.pinImage || "./media/med-do-fan-01.jpeg"
    );

    // Full photo size in normalized SVG units: 2 cols * 100 = 200, 3 rows * 100 = 300
    const imgTotalWidth = 200;
    const imgTotalHeight = 300;
    const imgOffsetX = -p.col * 100;
    const imgOffsetY = -p.row * 100;

    return `
      <svg class="photo-jigsaw-svg" viewBox="-20 -20 140 140" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="photoPieceClip${pieceIdx}">
            <path d="${pathD}" />
          </clipPath>
          <linearGradient id="photoGloss${pieceIdx}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
            <stop offset="28%" stop-color="#ffffff" stop-opacity="0.12" />
            <stop offset="65%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Base Jigsaw Piece Clipped from Full Couple Photo -->
        <g clip-path="url(#photoPieceClip${pieceIdx})">
          <!-- Fallback Soft Blue Backdrop -->
          <rect x="-20" y="-20" width="140" height="140" fill="#bfdbfe" />

          <!-- Full Couple Photo Offset to Display Exactly this Piece's Segment -->
          <image
            href="${escapeHtml(photoUrl)}"
            x="${imgOffsetX}"
            y="${imgOffsetY}"
            width="${imgTotalWidth}"
            height="${imgTotalHeight}"
            preserveAspectRatio="xMidYMid slice"
          />

          <!-- Diagonal Gloss Shine -->
          <polygon points="-20,-20 140,-20 -20,100" fill="url(#photoGloss${pieceIdx})" pointer-events="none" />

          <!-- Corner Piece Number Badge (Hidden upon full puzzle completion) -->
          ${
            !state.jigsawCompleted
              ? `
            <circle cx="15" cy="15" r="9" fill="rgba(30, 58, 109, 0.9)" stroke="#ffffff" stroke-width="1.3" />
            <text x="15" y="18.5" text-anchor="middle" fill="#ffffff" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif">
              ${pieceIdx + 1}
            </text>
          `
              : ""
          }
        </g>

        <!-- 3D Embossed Jigsaw Outer Border -->
        <path
          d="${pathD}"
          fill="none"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="2.2"
          stroke-linejoin="round"
          pointer-events="none"
        />
        <path
          d="${pathD}"
          fill="none"
          stroke="rgba(15, 23, 42, 0.35)"
          stroke-width="0.8"
          stroke-linejoin="round"
          pointer-events="none"
        />
      </svg>
    `;
  }

  // ==================== BIRTHDAY BALLOONS & WISHES CONFIG ====================
  const BIRTHDAY_BALLOONS_CONFIG = [
    {
      id: 0,
      color: "sky",
      icon: "🎂",
      title: "Happy Birthday!",
      text: "ສຸກສັນວັນເກີດເດີ້ຄົນພິເສດ! ຂໍໃຫ້ປີນີ້ເຕັມໄປດ້ວຍຮອຍຍິ້ມ ແລະ ສຸຂະພາບແຂງແຮງ 💙",
    },
    {
      id: 1,
      color: "royal",
      icon: "✨",
      title: "My Happiness",
      text: "ຂອບໃຈທີ່ເຂົ້າມາເປັນຄວາມສຸກ ແລະ ຮອຍຍິ້ມທີ່ດີທີ່ສຸດໃນໂລກເລີຍ 🌟",
    },
    {
      id: 2,
      color: "pastel",
      icon: "🌟",
      title: "Best Wishes",
      text: "ຂໍໃຫ້ທຸກໆມື້ຂອງເຈົ້າມີແຕ່ຄວາມສຸກ, ຄວາມສະບາຍໃຈ ແລະ ໂຊກດີຕະຫຼອດໄປ ✨",
    },
    {
      id: 3,
      color: "indigo",
      icon: "💫",
      title: "Stay Together",
      text: "ຢູ່ສ້າງຄວາມຊົງຈຳດີໆນຳກັນ ແລະ ຍິ້ມນຳກັນແບບນີ້ໄປທຸກໆປີເລີຍເດີ້ 😘💙",
    },
    {
      id: 4,
      color: "gold",
      isCoupon: true,
      icon: "🎁",
      title: "Special Gift",
      text: "ຄູປອງວັນເກີດ: ຕາມໃຈເຈົ້າ 1 ມື້ເຕັມ 💙",
      code: "BLUE-BIRTHDAY",
    },
    {
      id: 5,
      color: "heart",
      icon: "💙",
      title: "Forever Love",
      text: "YOU & ME FOREVER — ຮັກເຈົ້າຫຼາຍໆເດີ້ຄົນເກັ່ງ 💙",
    },
  ];

  function renderBalloonSvg(idx, colorType) {
    const gradients = {
      sky: { light: "#e0f2fe", mid: "#38bdf8", dark: "#0284c7", deep: "#0369a1" },
      royal: { light: "#dbeafe", mid: "#60a5fa", dark: "#2563eb", deep: "#1d4ed8" },
      pastel: { light: "#eff6ff", mid: "#93c5fd", dark: "#3b82f6", deep: "#1e40af" },
      indigo: { light: "#e0e7ff", mid: "#818cf8", dark: "#4f46e5", deep: "#3730a3" },
      gold: { light: "#fef9c3", mid: "#facc15", dark: "#ca8a04", deep: "#854d0e" },
      heart: { light: "#93c5fd", mid: "#3b82f6", dark: "#1d4ed8", deep: "#1e3a8a" },
    };

    const g = gradients[colorType] || gradients.royal;

    if (colorType === "heart") {
      return `
        <svg class="balloon-svg-element" viewBox="0 0 70 85" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="balloonHeartGrad${idx}" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="${g.light}" />
              <stop offset="42%" stop-color="${g.mid}" />
              <stop offset="78%" stop-color="${g.dark}" />
              <stop offset="100%" stop-color="${g.deep}" />
            </radialGradient>
          </defs>
          <path
            fill="url(#balloonHeartGrad${idx})"
            d="M35,68 C35,68 8,48 8,26 C8,14 18,7 27,7 C33,7 34,11 35,16 C36,11 37,7 43,7 C52,7 62,14 62,26 C62,48 35,68 35,68 Z"
          />
          <ellipse cx="23" cy="20" rx="7" ry="4" fill="rgba(255,255,255,0.4)" transform="rotate(-30 23 20)" />
          <polygon points="32,68 38,68 35,74" fill="${g.dark}" />
        </svg>
      `;
    }

    return `
      <svg class="balloon-svg-element" viewBox="0 0 70 85" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="balloonRoundGrad${idx}" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="${g.light}" />
            <stop offset="45%" stop-color="${g.mid}" />
            <stop offset="85%" stop-color="${g.dark}" />
            <stop offset="100%" stop-color="${g.deep}" />
          </radialGradient>
        </defs>
        <!-- Teardrop Helium Balloon Body -->
        <path
          d="M 35,6 C 16,6 8,22 8,42 C 8,62 26,73 32,77 L 30,81 L 40,81 L 38,77 C 44,73 62,62 62,42 C 62,22 54,6 35,6 Z"
          fill="url(#balloonRoundGrad${idx})"
        />
        <!-- Specular 3D Gloss Highlight -->
        <ellipse cx="23" cy="23" rx="9" ry="5.5" fill="rgba(255, 255, 255, 0.45)" transform="rotate(-35 23 23)" />
      </svg>
    `;
  }

  // ==================== PAGE 4: INTERACTIVE PHOTO JIGSAW WORKSHOP & FINALE ====================
  function renderJigsawAndCollageFinale() {
    const photoUrl = resolveMediaUrl(
      CONFIG.jigsawImage || CONFIG.pinImage || "./media/med-do-fan-01.jpeg"
    );

    const isMobile = window.innerWidth < 520;
    const coreSize = isMobile ? 80 : 100;
    const photoW = 2 * coreSize;
    const photoH = 3 * coreSize;

    return `
      <div class="jigsaw-workshop-stage">
        <!-- Top Birthday Header (Prominently displayed, ample margin, not clipped!) -->
        <div class="jigsaw-birthday-header" style="text-align:center; margin-top:6px; margin-bottom:2px;">
          <h1 style="margin:0 0 6px 0; line-height:1.25;">
            ${
              state.jigsawCompleted
                ? `<span style="font-family:var(--font-serif); font-size:clamp(1.85rem, 4.6vw, 2.6rem); color:#1e3a8a; font-weight:800;">Happy Birthday </span><span class="hero-title-highlight" style="font-size:clamp(2.3rem, 5.8vw, 3.4rem); color:#2563eb;">My Love! 🎂💙</span>`
                : `<span style="font-family:var(--font-serif); font-size:clamp(1.75rem, 4.2vw, 2.5rem); color:#1e3a8a; font-weight:800;">ຕໍ່ຮູບຄູ່ແຫ່ງຄວາມຊົງຈຳ </span><span class="hero-title-highlight" style="font-size:clamp(2.1rem, 4.8vw, 2.9rem); color:#2563eb;">You &amp; Me 💙</span>`
            }
          </h1>
          <div class="jigsaw-instruction-pill">
            <span>${state.jigsawCompleted ? "🎈" : "🧩"}</span>
            <span>
              ${
                state.jigsawCompleted
                  ? "✨ ຮູບຄູ່ຕໍ່ສຳເລັດແລ້ວ! ແຕະທີ່ລູກໂປ່ງເພື່ອເບິ່ງຄຳອວຍພອນ & ຂອງຂວັນ 💙"
                  : "👇 ຄລິກເມົ້າຄ້າງ (Hold) ທີ່ຊິ້ນສ່ວນແລ້ວລາກມາປະກອບໃສ່ກັນ"
              }
            </span>
          </div>
        </div>

        ${
          !state.jigsawCompleted
            ? `
          <div style="text-align:center; margin-top:-6px;">
            <button
              type="button"
              id="btn-quick-solve-jigsaw"
              style="background:transparent; border:none; color:var(--accent-red); font-weight:700; font-size:0.86rem; text-decoration:underline; cursor:pointer;"
            >
              ⚡ ວາງຊິ້ນສ່ວນທັງໝົດໃຫ້ຄົບເລີຍ ➔
            </button>
          </div>
        `
            : ""
        }

        <!-- Tabletop Stage with ONLY the 6 scattered jigsaw pieces OR the seamless photo -->
        <div
          class="jigsaw-table-stage ${state.jigsawCompleted ? "all-connected" : ""}"
          id="jigsaw-table-stage"
        >
          ${
            !state.jigsawCompleted
              ? JIGSAW_PIECES_CONFIG.map((p) => {
                  const pos =
                    (state.jigsawPositions && state.jigsawPositions[p.id]) || {
                      x: 0,
                      y: 0,
                      rot: 0,
                    };
                  return `
                    <div
                      class="jigsaw-piece-element"
                      data-draggable-piece="${p.id}"
                      id="draggable-piece-${p.id}"
                      style="transform: translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.rot}deg);"
                      title="ຊິ້ນສ່ວນທີ ${p.id + 1}"
                    >
                      ${renderPhotoJigsawPieceSvg(p.id)}
                    </div>
                  `;
                }).join("")
              : `
                <!-- 100% Seamless Continuous Real Photograph (Zero Jigsaw Cuts/Seams!) -->
                <div
                  class="jigsaw-seamless-photo-container"
                  id="jigsaw-seamless-photo"
                  style="width:${photoW}px; height:${photoH}px; left:calc(50% - ${photoW / 2}px); top:calc(50% - ${photoH / 2}px);"
                >
                  <img
                    src="${escapeHtml(photoUrl)}"
                    alt="Do &amp; Fan"
                    class="jigsaw-seamless-real-img"
                    onerror="this.src='${DEFAULT_PLACEHOLDER_IMG}'"
                  />
                  <div class="jigsaw-seamless-glass-gloss"></div>
                  <div class="jigsaw-frame-plaque" id="jigsaw-frame-plaque">
                    <span>${escapeHtml(CONFIG.plaqueText || "✨ DO & FAN 💙 YOU & ME FOREVER ✨")}</span>
                  </div>

                  <!-- Reply bar directly anchored under the DO & FAN plaque -->
                  <div class="plaque-attached-reply-pill" id="celebration-reply-pill">
                    ${
                      state.replySent
                        ? `<span class="reply-sent-badge">✓ ສົ່ງຫົວໃຈ ແລະ ຄຳຕອບກັບໄປຫາ ${escapeHtml(
                            CONFIG.senderName
                          )} ແລ້ວ 💙</span>`
                        : `
                        <input
                          type="text"
                          id="celebration-reply-input"
                          class="attached-reply-input"
                          placeholder="ພິມຂໍ້ຄວາມຕອບກັບຫາ ${escapeHtml(CONFIG.senderName)}..."
                          value="${escapeHtml(state.replyText)}"
                        />
                        <button type="button" id="btn-send-reply" class="attached-send-btn">
                          ສົ່ງ 💙
                        </button>
                      `
                    }
                  </div>
                </div>

                <!-- Floating Romantic Message Balloons floating around the photo -->
                <div class="balloons-floating-arena">
                  ${BIRTHDAY_BALLOONS_CONFIG.map(
                    (b, idx) => `
                    <div
                      class="floating-message-balloon balloon-pos-${idx} ${b.isCoupon ? "coupon-balloon" : ""}"
                      data-balloon-idx="${idx}"
                      title="${escapeHtml(b.title)}"
                    >
                      <div class="balloon-visual-wrap">
                        ${renderBalloonSvg(idx, b.color)}
                      </div>
                      <div class="balloon-string-tail"></div>
                      <div class="balloon-msg-tag">
                        <div class="balloon-msg-header">
                          <span>${b.icon}</span>
                          <span>${escapeHtml(b.title)}</span>
                        </div>
                        <div class="balloon-msg-text">
                          ${escapeHtml(b.text)}
                          ${
                            b.isCoupon
                              ? `<div class="coupon-code-pill">${escapeHtml(b.code)}</div>`
                              : ""
                          }
                        </div>
                      </div>
                    </div>
                  `
                  ).join("")}
                </div>
              `
          }
        </div>

        <!-- Small ↺ Restart Button anchored in bottom-right corner -->
        ${
          state.jigsawCompleted
            ? `
            <button
              type="button"
              id="restart-btn"
              class="corner-restart-btn"
              title="ເລີ່ມຕົ້ນຫຼິ້ນໃໝ່"
              aria-label="ເລີ່ມຕົ້ນຫຼິ້ນໃໝ່"
            >
              <span class="corner-restart-icon">↺</span>
              <span class="corner-restart-text">ຫຼິ້ນໃໝ່</span>
            </button>
          `
            : ""
        }
      </div>
    `;
  }

  // ==================== BUILD FULL TEMPLATE DOM ====================
  function renderTemplateShell() {
    const viewport = document.getElementById("stage-viewport");
    if (!viewport) return;

    const allTttPlaced = state.tttHearts.every(Boolean);
    const allStarsDone = state.starsConnected >= HEART_STARS.length;
    const currentWhisper =
      state.starsConnected === 0
        ? "👆 ແຕະດາວແຫ່ງຄວາມຮັກດວງທີ 1 ທີ່ກຳລັງກະພິບ ເພື່ອເລີ່ມຕົ້ນການເດີນທາງ 💙"
        : ((CONFIG.whispers && CONFIG.whispers[Math.min(state.starsConnected - 1, HEART_STARS.length - 1)]) ||
          HEART_STARS[Math.min(state.starsConnected - 1, HEART_STARS.length - 1)].whisper);

    const archiveOpenedCount = state.archiveOpened.filter(Boolean).length;

    viewport.innerHTML = `
      <canvas id="canvas-confetti"></canvas>

      <!-- STAGE 0: TIC-TAC-TOE "Love is always a good idea <3" LOCK SCREEN -->
      <div id="envelope-screen" class="${state.unlocked ? "hidden-screen" : ""}">
        <div class="ttt-lock-card" id="pin-modal">
          <h1 class="ttt-header-title">For My ${escapeHtml(CONFIG.receiverName)} 💙</h1>
          <p class="ttt-header-sub">${escapeHtml(CONFIG.pinHint)}</p>

          <div class="ttt-board-wrapper">
            <div class="ttt-board">
              <div class="ttt-cell"><span class="ttt-word">Love</span></div>
              <div class="ttt-cell"><span class="ttt-word">is</span></div>
              <div class="ttt-cell">${renderTicTacToeHeartSlot(0)}</div>

              <div class="ttt-cell"><span class="ttt-word">always</span></div>
              <div class="ttt-cell">${renderTicTacToeHeartSlot(1)}</div>
              <div class="ttt-cell"><span class="ttt-word">a good</span></div>

              <div class="ttt-cell">${renderTicTacToeHeartSlot(2)}</div>
              <div class="ttt-cell"><span class="ttt-word">idea</span></div>
              <div class="ttt-cell"><span class="ttt-word">&lt;3</span></div>
            </div>

            <svg class="ttt-win-line-svg" viewBox="0 0 100 100">
              <line
                class="ttt-win-line ${allTttPlaced ? "drawn" : ""}"
                x1="84"
                y1="16"
                x2="16"
                y2="84"
              />
            </svg>
          </div>

          <div class="ttt-footer-bar">
            <div style="font-size:0.86rem; color:var(--text-secondary); font-weight:600;">
              ວາງຫົວໃຈສີຟ້າຄົບ ${state.tttHearts.filter(Boolean).length} / 3 ດວງ
            </div>
            <button
              type="button"
              id="btn-quick-unlock"
              style="background:transparent; border:none; color:var(--accent-red); font-weight:700; font-size:0.88rem; text-decoration:underline; cursor:pointer;"
            >
              ວາງຫົວໃຈທັງ 3 ດວງ & ເປີດເຂົ້າເບິ່ງເລີຍ ➔
            </button>
          </div>
        </div>

        <div id="loader-screen" class="hidden">
          <div class="loader-content">
            <p class="loader-text">Love is always a good idea 💙</p>
            <div class="loading-bar-container">
              <div class="loading-bar" id="loading-bar"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN 4-STAGE JOURNEY -->
      <main class="pages-container">
        <!-- PAGE 1: REALISTIC 3D BLUE ENVELOPE -> ANIMATED PAPER SLIDING OUT -> "ອອກເດີນທາງ" BUTTON -->
        <section class="page-section ${state.activePage === 1 ? "active" : ""}" id="page-1">
          <div class="page-content">
            ${renderPageDots(1)}
            <div class="envelope-stage-wrapper">
              <div id="letter-box-btn" class="${state.letterOpened ? "hidden" : ""}">
                <div class="envelope-scene ${state.envelopeOpening ? "opening" : ""}" id="envelope-3d-wrapper">
                  <div class="envelope-base"></div>
                  <div class="envelope-sliding-paper">
                    <div class="envelope-sliding-paper-title">For ${escapeHtml(CONFIG.receiverName)} 💙</div>
                    <div class="envelope-sliding-paper-sub">ຈົດໝາຍສີຟ້າສະບັບພິເສດສຳລັບເຈົ້າ</div>
                  </div>
                  <div class="flap"></div>
                  <div class="pocket"></div>
                  <div class="seal"></div>
                </div>
                <p style="text-align:center; color:var(--accent-red); font-family:var(--font-serif); font-size:1.25rem; font-weight:700; margin-top:2rem;">
                  👆 ແຕະທີ່ຊອງຈົດໝາຍສີຟ້າ ເພື່ອดຶງເຈ້ຍຈົດໝາຍອອກມາອ່ານ 💌
                </p>
              </div>

              <div class="letter-expanded-wrapper ${state.letterOpened ? "" : "hidden"}" id="letter-wrapper">
                <article class="letter-card" id="typewriter-letter">
                  <h2 class="letter-salutation" id="letter-salutation">${escapeHtml(CONFIG.letterSalutation)}</h2>
                  <div class="letter-body">
                    <p id="letter-p1">${state.letterOpened ? escapeHtml(CONFIG.letterParagraph1) : ""}</p>
                    <p id="letter-p2">${state.letterOpened ? escapeHtml(CONFIG.letterParagraph2) : ""}</p>
                    <p id="letter-p3">${state.letterOpened ? escapeHtml(CONFIG.letterParagraph3) : ""}</p>
                    <p id="letter-p4">${state.letterOpened ? escapeHtml(CONFIG.letterParagraph4) : ""}</p>
                  </div>
                  <h3 class="letter-signature" id="letter-signature-container">
                    <span id="letter-signature">${escapeHtml(CONFIG.letterSignature)}</span>
                    <span id="sender-name">${escapeHtml(CONFIG.senderName)} 💙</span>
                  </h3>

                  <div class="journey-cta-box">
                    <div class="journey-cta-hint">
                      👇 ກົດປຸ່ມ "ອອກເດີນທາງ" ດ້ານລຸ່ມນີ້ ເພື່ອເລີ່ມເດີນທາງໄປຫາໝູ່ດາວແຫ່ງຄວາມຮັກ
                    </div>
                    <button type="button" class="next-page-btn" id="letter-next-btn" data-target-page="2" style="margin-top:4px;">
                      🚀 ອອກເດີນທາງ ➔
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <!-- PAGE 2: FULL-SCREEN LOVE STARS CONSTELLATION (NO PRE-DRAWN HEART LINES!) -->
        <section class="page-section ${state.activePage === 2 ? "active" : ""}" id="page-2">
          <div class="constellation-fullscreen-stage" id="constellation-stage-card">
            <div class="constellation-sky-header">
              <h1 class="constellation-sky-title" id="anniversary-title">
                ${
                  allStarsDone
                    ? "✨ ສະເລີຍ: ດວງດາວແຫ່ງຄວາມຮັກທັງ 8 ລຽງກັນເປັນຮູບຫົວໃຈສີຟ້າ! 💙"
                    : "ດວງດາວແຫ່ງຄວາມຮັກ — ແຕະດາວທີ່ກະພິບເທື່ອລະດວງ ✨"
                }
              </h1>
              <div class="constellation-top-hud">
                <div class="constellation-status-pill" id="constellation-status-pill">
                  <span>✨</span>
                  <span id="constellation-progress-text">${
                    allStarsDone
                      ? "✨ ຄົບທັງ 8 ດວງແລ້ວ — ເປັນຮູບຫົວໃຈສີຟ້າ 💙"
                      : `ດາວແຫ່ງຄວາມຮັກດວງທີ ${state.starsConnected + 1} / ${HEART_STARS.length}`
                  }</span>
                </div>
                <button type="button" class="constellation-mini-btn" id="btn-reset-stars">
                  ↺ ເລີ່ມໃໝ່
                </button>
              </div>
            </div>

            <!-- Fixed Celestial Night Sky Background (Never re-composited on camera zoom!) -->
            <div class="constellation-bg-stars-layer" aria-hidden="true">
              ${BG_TWINKLE_STARS.map(
                (st) => `
                <span
                  class="bg-twinkle-star"
                  style="left:${st.x}%; top:${st.y}%; width:${st.size}px; height:${st.size}px; animation-delay:${st.delay}s;"
                ></span>
              `
              ).join("")}
            </div>

            <!-- Moving Constellation Camera Layer (Only translates and scales the 8 heart nodes) -->
            <div
              class="constellation-camera"
              id="constellation-camera"
            >

              <div
                class="constellation-heart-arena"
                id="constellation-heart-arena"
                style="transform: ${getConstellationArenaTransform()};"
              >
                <svg
                  class="constellation-lines-svg"
                  id="constellation-lines-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  ${renderConstellationSvgLines()}
                </svg>

                <div
                  class="constellation-center-heart ${allStarsDone ? "revealed" : ""}"
                  id="constellation-center-heart"
                >
                  <div class="constellation-center-heart-icon">💙</div>
                  <div class="constellation-center-heart-text">Our Heart Constellation</div>
                </div>

                ${HEART_STARS.map((star, idx) => {
                  const isLit = idx < state.starsConnected;
                  const isTarget = idx === state.starsConnected;
                  return `
                    <button
                      type="button"
                      class="star-node-btn ${isLit ? "lit" : ""} ${isTarget ? "current-target" : ""}"
                      data-star-index="${idx}"
                      style="left:${star.x}%; top:${star.y}%;"
                      aria-label="${escapeHtml(star.label)}"
                    >
                      <span class="star-3d-glyph" aria-hidden="true">&#9733;</span>
                      <span class="star-node-num">${idx + 1}</span>
                      <span class="star-node-label">${escapeHtml(star.label)}</span>
                    </button>
                  `;
                }).join("")}
              </div>
            </div>

            <div class="constellation-sky-footer">
              <div class="constellation-whisper-bar" id="constellation-whisper-bar">
                ${escapeHtml(currentWhisper)}
              </div>
              <div style="display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap;">
                <button
                  type="button"
                  class="constellation-mini-btn ${allStarsDone ? "hidden" : ""}"
                  id="btn-tap-next-star"
                  style="padding:9px 18px; font-size:0.88rem; background:rgba(37,99,235,0.85); border-color:#93c5fd;"
                >
                  ✨ ແຕະດາວແຫ່ງຄວາມຮັກດວງທີ ${Math.min(state.starsConnected + 1, HEART_STARS.length)}
                </button>
                <button
                  type="button"
                  class="constellation-mini-btn ${allStarsDone ? "" : "hidden"}"
                  id="btn-after-constellation"
                  data-target-page="3"
                  style="padding:9px 20px; font-size:0.9rem; background:linear-gradient(135deg,#3b82f6,#2563eb);"
                >
                  ໄປໜ້າເສັ້ນທາງຮູບຄວາມຊົງຈຳ ➔
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- PAGE 3: SCRAPBOOK MEMORY PINBOARD (MATCHING USER REFERENCE STYLE) -->
        <section class="page-section ${state.activePage === 3 ? "active" : ""}" id="page-3">
          <div class="page-content" style="justify-content:flex-start; padding-top:4px;">
            <div style="flex-shrink:0; text-align:center;">
              ${renderPageDots(3)}
              <h2 class="hero-title" style="font-size:clamp(1.15rem, 2.2vw, 1.48rem); margin:0; line-height:1.2;">
                <span>ບັນທຶກຄວາມຊົງຈຳ </span>
                <span class="hero-title-highlight" style="font-size:clamp(1.22rem, 2.4vw, 1.62rem);">ຂອງເຮົາສອງຄົນ 📌💙</span>
              </h2>
              <p style="color:var(--text-secondary); font-size:clamp(0.72rem, 1.2vw, 0.8rem); margin:2px 0 6px;">
                ແຕະທີ່ກອບຮູບ Polaroid ຫຼື ໃບໂນ້ດ ເພື່ອເປີດເບິ່ງຮູບຄວາມຊົງຈຳ (${archiveOpenedCount} / 6)
              </p>
            </div>

            ${renderScrapbookBoard()}

            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:2px; flex-shrink:0;">
              ${
                archiveOpenedCount < 6
                  ? `
                  <button
                    type="button"
                    class="next-page-btn"
                    id="btn-open-next-archive"
                    style="margin-top:0; padding:6px 14px; font-size:0.82rem; background:#ffffff; color:var(--accent-red); border:1.5px solid var(--accent-pink);"
                  >
                    📸 ເປີດຮູບຕໍ່ໄປ (${archiveOpenedCount + 1}/6)
                  </button>
                `
                  : ""
              }
              <button type="button" class="next-page-btn" data-target-page="4" style="margin-top:0; padding:6px 16px; font-size:0.82rem;">
                ໄປໜ້າຕໍ່ຈິກຊໍຄວາມຊົງຈຳ ➔
              </button>
            </div>
          </div>
        </section>

        <!-- PAGE 4: ACRYLIC MAGNET JIGSAW PUZZLE (MATCHING _ - 2026-10-17T185035.226.jpeg) -->
        <section class="page-section ${state.activePage === 4 ? "active" : ""}" id="page-4">
          <div class="page-content">
            ${renderPageDots(4)}
            ${renderJigsawAndCollageFinale()}
          </div>
        </section>
      </main>
      ${renderScrapbookLightbox()}
    `;

    wireAllInteractions();
  }

  function renderPageDots(currentPage) {
    return `
      <nav class="page-step-dots" aria-label="ເລືອກໜ້າ">
        ${[1, 2, 3, 4]
          .map(
            (p) => `
            <button
              type="button"
              class="page-step-dot ${p === currentPage ? "active" : ""}"
              data-jump-page="${p}"
              title="ດ່ານທີ ${p}"
            ></button>
          `
          )
          .join("")}
      </nav>
    `;
  }

  // ==================== UPDATE CONSTELLATION IN-PLACE ====================
  function updateConstellationInPlace() {
    const camera = document.getElementById("constellation-camera");
    const svg = document.getElementById("constellation-lines-svg");
    const progressText = document.getElementById("constellation-progress-text");
    const whisperBar = document.getElementById("constellation-whisper-bar");
    const centerHeart = document.getElementById("constellation-center-heart");
    const titleEl = document.getElementById("anniversary-title");
    const tapNextBtn = document.getElementById("btn-tap-next-star");
    const afterBtn = document.getElementById("btn-after-constellation");

    const allDone = state.starsConnected >= HEART_STARS.length;

    const arena = document.getElementById("constellation-heart-arena");
    if (arena) {
      arena.style.transform = getConstellationArenaTransform();
    }
    if (svg) {
      svg.innerHTML = renderConstellationSvgLines();
    }
    if (progressText) {
      progressText.textContent = allDone
        ? "✨ ຄົບທັງ 8 ດວງແລ້ວ — ເປັນຮູບຫົວໃຈສີຟ້າ 💙"
        : `ດາວແຫ່ງຄວາມຮັກດວງທີ ${state.starsConnected + 1} / ${HEART_STARS.length}`;
    }
    if (whisperBar) {
      whisperBar.textContent =
        state.starsConnected === 0
          ? "👆 ແຕະດາວແຫ່ງຄວາມຮັກດວງທີ 1 ທີ່ກຳລັງກະພິບ ເພື່ອເລີ່ມຕົ້ນການເດີນທາງ 💙"
          : ((CONFIG.whispers && CONFIG.whispers[Math.min(state.starsConnected - 1, HEART_STARS.length - 1)]) ||
            HEART_STARS[Math.min(state.starsConnected - 1, HEART_STARS.length - 1)].whisper);
    }
    if (centerHeart) {
      centerHeart.classList.toggle("revealed", allDone);
    }
    if (titleEl) {
      titleEl.textContent = allDone
        ? "✨ ສະເລີຍ: ດວງດາວແຫ່ງຄວາມຮັກທັງ 8 ລຽງກັນເປັນຮູບຫົວໃຈສີຟ້າ! 💙"
        : "ດວງດາວແຫ່ງຄວາມຮັກ — ແຕະດາວທີ່ກະພິບເທື່ອລະດວງ ✨";
    }
    if (tapNextBtn) {
      tapNextBtn.classList.toggle("hidden", allDone);
      tapNextBtn.textContent = `✨ ແຕະດາວແຫ່ງຄວາມຮັກດວງທີ ${Math.min(
        state.starsConnected + 1,
        HEART_STARS.length
      )}`;
    }
    if (afterBtn) {
      afterBtn.classList.toggle("hidden", !allDone);
    }

    document.querySelectorAll(".star-node-btn").forEach((btn) => {
      const idx = Number(btn.getAttribute("data-star-index"));
      const isLit = idx < state.starsConnected;
      const isTarget = idx === state.starsConnected;
      btn.classList.toggle("lit", isLit);
      btn.classList.toggle("current-target", isTarget);
    });
  }

  function advanceConstellationStar() {
    if (state.starsConnected >= HEART_STARS.length) {
      goToPage(3);
      return;
    }
    state.manualOverviewZoom = false;
    state.starsConnected += 1;

    if (state.starsConnected >= HEART_STARS.length) {
      music.playStarArpeggio();
      updateConstellationInPlace();

      if (state.autoTransitionTimer) clearTimeout(state.autoTransitionTimer);
      state.autoTransitionTimer = setTimeout(() => {
        if (state.activePage === 2) {
          goToPage(3);
        }
      }, 4200);
    } else {
      music.playTone(480 + state.starsConnected * 55, 0.28, 0.085);
      updateConstellationInPlace();
    }
  }

  // ==================== INTERACTIVE DIRECT PIECE-TO-PIECE JIGSAW PUZZLE ====================
  function initJigsawDragSystem() {
    const stageEl = document.getElementById("jigsaw-table-stage");
    if (!stageEl) return;

    const stageW = stageEl.clientWidth || (window.innerWidth < 680 ? window.innerWidth - 32 : 640);
    const stageH = stageEl.clientHeight || 420;
    const { coreSize, pieceSize } = getJigsawMetrics(stageW);
    stageEl.style.setProperty("--jigsaw-piece-size", `${pieceSize}px`);

    // Initialize positions and groups if not already created
    if (!state.jigsawPositions) {
      state.jigsawPositions = getInitialJigsawPositions(stageW);
      state.jigsawGroups = [[0], [1], [2], [3], [4], [5]];
      state.jigsawCompleted = false;

      // Apply initial transforms to DOM elements immediately
      JIGSAW_PIECES_CONFIG.forEach((p) => {
        const el = document.getElementById(`draggable-piece-${p.id}`);
        const pos = state.jigsawPositions[p.id];
        if (el && pos) {
          el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.rot}deg)`;
        }
      });
    }

    if (state.jigsawCompleted) return;

    const pieces = document.querySelectorAll("[data-draggable-piece]");
    if (pieces.length === 0) return;

    pieces.forEach((el) => {
      const pieceId = Number(el.getAttribute("data-draggable-piece"));

      // Prevent native dragging
      el.addEventListener("dragstart", (e) => e.preventDefault());

      const onPointerDown = (e) => {
        if (state.jigsawCompleted) return;
        if (e.button !== undefined && e.button !== 0) return; // Only primary click

        e.preventDefault();

        // 1. Identify which group contains this piece
        const curGroup = state.jigsawGroups.find((g) => g.includes(pieceId)) || [pieceId];

        // 2. Elevate all pieces in this cluster above other pieces
        curGroup.forEach((id, idx) => {
          const pieceEl = document.getElementById(`draggable-piece-${id}`);
          if (pieceEl) {
            pieceEl.style.zIndex = `${10000 + idx}`;
            pieceEl.classList.add("is-dragging");
            pieceEl.style.transition = "none";
          }
        });

        const startX = e.clientX;
        const startY = e.clientY;
        const initPositions = curGroup.map((id) => ({
          id,
          x: state.jigsawPositions[id].x,
          y: state.jigsawPositions[id].y,
          rot: state.jigsawPositions[id].rot,
        }));

        let isDragging = false;
        let lastDx = 0;
        let lastDy = 0;

        const onPointerMove = (moveEvt) => {
          moveEvt.preventDefault();
          const dx = moveEvt.clientX - startX;
          const dy = moveEvt.clientY - startY;

          if (!isDragging) {
            if (Math.hypot(dx, dy) > 4) {
              isDragging = true;
              document.body.style.cursor = "grabbing";
              document.body.style.userSelect = "none";
            } else {
              return;
            }
          }

          lastDx = dx;
          lastDy = dy;

          // Move the entire connected cluster together
          curGroup.forEach((id) => {
            const pieceEl = document.getElementById(`draggable-piece-${id}`);
            const init = initPositions.find((p) => p.id === id);
            if (pieceEl && init) {
              const curX = init.x + dx;
              const curY = init.y + dy;
              pieceEl.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(1.06) rotate(${init.rot}deg)`;
            }
          });

          // Proximity magnetic snap detection to any other piece
          const SNAP_DISTANCE = 75;
          let candidateTargetPiece = null;

          for (const pA of curGroup) {
            const initA = initPositions.find((p) => p.id === pA);
            const curAx = initA.x + dx;
            const curAy = initA.y + dy;
            const cfgA = JIGSAW_PIECES_CONFIG[pA];

            for (const otherGroup of state.jigsawGroups) {
              if (otherGroup === curGroup) continue;

              for (const pB of otherGroup) {
                const posB = state.jigsawPositions[pB];
                const cfgB = JIGSAW_PIECES_CONFIG[pB];

                const expDx = (cfgB.col - cfgA.col) * coreSize;
                const expDy = (cfgB.row - cfgA.row) * coreSize;

                const actDx = posB.x - curAx;
                const actDy = posB.y - curAy;

                const err = Math.hypot(actDx - expDx, actDy - expDy);
                if (err < SNAP_DISTANCE) {
                  candidateTargetPiece = pB;
                  break;
                }
              }
              if (candidateTargetPiece !== null) break;
            }
            if (candidateTargetPiece !== null) break;
          }

          // Highlight target pieces in proximity
          pieces.forEach((pEl) => {
            const id = Number(pEl.getAttribute("data-draggable-piece"));
            pEl.classList.toggle("can-snap-glow", id === candidateTargetPiece);
          });
        };

        const onPointerUp = () => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);

          document.body.style.cursor = "";
          document.body.style.userSelect = "";

          // Clear highlight aura
          pieces.forEach((pEl) => pEl.classList.remove("can-snap-glow"));

          // Reset dragging classes and z-index on cluster
          curGroup.forEach((id) => {
            const pieceEl = document.getElementById(`draggable-piece-${id}`);
            if (pieceEl) {
              pieceEl.classList.remove("is-dragging");
              pieceEl.style.zIndex = "20";
              pieceEl.style.transition = "transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.25)";
            }
          });

          if (!isDragging) {
            return;
          }

          // Update state positions of the dragged cluster
          curGroup.forEach((id) => {
            const init = initPositions.find((p) => p.id === id);
            if (init) {
              state.jigsawPositions[id].x = init.x + lastDx;
              state.jigsawPositions[id].y = init.y + lastDy;
            }
          });

          // Magnetic Snapping Loop
          const SNAP_THRESHOLD = 75;
          let keepSnapping = true;
          let snappedAny = false;

          while (keepSnapping) {
            keepSnapping = false;
            let bestSnap = null;
            let minErr = Infinity;

            const activeGroup = state.jigsawGroups.find((g) => g.includes(pieceId));
            if (!activeGroup) break;

            for (const pA of activeGroup) {
              const posA = state.jigsawPositions[pA];
              const cfgA = JIGSAW_PIECES_CONFIG[pA];

              for (const otherGroup of state.jigsawGroups) {
                if (otherGroup === activeGroup) continue;

                for (const pB of otherGroup) {
                  const posB = state.jigsawPositions[pB];
                  const cfgB = JIGSAW_PIECES_CONFIG[pB];

                  const expDx = (cfgB.col - cfgA.col) * coreSize;
                  const expDy = (cfgB.row - cfgA.row) * coreSize;

                  const actDx = posB.x - posA.x;
                  const actDy = posB.y - posA.y;

                  const err = Math.hypot(actDx - expDx, actDy - expDy);
                  if (err < SNAP_THRESHOLD && err < minErr) {
                    minErr = err;
                    bestSnap = {
                      activeGroup,
                      otherGroup,
                      pA,
                      pB,
                      shiftX: posB.x - expDx - posA.x,
                      shiftY: posB.y - expDy - posA.y,
                    };
                  }
                }
              }
            }

            if (bestSnap) {
              snappedAny = true;
              keepSnapping = true;

              // Shift activeGroup to dock directly onto otherGroup
              bestSnap.activeGroup.forEach((id) => {
                state.jigsawPositions[id].x += bestSnap.shiftX;
                state.jigsawPositions[id].y += bestSnap.shiftY;
                state.jigsawPositions[id].rot = 0; // Snap straight!
              });
              bestSnap.otherGroup.forEach((id) => {
                state.jigsawPositions[id].rot = 0; // Snap straight!
              });

              // Merge groups
              const merged = [...bestSnap.activeGroup, ...bestSnap.otherGroup];
              state.jigsawGroups = state.jigsawGroups.filter(
                (g) => g !== bestSnap.activeGroup && g !== bestSnap.otherGroup
              );
              state.jigsawGroups.push(merged);
            }
          }

          if (snappedAny) {
            const finalGroup = state.jigsawGroups.find((g) => g.includes(pieceId)) || [];
            music.playTone(600 + finalGroup.length * 45, 0.22, 0.09);

            // Update DOM transforms for snapped pieces
            finalGroup.forEach((id) => {
              const pieceEl = document.getElementById(`draggable-piece-${id}`);
              const pos = state.jigsawPositions[id];
              if (pieceEl && pos) {
                pieceEl.classList.add("is-connected");
                pieceEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.rot}deg)`;
              }
            });

            // Check if all 6 pieces are assembled!
            if (finalGroup.length >= 6) {
              state.jigsawCompleted = true;

              // Center the assembled photo neatly inside the table stage
              const allX = state.jigsawPositions.map((p) => p.x);
              const allY = state.jigsawPositions.map((p) => p.y);
              const minX = Math.min(...allX);
              const minY = Math.min(...allY);
              const photoW = 2 * coreSize;
              const photoH = 3 * coreSize;
              const targetX = Math.round((stageW - photoW) / 2 - (pieceSize - coreSize) / 2);
              const targetY = Math.round((stageH - photoH) / 2 - (pieceSize - coreSize) / 2);
              const offX = targetX - minX;
              const offY = targetY - minY;

              state.jigsawPositions.forEach((p) => {
                p.x += offX;
                p.y += offY;
                p.rot = 0;
              });

              music.playStarArpeggio();
              setTimeout(() => {
                renderTemplateShell();
                startCelebrationConfetti();
              }, 220);
              return;
            }
          } else {
            // Apply current positions without snap
            curGroup.forEach((id) => {
              const pieceEl = document.getElementById(`draggable-piece-${id}`);
              const pos = state.jigsawPositions[id];
              if (pieceEl && pos) {
                pieceEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.rot}deg)`;
              }
            });
          }
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      };

      el.addEventListener("pointerdown", onPointerDown);
    });
  }

  // ==================== WIRE INTERACTIONS ====================
  function wireAllInteractions() {
    // 0. Tic-Tac-Toe Lock Screen ("Love is always a good idea <3")
    const unlockFromTicTacToe = () => {
      music.playStarArpeggio();
      music.play();
      const pinModal = document.getElementById("pin-modal");
      const loaderScreen = document.getElementById("loader-screen");
      const loadingBar = document.getElementById("loading-bar");
      const envScreen = document.getElementById("envelope-screen");

      setTimeout(() => {
        if (pinModal) pinModal.classList.add("hidden");
        if (loaderScreen && loadingBar && envScreen) {
          loaderScreen.classList.remove("hidden");
          setTimeout(() => {
            loadingBar.style.width = "100%";
          }, 40);
          setTimeout(() => {
            state.unlocked = true;
            envScreen.classList.add("hidden-screen");
          }, 1150);
        } else if (envScreen) {
          state.unlocked = true;
          envScreen.classList.add("hidden-screen");
        }
      }, 650);
    };

    document.querySelectorAll("[data-ttt-slot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slotIdx = Number(btn.getAttribute("data-ttt-slot"));
        if (!state.tttHearts[slotIdx]) {
          state.tttHearts[slotIdx] = true;
          music.playTone(540 + slotIdx * 110, 0.22, 0.08);
          renderTemplateShell();
          if (state.tttHearts.every(Boolean)) {
            unlockFromTicTacToe();
          }
        }
      });
    });

    const quickUnlockBtn = document.getElementById("btn-quick-unlock");
    if (quickUnlockBtn) {
      quickUnlockBtn.addEventListener("click", () => {
        state.tttHearts = [true, true, true];
        renderTemplateShell();
        unlockFromTicTacToe();
      });
    }

    // 1. Page Navigation Buttons & Step Dots
    document.querySelectorAll("[data-target-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextP = Number(btn.getAttribute("data-target-page"));
        goToPage(nextP);
      });
    });

    document.querySelectorAll("[data-jump-page]").forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetP = Number(dot.getAttribute("data-jump-page"));
        goToPage(targetP);
      });
    });

    // 2. Page 1: Realistic 3D Blue Envelope -> Animated Paper Sliding Out
    const letterBoxBtn = document.getElementById("letter-box-btn");
    if (letterBoxBtn) {
      letterBoxBtn.addEventListener("click", () => {
        if (state.envelopeOpening || state.letterOpened) return;
        state.envelopeOpening = true;
        music.playChime();
        const envWrapper = document.getElementById("envelope-3d-wrapper");
        if (envWrapper) envWrapper.classList.add("opening");

        setTimeout(() => {
          state.letterOpened = true;
          state.envelopeOpening = false;
          letterBoxBtn.classList.add("hidden");
          const letterWrapper = document.getElementById("letter-wrapper");
          if (letterWrapper) letterWrapper.classList.remove("hidden");
          runTypewriterEffect();
        }, 1450);
      });
    }

    // 3. Page 2: Full-Screen Love Stars Constellation
    document.querySelectorAll(".star-node-btn").forEach((starBtn) => {
      starBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(starBtn.getAttribute("data-star-index"));
        if (idx >= state.starsConnected) {
          advanceConstellationStar();
        }
      });
    });

    const tapNextStarBtn = document.getElementById("btn-tap-next-star");
    if (tapNextStarBtn) {
      tapNextStarBtn.addEventListener("click", () => {
        advanceConstellationStar();
      });
    }

    const resetStarsBtn = document.getElementById("btn-reset-stars");
    if (resetStarsBtn) {
      resetStarsBtn.addEventListener("click", () => {
        if (state.autoTransitionTimer) clearTimeout(state.autoTransitionTimer);
        state.starsConnected = 0;
        state.manualOverviewZoom = false;
        music.playChime();
        updateConstellationInPlace();
      });
    }

    const constellationCard = document.getElementById("constellation-stage-card");
    if (constellationCard) {
      constellationCard.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        if (state.starsConnected >= HEART_STARS.length) {
          goToPage(3);
        }
      });
    }

    // 4. Page 3: Scrapbook Pinboard Memory Path (User Reference Style)
    const openArchivePolaroid = (idx) => {
      if (idx < 0 || idx >= state.archiveOpened.length) return;
      state.archiveOpened[idx] = true;
      music.playChime();
      renderTemplateShell();

      if (state.archiveOpened.every(Boolean)) {
        music.playStarArpeggio();
      }
    };

    document.querySelectorAll("[data-archive-idx]").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = Number(el.getAttribute("data-archive-idx"));
        const isPolaroid = el.getAttribute("data-is-polaroid") === "1";
        if (!state.archiveOpened[idx]) {
          openArchivePolaroid(idx);
        } else if (isPolaroid) {
          const baseItem = SCRAPBOOK_MEMORIES[idx];
          state.lightboxPhoto = {
            ...baseItem,
            image: (CONFIG.polaroids && CONFIG.polaroids[idx]?.image) || baseItem.image,
            caption: (CONFIG.polaroids && CONFIG.polaroids[idx]?.caption) || baseItem.caption,
          };
          renderTemplateShell();
        }
      });
    });

    const openNextArchiveBtn = document.getElementById("btn-open-next-archive");
    if (openNextArchiveBtn) {
      openNextArchiveBtn.addEventListener("click", () => {
        const nextIdx = state.archiveOpened.findIndex((v) => !v);
        if (nextIdx !== -1) {
          openArchivePolaroid(nextIdx);
          setTimeout(() => {
            const rowEl = document.getElementById(`scrapbook-row-${nextIdx}`);
            if (rowEl) rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 80);
        }
      });
    }

    const closeLightbox = () => {
      state.lightboxPhoto = null;
      renderTemplateShell();
    };
    const closeLightboxBtn = document.getElementById("btn-close-lightbox");
    if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
    const lightboxBackdrop = document.getElementById("scrapbook-lightbox-backdrop");
    if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

    // 5. Page 4: Interactive Acrylic Jigsaw Drag-and-Drop & Tap
    initJigsawDragSystem();

    const quickSolveJigsawBtn = document.getElementById("btn-quick-solve-jigsaw");
    if (quickSolveJigsawBtn) {
      quickSolveJigsawBtn.addEventListener("click", () => {
        const stageEl = document.getElementById("jigsaw-table-stage");
        const stageW = stageEl?.clientWidth || (window.innerWidth < 680 ? window.innerWidth - 32 : 640);
        const stageH = stageEl?.clientHeight || 420;
        const { coreSize, pieceSize } = getJigsawMetrics(stageW);

        const photoW = 2 * coreSize;
        const photoH = 3 * coreSize;
        const originX = Math.round((stageW - photoW) / 2 - (pieceSize - coreSize) / 2);
        const originY = Math.round((stageH - photoH) / 2 - (pieceSize - coreSize) / 2);

        state.jigsawPositions = JIGSAW_PIECES_CONFIG.map((p) => ({
          x: originX + p.col * coreSize,
          y: originY + p.row * coreSize,
          rot: 0,
        }));
        state.jigsawGroups = [[0, 1, 2, 3, 4, 5]];
        state.jigsawCompleted = true;

        music.playStarArpeggio();
        renderTemplateShell();
        startCelebrationConfetti();
      });
    }

    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        state.confettiActive = false;
        state.letterOpened = false;
        state.envelopeOpening = false;
        state.starsConnected = 0;
        state.archiveOpened = [false, false, false, false, false, false];
        state.lightboxPhoto = null;
        state.jigsawPositions = null;
        state.jigsawGroups = null;
        state.jigsawCompleted = false;
        goToPage(1);
      });
    }

    // Balloon Click Interactions: Bounce sound + Copy coupon code
    document.querySelectorAll("[data-balloon-idx]").forEach((balloonEl) => {
      balloonEl.addEventListener("click", () => {
        const idx = Number(balloonEl.getAttribute("data-balloon-idx"));
        const b = BIRTHDAY_BALLOONS_CONFIG[idx];
        music.playTone(600 + idx * 75, 0.24, 0.08);

        balloonEl.style.transition = "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.35)";
        balloonEl.style.transform = "scale(1.2) translateY(-12px)";
        setTimeout(() => {
          balloonEl.style.transform = "";
        }, 300);

        if (b && b.isCoupon) {
          try {
            navigator.clipboard?.writeText(b.code || "BLUE-BIRTHDAY");
          } catch (e) {}
          const tagText = balloonEl.querySelector(".balloon-msg-text");
          if (tagText) {
            const original = tagText.innerHTML;
            tagText.innerHTML = `<span style="color:#1d4ed8; font-weight:800;">✓ ຄັດລອກລະຫັດ ${escapeHtml(
              b.code
            )} ແລ້ວ! 🎁</span>`;
            setTimeout(() => {
              tagText.innerHTML = original;
            }, 2600);
          }
        }
      });
    });

    const replyInput = document.getElementById("celebration-reply-input");
    if (replyInput) {
      replyInput.addEventListener("input", (e) => {
        state.replyText = e.target.value;
      });
    }

    const sendReplyBtn = document.getElementById("btn-send-reply");
    if (sendReplyBtn) {
      sendReplyBtn.addEventListener("click", async () => {
        const msg = (state.replyText || "").trim() || "💙 ຮັກຄືກັນເດີ້!";
        try {
          await fetch(`/api/story/${encodeURIComponent(state.slug)}/responses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "letter_reply",
              is_preview: state.isPreview,
              idempotency_key: `reply-${Date.now()}`,
              payload: { message: msg },
            }),
          });
        } catch (e) {}
        state.replySent = true;
        renderTemplateShell();
      });
    }
  }

  let isNavigatingPage = false;
  function goToPage(pageNum) {
    if (state.autoTransitionTimer) {
      clearTimeout(state.autoTransitionTimer);
      state.autoTransitionTimer = null;
    }
    if (isNavigatingPage || state.activePage === pageNum) return;

    const currentSec = document.querySelector(".page-section.active");
    const targetSec = document.getElementById(`page-${pageNum}`);
    if (!targetSec) return;

    isNavigatingPage = true;
    music.playChime();

    if (currentSec) {
      currentSec.classList.add("page-exit-smooth");
    }

    setTimeout(() => {
      state.activePage = pageNum;
      const stageCard = document.getElementById("constellation-stage-card");
      if (stageCard) stageCard.classList.remove("transitioning-out");

      document.querySelectorAll(".page-section").forEach((sec, idx) => {
        sec.classList.remove("active", "page-exit-smooth", "page-enter-smooth");
        if (idx + 1 === pageNum) {
          sec.classList.add("active", "page-enter-smooth");
        }
      });

      if (pageNum === 2) {
        updateConstellationInPlace();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        if (targetSec) targetSec.classList.remove("page-enter-smooth");
        isNavigatingPage = false;
      }, 400);
    }, currentSec ? 240 : 0);
  }

  // ==================== TYPEWRITER EFFECT ON PAGE 1 ====================
  function runTypewriterEffect() {
    if (state.typingTimer) clearTimeout(state.typingTimer);
    const paras = [
      { id: "letter-p1", text: CONFIG.letterParagraph1 },
      { id: "letter-p2", text: CONFIG.letterParagraph2 },
      { id: "letter-p3", text: CONFIG.letterParagraph3 },
      { id: "letter-p4", text: CONFIG.letterParagraph4 },
    ].filter((p) => p.text);

    paras.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) el.textContent = "";
    });

    let pIdx = 0;
    let cIdx = 0;

    function typeNext() {
      if (pIdx >= paras.length) return;
      const cur = paras[pIdx];
      const el = document.getElementById(cur.id);
      if (!el) return;

      if (cIdx < cur.text.length) {
        el.textContent += cur.text.charAt(cIdx);
        cIdx++;
        state.typingTimer = setTimeout(typeNext, 13);
      } else {
        pIdx++;
        cIdx = 0;
        state.typingTimer = setTimeout(typeNext, 120);
      }
    }

    typeNext();
  }

  // ==================== BLUE CELEBRATION CONFETTI ENGINE ====================
  function startCelebrationConfetti() {
    const canvas = document.getElementById("canvas-confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const colors = ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb", "#1d4ed8", "#fbbf24", "#ffffff"];
    const particles = Array.from({ length: 110 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: Math.random() * 11 + 6,
      speedY: Math.random() * 2.8 + 1.8,
      speedX: Math.random() * 1.8 - 0.9,
      sway: Math.random() * 1.2 + 0.4,
      swaySpeed: Math.random() * 0.03 + 0.01,
      swayTime: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: Math.random() * 0.04 - 0.02,
      isHeart: Math.random() > 0.35,
    }));

    state.confettiActive = true;
    let lastTime = performance.now();

    function animate(currentTime) {
      if (!state.confettiActive) return;
      const dt = Math.min((currentTime - lastTime) / 16.67, 2.5) || 1;
      lastTime = currentTime;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.y += p.speedY * dt;
        p.swayTime += p.swaySpeed * dt;
        p.x += (p.speedX + Math.sin(p.swayTime) * p.sway) * dt;
        p.rotation += p.rotSpeed * dt;
        if (p.y > window.innerHeight + 25) {
          p.y = -25;
          p.x = Math.random() * window.innerWidth;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.isHeart) {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 4);
          ctx.bezierCurveTo(p.size / 2, -p.size, p.size * 1.2, -p.size / 3, 0, p.size * 0.8);
          ctx.bezierCurveTo(-p.size * 1.2, -p.size / 3, -p.size / 2, -p.size, 0, -p.size / 4);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // ==================== DIGITAL WISHBOX LIVE PERSONALIZATION STUDIO ====================
  function renderLiveStudioDrawer() {
    const body = document.getElementById("wishbox-studio-body");
    if (!body) return;

    body.innerHTML = `
      <div class="form-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #EFF6FF;">
          <strong>👥 1. ຊື່ຄູ່ຮັກ (Couple Details)</strong>
          <span style="font-size:11px; color:#52719E; font-weight:700;">1 / 3</span>
        </div>
        <div style="display:grid; gap:10px;">
          <div>
            <label class="editor-label">ຊື່ຜູ້ຮັບ (Receiver's Name) *</label>
            <input type="text" id="ed-receiver" class="editor-input" value="${escapeHtml(CONFIG.receiverName)}" />
          </div>
          <div>
            <label class="editor-label">ຊື່ຂອງເຈົ້າ (Your Name) *</label>
            <input type="text" id="ed-sender" class="editor-input" value="${escapeHtml(CONFIG.senderName)}" />
          </div>
        </div>
      </div>

      <div class="form-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #EFF6FF;">
          <strong>💌 2. ຈົດໝາຍຮັກສີຟ້າ (Blue Love Letter)</strong>
          <span style="font-size:11px; color:#52719E; font-weight:700;">2 / 3</span>
        </div>
        <div style="display:grid; gap:10px;">
          <div>
            <label class="editor-label">ຫຍໍ້ໜ້າທີ 1 *</label>
            <textarea id="ed-p1" class="editor-input" rows="2">${escapeHtml(CONFIG.letterParagraph1)}</textarea>
          </div>
          <div>
            <label class="editor-label">ຫຍໍ້ໜ້າທີ 2 *</label>
            <textarea id="ed-p2" class="editor-input" rows="2">${escapeHtml(CONFIG.letterParagraph2)}</textarea>
          </div>
          <div>
            <label class="editor-label">ຫຍໍ້ໜ້າທີ 3 *</label>
            <textarea id="ed-p3" class="editor-input" rows="2">${escapeHtml(CONFIG.letterParagraph3)}</textarea>
          </div>
          <div>
            <label class="editor-label">ຫຍໍ້ໜ້າທີ 4 *</label>
            <textarea id="ed-p4" class="editor-input" rows="2">${escapeHtml(CONFIG.letterParagraph4)}</textarea>
          </div>
        </div>
      </div>

      <div class="form-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #EFF6FF;">
          <strong>📸 3. ຄຳບັນຍາຍຮູບ & ຄູປອງວັນເກີດ</strong>
          <span style="font-size:11px; color:#52719E; font-weight:700;">3 / 3</span>
        </div>
        <div style="display:grid; gap:10px;">
          ${CONFIG.polaroids
            .slice(0, 6)
            .map(
              (p, i) => `
              <div>
                <label class="editor-label">ຄຳບັນຍາຍຮູບທີ ${i + 1}</label>
                <input type="text" class="editor-input ed-pol-cap" data-idx="${i}" value="${escapeHtml(
                p.caption
              )}" />
              </div>
            `
            )
            .join("")}
          <div>
            <label class="editor-label">🎁 ຊື່ຄູປອງຂອງຂວັນວັນເກີດ</label>
            <input type="text" id="ed-coupon" class="editor-input" value="${escapeHtml(CONFIG.couponTitle)}" />
          </div>
        </div>
      </div>

      <button type="button" id="btn-apply-studio" class="btn-green">
        ✓ ບັນທຶກ & ເບິ່ງຜົນລັບທັນທີ
      </button>
    `;

    const syncLiveDom = () => {
      CONFIG.receiverName = document.getElementById("ed-receiver").value || "ຄົນພິເສດ";
      CONFIG.senderName = document.getElementById("ed-sender").value || "Do";
      CONFIG.letterSalutation = `ເຖິງ ${CONFIG.receiverName},`;
      CONFIG.letterParagraph1 = document.getElementById("ed-p1").value;
      CONFIG.letterParagraph2 = document.getElementById("ed-p2").value;
      CONFIG.letterParagraph3 = document.getElementById("ed-p3").value;
      CONFIG.letterParagraph4 = document.getElementById("ed-p4").value;
      CONFIG.couponTitle = document.getElementById("ed-coupon").value;

      body.querySelectorAll(".ed-pol-cap").forEach((inp) => {
        const idx = Number(inp.getAttribute("data-idx"));
        if (CONFIG.polaroids[idx]) {
          CONFIG.polaroids[idx].caption = inp.value;
        }
      });

      try {
        localStorage.setItem("wishbox_blue_v3_config", JSON.stringify(CONFIG));
      } catch (e) {}

      renderTemplateShell();
    };

    body.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("input", syncLiveDom);
    });

    const applyBtn = document.getElementById("btn-apply-studio");
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        syncLiveDom();
        document.getElementById("wishbox-studio-drawer").classList.remove("open");
      });
    }
  }

  // ==================== INITIALIZATION ====================
  async function initApp() {
    initFloatingHeartsCanvas();

    const musicBtn = document.getElementById("music-toggle");
    function applyThemeColors() {
      if (CONFIG.themeColors) {
        const r = document.documentElement;
        if (CONFIG.themeColors.accentRed) r.style.setProperty("--accent-red", CONFIG.themeColors.accentRed);
        if (CONFIG.themeColors.accentPink) r.style.setProperty("--accent-pink", CONFIG.themeColors.accentPink);
        if (CONFIG.themeColors.accentRose) r.style.setProperty("--accent-rose", CONFIG.themeColors.accentRose);
        if (CONFIG.themeColors.textPrimary) r.style.setProperty("--text-primary", CONFIG.themeColors.textPrimary);
        if (CONFIG.themeColors.bgTop && CONFIG.themeColors.bgBottom) {
          document.body.style.background = `linear-gradient(160deg, ${CONFIG.themeColors.bgTop} 0%, ${CONFIG.themeColors.bgBottom} 100%)`;
        }
      }
    }

    try {
      const res = await fetch(`/api/story/${encodeURIComponent(state.slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.story) {
          state.story = data.story;
          if (data.story.recipient_name && !data.story.recipient_name.includes("[")) {
            CONFIG.receiverName = data.story.recipient_name;
            CONFIG.letterSalutation = `ເຖິງ ${CONFIG.receiverName},`;
          }
          if (data.story.sender_name && !data.story.sender_name.includes("[")) {
            CONFIG.senderName = data.story.sender_name;
          }
          if (data.story.gift && data.story.gift.coupon_title) {
            CONFIG.couponTitle = data.story.gift.coupon_title;
          }
          if (data.story.music && data.story.music.bgm_media) {
            music.setupMediaUrl(data.story.music.bgm_media.url);
          }
        }
      }
    } catch (e) {}

    try {
      const saved = localStorage.getItem("wishbox_blue_v3_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(CONFIG, parsed);
      }
    } catch (e) {}

    applyThemeColors();
    renderTemplateShell();
  }

  window.addEventListener("DOMContentLoaded", initApp);
})();
