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

  // 5 Pinboard Archive Polaroid Stops (matches MSR Foto – Bilder und Erinnerungen aus dem Archiv.jpeg)
  const ARCHIVE_LAYOUT = [
    {
      tape: "MOMENT 01",
      left: "4%",
      top: "3%",
      rotate: "-4deg",
      pinX: 11,
      pinY: 5,
      centerPinX: 47,
      centerPinY: 5,
      message: "ຈື່ມື້ທີ່ເຮົາແນມຫາກັນແລ້ວຍິ້ມໃຫ້ກັນແບບນີ້ໄດ້ບໍ່? ຮອຍຍິ້ມເຈົ້າໜ້າຮັກທີ່ສຸດເລີຍ 💙",
    },
    {
      tape: "SWEET LIGHT",
      left: "70%",
      top: "3%",
      rotate: "3.5deg",
      pinX: 77,
      pinY: 5,
      message: "ທຸກຄັ້ງທີ່ໄດ້ຈັບມືເຈົ້າ ມັນຄືຊ່ວງເວລາທີ່ອົບອຸ່ນໃຈທີ່ສຸດໃນໂລກເລີຍ ✨",
    },
    {
      tape: "OUR WALK",
      left: "4%",
      top: "51%",
      rotate: "3deg",
      pinX: 11,
      pinY: 53,
      message: "ມື້ທີ່ເຮົາໄປຍ່າງຫຼິ້ນສວນໄຜ່ກັບກວາງນ້ອຍນຳກັນ ມ່ວນ ແລະ ມີຄວາມສຸກຫຼາຍ 🦌💙",
    },
    {
      tape: "DATE NIGHT",
      left: "37%",
      top: "51%",
      rotate: "-2.5deg",
      pinX: 47,
      pinY: 53,
      message: "ໄປເບິ່ງໜັງຄູ່ກັນ ນັ່ງຂ້າງໆກັນ ຢາກຢຸດເວລາໄວ້ແບບນີ້ດົນໆເລີຍ 🎬💎",
    },
    {
      tape: "FOREVER US",
      left: "70%",
      top: "51%",
      rotate: "-3deg",
      pinX: 77,
      pinY: 53,
      message: "ຂອບໃຈທີ່ເຂົ້າມາເປັນຄວາມຊົງຈຳທີ່ດີທີ່ສຸດໃນທຸກໆມື້ຂອງຂ້ອຍເດີ້ 🌙💙",
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
    archiveOpened: [false, false, false, false, false], // 5 polaroids on Page 3
    jigsawPlaced: [false, false, false, false, false, false], // 6 pieces on Page 4
    selectedJigsawPiece: null, // For tap-to-place fallback
    collageZoomedOut: false,
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
  function getConstellationCameraTransform() {
    return "translate3d(0%, 0%, 0) scale(1)";
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

  // ==================== ARCHIVE PINBOARD MEMORY PATH (MSR FOTO STYLE) ====================
  function renderArchivePinboard() {
    const openedCount = state.archiveOpened.filter(Boolean).length;
    const nextIdx = state.archiveOpened.findIndex((v) => !v);

    const s0 = ARCHIVE_LAYOUT[0];
    const s1 = ARCHIVE_LAYOUT[1];
    const s2 = ARCHIVE_LAYOUT[2];
    const s3 = ARCHIVE_LAYOUT[3];
    const s4 = ARCHIVE_LAYOUT[4];

    const fullPathPoints = [
      `${s0.pinX},${s0.pinY}`,
      `${s0.centerPinX},${s0.centerPinY}`,
      `${s1.pinX},${s1.pinY}`,
      `${s2.pinX},${s2.pinY}`,
      `${s3.pinX},${s3.pinY}`,
      `${s4.pinX},${s4.pinY}`,
    ];

    const activePoints = [`${s0.pinX},${s0.pinY}`];
    if (openedCount >= 1) {
      activePoints.push(`${s0.centerPinX},${s0.centerPinY}`);
    }
    if (openedCount >= 2) {
      activePoints.push(`${s1.pinX},${s1.pinY}`);
    }
    if (openedCount >= 3) {
      activePoints.push(`${s2.pinX},${s2.pinY}`);
    }
    if (openedCount >= 4) {
      activePoints.push(`${s3.pinX},${s3.pinY}`);
    }
    if (openedCount >= 5) {
      activePoints.push(`${s4.pinX},${s4.pinY}`);
    }

    return `
      <div class="archive-board-container" id="archive-board-container">
        <svg class="archive-string-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline class="archive-string-bg" points="${fullPathPoints.join(" ")}" />
          ${
            activePoints.length > 1
              ? `<polyline class="archive-string-active" points="${activePoints.join(" ")}" />`
              : ""
          }
          <circle cx="${s0.centerPinX}" cy="${s0.centerPinY}" r="1.1" fill="#1d4ed8" />
        </svg>

        <div class="archive-center-note">
          <div class="archive-center-title">OUR<br/>ARCHIVE 💙</div>
          <div class="archive-center-sub">ບັນທຶກຮູບພາບ & ຄວາມຊົງຈຳ (${openedCount}/5)</div>
          <div style="margin-top:8px; font-size:1.3rem;">📷 🎞️ ✨</div>
        </div>

        ${ARCHIVE_LAYOUT.map((lay, idx) => {
          const pol = CONFIG.polaroids[idx] || CONFIG.polaroids[0];
          const isRevealed = state.archiveOpened[idx];
          const isNext = idx === nextIdx;

          return `
            <div
              class="archive-polaroid-item ${isRevealed ? "revealed" : ""} ${
            isNext ? "next-target" : ""
          }"
              data-archive-idx="${idx}"
              style="left:${lay.left}; top:${lay.top}; transform:rotate(${lay.rotate});"
            >
              <div class="archive-washi-tape">${escapeHtml(lay.tape)}</div>
              <div class="archive-pushpin"></div>

              <div class="archive-polaroid-window">
                <div class="archive-message-cover">
                  <div class="archive-message-text">“${escapeHtml(lay.message)}”</div>
                  <div class="archive-tap-badge">
                    ${isNext ? "👆 ກົດເພື່ອເປີດເບິ່ງຮູບ" : "📸 ແຕະເພື່ອເປີດຮູບ"}
                  </div>
                </div>
                <img
                  class="archive-photo-img"
                  src="${escapeHtml(resolveMediaUrl(pol.image))}"
                  alt="Memory ${idx + 1}"
                  onerror="this.src='${DEFAULT_PLACEHOLDER_IMG}'"
                />
              </div>

              <div class="archive-polaroid-footer">
                <span class="archive-check-icon">${isRevealed ? "✓" : idx + 1}</span>
                <span>${
                  isRevealed ? escapeHtml(pol.caption) : "ຄວາມຊົງຈຳທີ " + (idx + 1)
                }</span>
              </div>
            </div>
          `;
        }).join("")}
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

          <!-- Corner Piece Number Badge shown only while in tray -->
          ${
            !state.jigsawPlaced[pieceIdx]
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

  // ==================== PAGE 4: INTERACTIVE PHOTO JIGSAW WORKSHOP & FINALE ====================
  function renderJigsawAndCollageFinale() {
    const placedCount = state.jigsawPlaced.filter(Boolean).length;
    const allPlaced = placedCount >= 6;
    const sidePhotos = CONFIG.polaroids.slice(0, 8);
    const photoUrl = resolveMediaUrl(
      CONFIG.jigsawImage || CONFIG.pinImage || "./media/med-do-fan-01.jpeg"
    );

    return `
      <div class="jigsaw-workshop-stage">
        <!-- Header -->
        <div style="text-align:center;">
          <h2 class="hero-title" style="font-size:clamp(1.75rem, 4.2vw, 2.5rem);">
            ${
              state.collageZoomedOut
                ? `<span>Happy Birthday </span><span class="hero-title-highlight" style="font-size:clamp(2.4rem, 5.5vw, 3.5rem);">My Love! 💙🎂</span>`
                : `<span>ຕໍ່ຮູບຄູ່ແຫ່ງຄວາມຊົງຈຳ </span><span class="hero-title-highlight" style="font-size:clamp(2.1rem, 4.8vw, 2.9rem);">You & Me 💙</span>`
            }
          </h2>
        </div>

        ${
          !state.collageZoomedOut
            ? `
            <div class="jigsaw-instruction-pill">
              <span>🧩</span>
              <span>
                ${
                  allPlaced
                    ? "✨ ຕໍ່ຮູບຄູ່ຄົບທັງ 6 ຊິ້ນສຳເລັດແລ້ວ! 💙"
                    : `ຈັບຊິ້ນສ່ວນຮູບພາບມາຕໍ່ໃສ່ກອບໃຫ້ຄົບ 6 ຊິ້ນ (${placedCount} / 6)`
                }
              </span>
            </div>
            ${
              !allPlaced
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
          `
            : ""
        }

        <!-- Zooming Collage Viewport: starts focused on the Photo Jigsaw Frame, then zooms out into full photo collage! -->
        <div class="collage-zoom-viewport">
          <div
            class="collage-camera-plane ${
              state.collageZoomedOut ? "zoomed-out-collage" : "zoomed-on-jigsaw"
            }"
            id="collage-camera-plane"
          >
            <!-- 4 Surrounding Polaroids in Zoomed-Out State -->
            ${sidePhotos
              .slice(0, 4)
              .map(
                (p) => `
                <div class="collage-side-polaroid">
                  <img src="${escapeHtml(resolveMediaUrl(p.image))}" alt="Memory" onerror="this.src='${DEFAULT_PLACEHOLDER_IMG}'" />
                  <div class="collage-side-caption">${escapeHtml(p.caption)}</div>
                </div>
              `
              )
              .join("")}

            <!-- Center Interactive Photo Jigsaw Arena (Romantic Framed Board) -->
            <div class="jigsaw-interactive-arena ${allPlaced ? "is-completed" : ""}" id="jigsaw-interactive-arena">
              <!-- 2x3 Target Photo Frame (240px x 360px portrait) -->
              <div class="jigsaw-target-board ${allPlaced ? "puzzle-completed" : ""}" id="jigsaw-target-board">
                <!-- Faint Watermark of the Photo to Guide Assembly -->
                <div
                  class="jigsaw-board-watermark"
                  style="background-image: url('${escapeHtml(photoUrl)}');"
                ></div>

                <!-- 6 Target Slot Guides on the Board (2 cols x 3 rows, 120px each) -->
                ${JIGSAW_PIECES_CONFIG.map((p) => {
                  const leftPx = p.col * 120;
                  const topPx = p.row * 120;
                  const isPlaced = state.jigsawPlaced[p.id];

                  return `
                    <div
                      class="jigsaw-slot-guide"
                      id="jigsaw-slot-${p.id}"
                      data-target-slot="${p.id}"
                      style="left:${leftPx}px; top:${topPx}px;"
                    >
                      ${
                        !isPlaced
                          ? `<span class="slot-number-badge">${p.id + 1}</span>
                             <span class="slot-hint-text">${escapeHtml(p.hint)}</span>`
                          : ""
                      }
                    </div>
                  `;
                }).join("")}

                <!-- Already Placed Pieces Rendered Directly Inside the Board Slots -->
                ${JIGSAW_PIECES_CONFIG.map((p) => {
                  if (!state.jigsawPlaced[p.id]) return "";
                  const leftPx = p.col * 120 - 24;
                  const topPx = p.row * 120 - 24;

                  return `
                    <div
                      class="jigsaw-piece-element is-placed"
                      id="placed-piece-${p.id}"
                      style="left:${leftPx}px; top:${topPx}px;"
                    >
                      ${renderPhotoJigsawPieceSvg(p.id)}
                    </div>
                  `;
                }).join("")}

                <!-- Bottom Plaque revealed upon completion -->
                ${
                  allPlaced
                    ? `
                  <div class="jigsaw-frame-plaque">
                    <span>✨ DO &amp; FAN 💙 YOU &amp; ME FOREVER ✨</span>
                  </div>
                `
                    : ""
                }
              </div>

              <!-- Unplaced Pieces Scattered Zone (Free organic layout, no rigid boxes!) -->
              ${
                !allPlaced
                  ? `
                  <div class="jigsaw-scatter-zone" id="jigsaw-scatter-zone">
                    <div class="jigsaw-scatter-hint">
                      👇 ຄລິກເມົ້າຄ້າງ (Hold) ທີ່ຊິ້ນສ່ວນແລ້ວລາກມາປະກອບໃສ່ກອບ
                    </div>
                    <div class="jigsaw-scatter-board">
                      ${JIGSAW_PIECES_CONFIG.map((p, idx) => {
                        if (state.jigsawPlaced[p.id]) return "";
                        const isSelected = state.selectedJigsawPiece === p.id;

                        return `
                          <div
                            class="jigsaw-scatter-piece-wrapper piece-scatter-${idx}"
                            id="scatter-slot-${p.id}"
                          >
                            <div
                              class="jigsaw-piece-element is-scattered ${isSelected ? "is-selected" : ""}"
                              data-draggable-piece="${p.id}"
                              id="draggable-piece-${p.id}"
                              title="ຊິ້ນສ່ວນທີ ${p.id + 1} (${escapeHtml(p.hint)})"
                            >
                              ${renderPhotoJigsawPieceSvg(p.id)}
                            </div>
                          </div>
                        `;
                      }).join("")}
                    </div>
                  </div>
                `
                  : ""
              }
            </div>

            <!-- Remaining Surrounding Polaroids in Zoomed-Out State -->
            ${sidePhotos
              .slice(4, 8)
              .map(
                (p) => `
                <div class="collage-side-polaroid">
                  <img src="${escapeHtml(resolveMediaUrl(p.image))}" alt="Memory" onerror="this.src='${DEFAULT_PLACEHOLDER_IMG}'" />
                  <div class="collage-side-caption">${escapeHtml(p.caption)}</div>
                </div>
              `
              )
              .join("")}
          </div>
        </div>

        <!-- Grand Happy Birthday Reveal Banner (Shown after Jigsaw Completes & Zooms Out!) -->
        ${
          state.collageZoomedOut
            ? `
            <div class="grand-birthday-reveal" id="grand-birthday-reveal">
              <h3 class="grand-birthday-title">${escapeHtml(CONFIG.celebrationTitle)}</h3>
              <p class="grand-birthday-sub">${escapeHtml(CONFIG.celebrationMessage)}</p>

              <div class="love-coupon">
                <div class="coupon-tag">🎁 SPECIAL BIRTHDAY GIFT COUPON</div>
                <div class="coupon-title">${escapeHtml(CONFIG.couponTitle)}</div>
                <div class="coupon-code">${escapeHtml(CONFIG.couponCode)}</div>
              </div>

              <div style="width:100%; margin: 10px 0;">
                ${
                  state.replySent
                    ? `<div style="color:#1d4ed8; font-weight:700; font-size:0.98rem;">✓ ສົ່ງຫົວໃຈສີຟ້າ ແລະ ຄຳຕອບກັບໄປຫາ ${escapeHtml(
                        CONFIG.senderName
                      )} ແລ້ວ 💙</div>`
                    : `
                    <div style="display:flex; gap:8px; width:100%;">
                      <input
                        type="text"
                        id="celebration-reply-input"
                        class="editor-input"
                        placeholder="ພິມຂໍ້ຄວາມສົ່ງກັບຫາ ${escapeHtml(CONFIG.senderName)}..."
                        value="${escapeHtml(state.replyText)}"
                      />
                      <button type="button" id="btn-send-reply" class="next-page-btn" style="margin-top:0; padding:10px 22px; font-size:0.94rem; white-space:nowrap;">
                        ສົ່ງ 💙
                      </button>
                    </div>
                  `
                }
              </div>

              <button type="button" id="restart-btn" class="next-page-btn" style="margin-top:8px;">
                ↺ ຫຼິ້ນເລີ່ມຕົ້ນໃໝ່ແຕ່ໜ້າທຳອິດ
              </button>
            </div>
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
        : HEART_STARS[Math.min(state.starsConnected - 1, HEART_STARS.length - 1)].whisper;

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
              style="transform: ${getConstellationCameraTransform()};"
            >

              <div class="constellation-heart-arena">
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

        <!-- PAGE 3: ARCHIVE PINBOARD MEMORY PHOTO PATH (MSR FOTO STYLE) -->
        <section class="page-section ${state.activePage === 3 ? "active" : ""}" id="page-3">
          <div class="page-content">
            <div style="flex-shrink:0;">
              ${renderPageDots(3)}
              <h2 class="hero-title" style="font-size:clamp(1.22rem, 2.3vw, 1.58rem); margin:0; line-height:1.2;">
                <span>ເສັ້ນທາງບັນທຶກ </span>
                <span class="hero-title-highlight" style="font-size:clamp(1.3rem, 2.5vw, 1.75rem);">ຮູບພາບຄວາມຊົງຈຳຂອງເຮົາ 📌💙</span>
              </h2>
              <p style="color:var(--text-secondary); font-size:clamp(0.75rem, 1.3vw, 0.84rem); margin:2px 0 0;">
                ແຕະທີ່ຂໍ້ຄວາມໃນກອບ Polaroid ແຕ່ລະອັນ ເພື່ອເປີດເບິ່ງຮູບຄວາມຊົງຈຳ (${archiveOpenedCount} / 5)
              </p>
            </div>

            ${renderArchivePinboard()}

            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:2px; flex-shrink:0;">
              ${
                archiveOpenedCount < 5
                  ? `
                  <button
                    type="button"
                    class="next-page-btn"
                    id="btn-open-next-archive"
                    style="margin-top:0; padding:7px 16px; font-size:0.84rem; background:#ffffff; color:var(--accent-red); border:1.5px solid var(--accent-pink);"
                  >
                    📸 ເປີດຮູບຄວາມຊົງຈຳອັນຕໍ່ໄປ (${archiveOpenedCount + 1}/5)
                  </button>
                `
                  : ""
              }
              <button type="button" class="next-page-btn" data-target-page="4" style="margin-top:0; padding:7px 18px; font-size:0.84rem;">
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

    if (camera) {
      camera.style.transform = getConstellationCameraTransform();
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
          : HEART_STARS[Math.min(state.starsConnected - 1, HEART_STARS.length - 1)].whisper;
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

  // ==================== SNAP JIGSAW PIECE INTO PLACE ====================
  function snapJigsawPiece(pieceId) {
    if (state.jigsawPlaced[pieceId]) return;
    state.jigsawPlaced[pieceId] = true;
    state.selectedJigsawPiece = null;
    music.playTone(660, 0.25, 0.1);
    renderTemplateShell();

    // If all 6 pieces are placed, celebrate and zoom out to full collage & Happy Birthday!
    if (state.jigsawPlaced.every(Boolean)) {
      music.playStarArpeggio();
      setTimeout(() => {
        state.collageZoomedOut = true;
        renderTemplateShell();
        startCelebrationConfetti();
      }, 1200);
    }
  }

  // ==================== INTERACTIVE DRAG-AND-DROP FOR JIGSAW PIECES ====================
  function initJigsawDragSystem() {
    const pieces = document.querySelectorAll("[data-draggable-piece]");
    const targetBoard = document.getElementById("jigsaw-target-board");
    if (!targetBoard || pieces.length === 0) return;

    pieces.forEach((el) => {
      const pieceId = Number(el.getAttribute("data-draggable-piece"));

      // Stop native browser image dragging on all elements
      el.addEventListener("dragstart", (e) => e.preventDefault());

      const onPointerDown = (e) => {
        if (state.jigsawPlaced[pieceId]) return;
        if (e.button !== undefined && e.button !== 0) return; // Only primary mouse button

        e.preventDefault(); // Stop native drag/selection immediately!

        const startX = e.clientX;
        const startY = e.clientY;
        let isDragging = false;
        let hasMovedPastThreshold = false;

        const onPointerMove = (moveEvt) => {
          moveEvt.preventDefault();
          const dx = moveEvt.clientX - startX;
          const dy = moveEvt.clientY - startY;

          if (!isDragging) {
            if (Math.hypot(dx, dy) > 4) {
              isDragging = true;
              hasMovedPastThreshold = true;
              el.classList.add("is-dragging");
              el.style.zIndex = "999999";
              el.style.transition = "none";
              document.body.style.cursor = "grabbing";
              document.body.style.userSelect = "none";
            } else {
              return;
            }
          }

          // Move piece with GPU acceleration (1:1 with cursor, scale up for grab feel)
          el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.18) rotate(0deg)`;

          // Proximity detection to matching slot on target board
          const slotEl = document.getElementById(`jigsaw-slot-${pieceId}`);
          if (slotEl) {
            const pRect = el.getBoundingClientRect();
            const sRect = slotEl.getBoundingClientRect();
            const pCenter = { x: pRect.left + pRect.width / 2, y: pRect.top + pRect.height / 2 };
            const sCenter = { x: sRect.left + sRect.width / 2, y: sRect.top + sRect.height / 2 };
            const dist = Math.hypot(pCenter.x - sCenter.x, pCenter.y - sCenter.y);
            slotEl.classList.toggle("slot-highlight", dist < 85);
          }
        };

        const onPointerUp = (upEvt) => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);

          document.body.style.cursor = "";
          document.body.style.userSelect = "";

          if (!isDragging) {
            // It was a pure click/tap
            if (!hasMovedPastThreshold) {
              if (state.selectedJigsawPiece === pieceId) {
                snapJigsawPiece(pieceId);
              } else {
                state.selectedJigsawPiece = pieceId;
                music.playChime();
                renderTemplateShell();
              }
            }
            return;
          }

          isDragging = false;
          const dx = upEvt.clientX - startX;
          const dy = upEvt.clientY - startY;

          const slotEl = document.getElementById(`jigsaw-slot-${pieceId}`);
          let snapped = false;

          if (slotEl) {
            slotEl.classList.remove("slot-highlight");
            const pRect = el.getBoundingClientRect();
            const sRect = slotEl.getBoundingClientRect();
            const pCenter = { x: pRect.left + pRect.width / 2, y: pRect.top + pRect.height / 2 };
            const sCenter = { x: sRect.left + sRect.width / 2, y: sRect.top + sRect.height / 2 };
            const dist = Math.hypot(pCenter.x - sCenter.x, pCenter.y - sCenter.y);

            if (dist < 85) {
              snapped = true;
              // Magnetic spring animation straight to the slot target
              const targetDx = dx + (sCenter.x - pCenter.x);
              const targetDy = dy + (sCenter.y - pCenter.y);

              el.style.transition = "transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.25)";
              el.style.transform = `translate3d(${targetDx}px, ${targetDy}px, 0) scale(1) rotate(0deg)`;

              setTimeout(() => {
                el.classList.remove("is-dragging");
                el.style.zIndex = "";
                snapJigsawPiece(pieceId);
              }, 180);
            }
          }

          if (!snapped) {
            // Spring smoothly back to scattered resting position
            el.style.transition = "transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1)";
            el.style.transform = "";
            setTimeout(() => {
              el.classList.remove("is-dragging");
              el.style.zIndex = "";
              renderTemplateShell();
            }, 240);
          }
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      };

      el.addEventListener("pointerdown", onPointerDown);
    });

    // Tap target slot to place selected piece
    document.querySelectorAll("[data-target-slot]").forEach((slotEl) => {
      slotEl.addEventListener("click", () => {
        const slotId = Number(slotEl.getAttribute("data-target-slot"));
        if (state.selectedJigsawPiece === slotId) {
          snapJigsawPiece(slotId);
        } else if (state.selectedJigsawPiece !== null) {
          snapJigsawPiece(state.selectedJigsawPiece);
        }
      });
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

    // 4. Page 3: Archive Pinboard Memory Path (MSR Foto Style)
    const openArchivePolaroid = (idx) => {
      if (idx < 0 || idx >= state.archiveOpened.length) return;
      state.archiveOpened[idx] = true;
      music.playChime();
      renderTemplateShell();

      if (state.archiveOpened.every(Boolean)) {
        music.playStarArpeggio();
        if (state.autoTransitionTimer) clearTimeout(state.autoTransitionTimer);
        state.autoTransitionTimer = setTimeout(() => {
          if (state.activePage === 3) {
            goToPage(4);
          }
        }, 2000);
      }
    };

    document.querySelectorAll("[data-archive-idx]").forEach((polEl) => {
      polEl.addEventListener("click", () => {
        const idx = Number(polEl.getAttribute("data-archive-idx"));
        if (!state.archiveOpened[idx]) {
          openArchivePolaroid(idx);
        }
      });
    });

    const openNextArchiveBtn = document.getElementById("btn-open-next-archive");
    if (openNextArchiveBtn) {
      openNextArchiveBtn.addEventListener("click", () => {
        const nextIdx = state.archiveOpened.findIndex((v) => !v);
        if (nextIdx !== -1) openArchivePolaroid(nextIdx);
      });
    }

    // 5. Page 4: Interactive Acrylic Jigsaw Drag-and-Drop & Tap
    initJigsawDragSystem();

    const quickSolveJigsawBtn = document.getElementById("btn-quick-solve-jigsaw");
    if (quickSolveJigsawBtn) {
      quickSolveJigsawBtn.addEventListener("click", () => {
        state.jigsawPlaced = [true, true, true, true, true, true];
        state.selectedJigsawPiece = null;
        music.playStarArpeggio();
        renderTemplateShell();
        setTimeout(() => {
          state.collageZoomedOut = true;
          renderTemplateShell();
          startCelebrationConfetti();
        }, 900);
      });
    }

    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        state.confettiActive = false;
        state.letterOpened = false;
        state.envelopeOpening = false;
        state.starsConnected = 0;
        state.archiveOpened = [false, false, false, false, false];
        state.jigsawPlaced = [false, false, false, false, false, false];
        state.selectedJigsawPiece = null;
        state.collageZoomedOut = false;
        goToPage(1);
      });
    }

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
    if (musicBtn) {
      musicBtn.addEventListener("click", () => music.toggle());
    }

    const openStudioBtn = document.getElementById("btn-open-studio");
    const closeStudioBtn = document.getElementById("btn-close-studio");
    const studioDrawer = document.getElementById("wishbox-studio-drawer");

    if (openStudioBtn && studioDrawer) {
      openStudioBtn.addEventListener("click", () => {
        renderLiveStudioDrawer();
        studioDrawer.classList.add("open");
      });
    }
    if (closeStudioBtn && studioDrawer) {
      closeStudioBtn.addEventListener("click", () => {
        studioDrawer.classList.remove("open");
      });
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

    renderTemplateShell();
  }

  window.addEventListener("DOMContentLoaded", initApp);
})();
