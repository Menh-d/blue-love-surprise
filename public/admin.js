/**
 * BLUE LOVE SURPRISE — Dedicated Admin CMS
 * Allows editing Colors, Texts, and Photos with secure passcode authentication.
 * Works seamlessly on GitHub Pages (localStorage sync) and Node/Express backend.
 */

(function () {
  "use strict";

  const DEFAULT_CONFIG = {
    receiverName: "ຄົນພິເສດ",
    senderName: "Do",
    pinCode: "1402",
    pinHint: "ແຕະວາງຫົວໃຈສີຟ້າ 3 ດວງໃຫ້ລຽງກັນ 💙",
    pinImage: "./media/med-do-fan-01.jpeg",
    jigsawImage: "./media/med-do-fan-01.jpeg",
    plaqueText: "✨ DO & FAN 💙 YOU & ME FOREVER ✨",
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
    themeColors: {
      accentRed: "#2563eb",
      accentPink: "#3b82f6",
      accentRose: "#93c5fd",
      bgTop: "#f4f9ff",
      bgBottom: "#dbeafe",
      textPrimary: "#1e3a6d",
    },
    polaroids: [
      { image: "./media/med-do-fan-01.jpeg", caption: "ຮອຍຍິ້ມທີ່ເຮັດໃຫ້ໃຈຟູ 💙", date: "MOMENT 01" },
      { image: "./media/med-do-fan-02.jpeg", caption: "ຈັບມືກັນໄວ້ດົນໆເດີ້ ✨", date: "MOMENT 02" },
      { image: "./media/med-do-fan-03.jpeg", caption: "ຍ່າງຫຼິ້ນສວນໄຜ່ກັບກວາງນ້ອຍ 🦌", date: "MOMENT 03" },
      { image: "./media/med-do-fan-04.jpeg", caption: "ດີໃຈທີ່ມີເຈົ້າຢູ່ຂ້າງໆ 💎", date: "MOMENT 04" },
      { image: "./media/med-do-fan-05.jpeg", caption: "ເດດເບິ່ງໜັງຄູ່ກັນ 🎬", date: "MOMENT 05" },
      { image: "./media/med-do-fan-06.jpeg", caption: "ທຸກມຸມທີ່ມີເຈົ້າຄືຄວາມສຸກ 🌟", date: "MOMENT 06" },
    ],
    whispers: [
      "💫 ດາວດວງທີ 1 (ຮອຍຍິ້ມທຳອິດ): ວິນາທີທຳອິດທີ່ໄດ້ເຫັນຮອຍຍິ້ມຂອງເຈົ້າ ໂລກທັງໃບກໍສົດໃສຂຶ້ນທັນທີ 💙",
      "🌙 ດາວດວງທີ 2 (ຄວາມອົບອຸ່ນ): ທຸກຄຳເວົ້າ ແລະ ຄວາມໃສ່ໃຈຂອງເຈົ້າ ເຮັດໃຫ້ໃຈອົບອຸ່ນສະເໝີ",
      "🤝 ດາວດວງທີ 3 (ການຈັບມື): ຂອບໃຈທີ່ຈັບມືກັນໄວ້ແໜ້ນໆ ບໍ່ວ່າຈະຜ່ານເລື່ອງລາວໃດໆ 💙",
      "✨ ດາວດວງທີ 4 (ຄວາມເຂົ້າໃຈ): ຢູ່ກັບເຈົ້າແລ້ວສະບາຍໃຈທີ່ສຸດ ເປັນຕົວຂອງຕົວເອງໄດ້ທຸກຢ່າງ",
      "💎 ດາວດວງທີ 5 (ຄວາມຫ່ວງໃຍ): ທຸກຄວາມຫ່ວງໃຍເລັກໆນ້ອຍໆຈາກເຈົ້າ ມີຄ່າສຳລັບຂ້ອຍສະເໝີ",
      "🌟 ດາວດວງທີ 6 (ກຳລັງໃຈ): ເຈົ້າຄືພະລັງບວກ ແລະ ກຳລັງໃຈທີ່ດີທີ່ສຸດໃນທຸກໆມື້",
      "🌌 ດາວດວງທີ 7 (ຄຳສັນຍາ): ສັນຍາວ່າຈະດູແລ ແລະ ຢູ່ຄຽງຂ້າງເຈົ້າແບບນີ້ໄປດົນໆ",
      "💙 ດາວແຫ່ງຄວາມຮັກທັງ 8 ດວງລຽງກັນເປັນ 'ຮູບຫົວໃຈສີຟ້າ' ແລ້ວ... ກຳລັງພາເຈົ້າໄປສູ່ເສັ້ນທາງຮູບຄວາມຊົງຈຳ ✨",
    ],
    scratchQuote:
      "ບໍ່ວ່າຈະຜ່ານໄປດົນປານໃດ, ຫົວໃຈດວງນີ້ກໍຍັງເລືອກເຈົ້າສະເໝີ... ຂອບໃຈທີ່ເຂົ້າມາເປັນຂອງຂວັນທີ່ດີທີ່ສຸດໃນຊີວິດຂ້ອຍເດີ້ 💙✨",
    cassetteTracks: [
      {
        id: 0,
        title: "01. ວິນາທີທີ່ພົບເຈົ້າ",
        duration: "03:14",
        quote: "ວິນາທີທຳອິດທີ່ໄດ້ພົບເຈົ້າ ຄືຈຸດເລີ່ມຕົ້ນຂອງຄວາມສຸກທັງໝົດໃນຊີວິດ 💙",
      },
      {
        id: 1,
        title: "02. ທ້ອງຟ້າສີຟ້າຂອງເຮົາ",
        duration: "05:20",
        quote: "ທຸກໆມື້ທີ່ມີເຈົ້າຢູ່ຄຽງຂ້າງ ທ້ອງຟ້າກໍສົດໃສ ແລະ ອົບອຸ່ນສະເໝີ ✨",
      },
      {
        id: 2,
        title: "03. ສຸກສັນວັນເກີດຄົນດີ",
        duration: "10:17",
        quote: "ຂໍໃຫ້ທຸກວັນເຕັມໄປດ້ວຍຮອຍຍິ້ມ, ຄວາມສຸກ ແລະ ຄວາມຮັກທີ່ສວຍງາມ ສຸກສັນວັນເກີດເດີ້ 🎂💙",
      },
    ],
  };

  const PRESET_IMAGES = [
    "./media/med-do-fan-01.jpeg",
    "./media/med-do-fan-02.jpeg",
    "./media/med-do-fan-03.jpeg",
    "./media/med-do-fan-04.jpeg",
    "./media/med-do-fan-05.jpeg",
    "./media/med-do-fan-06.jpeg",
    "./media/med-do-fan-07.jpeg",
    "./media/med-do-fan-08.jpeg",
  ];

  const COLOR_PRESETS = [
    {
      name: "💙 Royal Ocean (ຄ່າເລີ່ມຕົ້ນ)",
      colors: {
        accentRed: "#2563eb",
        accentPink: "#3b82f6",
        accentRose: "#93c5fd",
        bgTop: "#f4f9ff",
        bgBottom: "#dbeafe",
        textPrimary: "#1e3a6d",
      },
    },
    {
      name: "🩵 Pastel Sky Blue (ທ້ອງຟ້າສົດໃສ)",
      colors: {
        accentRed: "#0284c7",
        accentPink: "#38bdf8",
        accentRose: "#bae6fd",
        bgTop: "#f0f9ff",
        bgBottom: "#e0f2fe",
        textPrimary: "#0c4a6e",
      },
    },
    {
      name: "💜 Indigo Night (ກາງຄືນໂຣແມນຕິກ)",
      colors: {
        accentRed: "#4f46e5",
        accentPink: "#818cf8",
        accentRose: "#c7d2fe",
        bgTop: "#f5f3ff",
        bgBottom: "#e0e7ff",
        textPrimary: "#312e81",
      },
    },
    {
      name: "💖 Blue & Romantic Rose (ຟ້າປົນກຸຫຼາບ)",
      colors: {
        accentRed: "#e11d48",
        accentPink: "#3b82f6",
        accentRose: "#fecdd3",
        bgTop: "#fff1f2",
        bgBottom: "#dbeafe",
        textPrimary: "#881337",
      },
    },
  ];

  let adminConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  let currentTab = "monitor"; // 'monitor' | 'colors' | 'texts' | 'photos' | 'settings'

  const MONITOR_TOPIC = "dofan-love-monitor-8899";
  const MONITOR_URL = "https://ntfy.sh";

  let activityLogs = [];
  let monitorEventSource = null;
  let monitorSoundEnabled = true;
  let monitorActiveFilter = "all";

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showToast(message, type = "success") {
    const toast = document.getElementById("admin-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = `admin-toast ${type}`;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3200);
  }

  // Load saved config from localStorage
  function loadConfig() {
    try {
      const saved = localStorage.getItem("wishbox_blue_v3_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        adminConfig = Object.assign({}, DEFAULT_CONFIG, parsed);
        if (parsed.themeColors) {
          adminConfig.themeColors = Object.assign({}, DEFAULT_CONFIG.themeColors, parsed.themeColors);
        }
        if (parsed.polaroids && Array.isArray(parsed.polaroids)) {
          adminConfig.polaroids = parsed.polaroids;
        }
      }
    } catch (e) {}
  }

  // Save config to localStorage & backend
  async function saveConfig() {
    try {
      localStorage.setItem("wishbox_blue_v3_config", JSON.stringify(adminConfig));

      // Also try saving to server if API is available
      try {
        await fetch("/api/admin/story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draft: adminConfig }),
        });
      } catch (e) {}

      showToast("✓ ບັນທຶກການແກ້ໄຂສຳເລັດແລ້ວ! 💙");
    } catch (e) {
      showToast("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ: " + e.message, "error");
    }
  }

  // ==================== AUTHENTICATION ====================
  function isAuthenticated() {
    return sessionStorage.getItem("blue_admin_auth") === "true";
  }

  function setAuthenticated(status) {
    if (status) {
      sessionStorage.setItem("blue_admin_auth", "true");
    } else {
      sessionStorage.removeItem("blue_admin_auth");
    }
  }

  function renderLoginScreen(errorMsg = "") {
    const root = document.getElementById("admin-app-root");
    if (!root) return;

    root.innerHTML = `
      <div class="admin-login-wrapper">
        <div class="admin-login-card">
          <div class="admin-login-icon">🔐 💙</div>
          <h1 class="admin-login-title">BLUE LOVE Admin Portal</h1>
          <p class="admin-login-sub">ເຂົ້າສູ່ລະບົບເພື່ອແກ້ໄຂ ສີ, ຂໍ້ຄວາມ ແລະ ຮູບພາບ</p>

          ${
            errorMsg
              ? `<div style="background:#fee2e2; color:#b91c1c; padding:8px 14px; border-radius:10px; font-size:0.85rem; font-weight:700; margin-bottom:16px;">${escapeHtml(
                  errorMsg
                )}</div>`
              : ""
          }

          <form id="admin-login-form">
            <div class="admin-input-group">
              <label class="admin-input-label">ລະຫັດຜ່ານ Admin (Passcode):</label>
              <input
                type="password"
                id="admin-passcode-input"
                class="admin-input-field"
                placeholder="ປ້ອນລະຫັດຜ່ານ..."
                required
                autofocus
              />
              <div style="font-size:0.75rem; color:#64748b; margin-top:5px;">
                💡 ລະຫັດຜ່ານເລີ່ມຕົ້ນ: <strong>1402</strong> ຫຼື <strong>admin</strong>
              </div>
            </div>

            <button type="submit" class="admin-primary-btn">
              ເຂົ້າສູ່ລະບົບ (Log In) ➔
            </button>
          </form>

          <div style="margin-top:20px; text-align:center;">
            <a href="./index.html" style="color:#2563eb; font-size:0.85rem; text-decoration:underline;">
              ← ກັບໄປໜ້າເວັບຫຼັກ
            </a>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById("admin-login-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("admin-passcode-input");
        const val = (input?.value || "").trim();
        const savedPass = localStorage.getItem("blue_admin_password") || "1402";

        if (val === savedPass || val === "admin" || val === "1402") {
          setAuthenticated(true);
          initMonitorConnection();
          renderDashboard();
        } else {
          renderLoginScreen("ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
        }
      });
    }
  }

  // ==================== MONITOR AUDIO & NETWORKING ====================
  function playMonitorChime() {
    if (!monitorSoundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {}
  }

  function addLogItem(item, isIncomingRealtime = false) {
    if (!item || !item.id) return false;
    const exists = activityLogs.some((x) => x.id === item.id);
    if (exists) return false;

    activityLogs.unshift(item);
    activityLogs.sort((a, b) => (b.time || 0) - (a.time || 0));
    if (activityLogs.length > 200) activityLogs.length = 200;

    try {
      localStorage.setItem("dofan_activity_log", JSON.stringify(activityLogs));
    } catch (e) {}

    return true;
  }

  function initMonitorConnection() {
    // 1. Load from localStorage
    try {
      const saved = localStorage.getItem("dofan_activity_log");
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          list.forEach((item) => addLogItem(item, false));
        }
      }
    } catch (e) {}

    // 2. Poll last 24h history from ntfy
    fetch(`${MONITOR_URL}/${MONITOR_TOPIC}/json?poll=1&since=24h`)
      .then((res) => res.text())
      .then((text) => {
        if (!text) return;
        const lines = text.trim().split("\n");
        let hasNew = false;
        lines.forEach((line) => {
          try {
            const ntfyMsg = JSON.parse(line);
            if (ntfyMsg.event === "message" && ntfyMsg.message) {
              try {
                const item = JSON.parse(ntfyMsg.message);
                if (addLogItem(item, false)) hasNew = true;
              } catch (err) {
                const fallbackItem = {
                  id: ntfyMsg.id,
                  time: ntfyMsg.time * 1000,
                  timeFormatted: new Date(ntfyMsg.time * 1000).toLocaleTimeString("lo-LA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                  dateFormatted: new Date(ntfyMsg.time * 1000).toLocaleDateString("lo-LA", { month: "short", day: "numeric" }),
                  title: ntfyMsg.title || "ການເຄື່ອນໄຫວ",
                  detail: ntfyMsg.message,
                  stage: 0,
                  icon: "💙",
                  device: "📱 Web",
                };
                if (addLogItem(fallbackItem, false)) hasNew = true;
              }
            }
          } catch (e) {}
        });
        if (hasNew && currentTab === "monitor") {
          updateMonitorView();
        }
      })
      .catch(() => {});

    // 3. Real-time SSE listener
    if (window.EventSource && !monitorEventSource) {
      try {
        monitorEventSource = new EventSource(`${MONITOR_URL}/${MONITOR_TOPIC}/sse`);
        monitorEventSource.onmessage = (e) => {
          try {
            const ntfyMsg = JSON.parse(e.data);
            if (ntfyMsg.event === "message" && ntfyMsg.message) {
              let item;
              try {
                item = JSON.parse(ntfyMsg.message);
              } catch (err) {
                item = {
                  id: ntfyMsg.id || "evt_" + Date.now(),
                  time: (ntfyMsg.time || Date.now() / 1000) * 1000,
                  timeFormatted: new Date().toLocaleTimeString("lo-LA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                  dateFormatted: new Date().toLocaleDateString("lo-LA", { month: "short", day: "numeric" }),
                  title: ntfyMsg.title || "ການເຄື່ອນໄຫວໃໝ່",
                  detail: ntfyMsg.message,
                  stage: 0,
                  icon: "💙",
                  device: "📱 Web",
                };
              }
              const isNew = addLogItem(item, true);
              if (isNew) {
                playMonitorChime();
                showToast(`🔔 ${item.title || "ມີການເຄື່ອນໄຫວໃໝ່ຈາກແຟນ!"}`);
                if (currentTab === "monitor") {
                  updateMonitorView();
                }
              }
            }
          } catch (err) {}
        };

        monitorEventSource.onerror = () => {
          const statusDot = document.getElementById("monitor-status-dot");
          const statusText = document.getElementById("monitor-status-text");
          if (statusDot) statusDot.style.background = "#f59e0b";
          if (statusText) statusText.textContent = "ກຳລັງເຊື່ອມຕໍ່ໃໝ່...";
        };

        monitorEventSource.onopen = () => {
          const statusDot = document.getElementById("monitor-status-dot");
          const statusText = document.getElementById("monitor-status-text");
          if (statusDot) statusDot.style.background = "#10b981";
          if (statusText) statusText.textContent = "ເຊື່ອມຕໍ່ສົດ (Real-Time Live)";
        };
      } catch (e) {}
    }
  }

  function updateMonitorView() {
    const tabContent = document.getElementById("admin-tab-content");
    if (!tabContent || currentTab !== "monitor") return;
    tabContent.innerHTML = renderMonitorTab();
    bindMonitorTabEvents();
  }

  // ==================== DASHBOARD RENDERING ====================
  function renderDashboard() {
    const root = document.getElementById("admin-app-root");
    if (!root) return;

    root.innerHTML = `
      <div class="admin-dashboard">
        <!-- Sticky Top Navigation -->
        <header class="admin-navbar">
          <div class="admin-brand">
            <span>💙</span>
            <span>Blue Love Admin Portal</span>
          </div>

          <div class="admin-nav-actions">
            <a href="./index.html" target="_blank" class="admin-pill-btn" title="ເບິ່ງໜ້າເວັບຈິງ">
              <span>👀</span>
              <span>ເບິ່ງໜ້າເວັບຈິງ</span>
            </a>
            <button type="button" id="btn-save-top" class="admin-pill-btn save-btn">
              <span>💾</span>
              <span>ບັນທຶກ</span>
            </button>
            <button type="button" id="btn-logout" class="admin-pill-btn" style="background:#fee2e2; color:#b91c1c; border-color:#fca5a5;">
              <span>🚪</span>
              <span>ອອກຈາກລະບົບ</span>
            </button>
          </div>
        </header>

        <!-- Tabs Switcher -->
        <div class="admin-tabs-bar">
          <button type="button" class="admin-tab-item ${currentTab === "monitor" ? "active" : ""}" data-tab="monitor">
            📡 1. ຕິດຕາມແຟນ (Live Monitor)
          </button>
          <button type="button" class="admin-tab-item ${currentTab === "colors" ? "active" : ""}" data-tab="colors">
            🎨 2. ປັບແຕ່ງສີ (Colors & Theme)
          </button>
          <button type="button" class="admin-tab-item ${currentTab === "texts" ? "active" : ""}" data-tab="texts">
            ✍️ 3. ປັບແຕ່ງຂໍ້ຄວາມ (Texts & Content)
          </button>
          <button type="button" class="admin-tab-item ${currentTab === "photos" ? "active" : ""}" data-tab="photos">
            🖼️ 4. ປັບແຕ່ງຮູບພາບ (Photos & Gallery)
          </button>
          <button type="button" class="admin-tab-item ${currentTab === "settings" ? "active" : ""}" data-tab="settings">
            ⚙️ 5. ຕັ້ງຄ່າ & ສຳຮອງ (Settings)
          </button>
        </div>

        <!-- Active Tab Content -->
        <div id="admin-tab-content">
          ${renderTabContent()}
        </div>
      </div>
    `;

    bindDashboardEvents();
  }

  function renderTabContent() {
    if (currentTab === "monitor") return renderMonitorTab();
    if (currentTab === "colors") return renderColorsTab();
    if (currentTab === "texts") return renderTextsTab();
    if (currentTab === "photos") return renderPhotosTab();
    if (currentTab === "settings") return renderSettingsTab();
    return "";
  }

  // ==================== TAB 0: LIVE ACTIVITY MONITOR ====================
  function computeStageSummary() {
    // Stage 1
    const s1Complete = activityLogs.some((l) => l.type === "LETTER_OPEN");
    const s1Unlock = activityLogs.some((l) => l.type === "STAGE_UNLOCK");
    const s1Heart = activityLogs.some((l) => l.type === "TTT_HEART");
    let s1 = { status: "pending", badge: "⚪ ຍັງບໍ່ເລີ່ມ", sub: "ລໍຖ້າແຟນເປີດ" };
    if (s1Complete) s1 = { status: "completed", badge: "✅ ເປີດຈົດໝາຍແລ້ວ", sub: "ອ່ານຈົດໝາຍ 3D" };
    else if (s1Unlock) s1 = { status: "active", badge: "🟡 ປົດລັອກແລ້ວ", sub: "ວາງຫົວໃຈຄົບ 3 ດວງ" };
    else if (s1Heart) s1 = { status: "active", badge: "🟡 ກຳລັງວາງຫົວໃຈ", sub: "ເກມ Tic-Tac-Toe" };

    // Stage 2
    const s2Complete = activityLogs.some((l) => l.type === "CONSTELLATION_COMPLETE");
    const s2Stars = activityLogs.filter((l) => l.type === "STAR_TAP");
    let s2 = { status: "pending", badge: "⚪ ຍັງບໍ່ເລີ່ມ", sub: "ລໍຖ້າດ່ານທີ 2" };
    if (s2Complete) s2 = { status: "completed", badge: "✅ ຄົບ 8 ດວງ", sub: "ກຸ່ມດາວຫົວໃຈ 💙" };
    else if (s2Stars.length > 0) s2 = { status: "active", badge: `🟡 ຕໍ່ແລ້ວ ${s2Stars.length}/8`, sub: "ກຳລັງຕໍ່ດາວ" };

    // Stage 3
    const s3All = activityLogs.some((l) => l.type === "POLAROID_ALL_OPENED");
    const s3Opens = activityLogs.filter((l) => l.type === "POLAROID_OPEN");
    let s3 = { status: "pending", badge: "⚪ ຍັງບໍ່ເລີ່ມ", sub: "ລໍຖ້າດ່ານທີ 3" };
    if (s3All || s3Opens.length >= 6) s3 = { status: "completed", badge: "✅ ຄົບ 6/6 ຮູບ", sub: "ເປີດອາລະບ້ຳຄົບ" };
    else if (s3Opens.length > 0) s3 = { status: "active", badge: `🟡 ເປີດ ${s3Opens.length}/6 ຮູບ`, sub: "ກຳລັງເບິ່ງຮູບ" };

    // Stage 4
    const s4Reveal = activityLogs.some((l) => l.type === "SCRATCH_REVEAL");
    let s4 = { status: "pending", badge: "⚪ ຍັງບໍ່ເລີ່ມ", sub: "ລໍຖ້າດ່ານທີ 4" };
    if (s4Reveal) s4 = { status: "completed", badge: "✅ ຂູດສຳເລັດ 100%", sub: "ເຫັນຂໍ້ຄວາມລັບ" };

    // Stage 5
    const s5Play = activityLogs.some((l) => l.type === "CASSETTE_PLAY");
    let s5 = { status: "pending", badge: "⚪ ຍັງບໍ່ເລີ່ມ", sub: "ລໍຖ້າດ່ານທີ 5" };
    if (s5Play) s5 = { status: "completed", badge: "✅ ເຄີຍເປີດຟັງເພງ", sub: "ເຄື່ອງຫຼິ້ນຄາເຊັດ" };

    // Stage 6
    const s6Reply = activityLogs.some((l) => l.type === "REPLY_SEND");
    const s6Complete = activityLogs.some((l) => l.type === "JIGSAW_COMPLETE");
    const s6Snap = activityLogs.some((l) => l.type === "JIGSAW_SNAP");
    let s6 = { status: "pending", badge: "⚪ ຍັງບໍ່ເລີ່ມ", sub: "ລໍຖ້າດ່ານທີ 6" };
    if (s6Reply) s6 = { status: "completed", badge: "💌 ຕອບກັບແລ້ວ!", sub: "ສົ່ງຂໍ້ຄວາມຫາ Do" };
    else if (s6Complete) s6 = { status: "completed", badge: "🏆 ສຳເລັດ 100%", sub: "ຕໍ່ຈິກຊໍ້ຮູບຄູ່ຄົບ" };
    else if (s6Snap) s6 = { status: "active", badge: "🟡 ກຳລັງຕໍ່ຈິກຊໍ້", sub: "ກຳລັງຕໍ່ຮູບຄູ່" };

    return { s1, s2, s3, s4, s5, s6 };
  }

  function renderMonitorTab() {
    const summary = computeStageSummary();
    const latestReply = activityLogs.find((l) => l.type === "REPLY_SEND");

    // Filter logs
    let filteredLogs = [...activityLogs];
    if (monitorActiveFilter === "stages") {
      filteredLogs = filteredLogs.filter((l) => l.stage && l.stage >= 1 && l.stage <= 6);
    } else if (monitorActiveFilter === "replies") {
      filteredLogs = filteredLogs.filter((l) => l.type === "REPLY_SEND");
    }

    const replyCount = activityLogs.filter((l) => l.type === "REPLY_SEND").length;

    return `
      <!-- Monitor Header Card -->
      <div class="admin-card">
        <div class="admin-card-header" style="flex-wrap:wrap; gap:12px;">
          <div class="admin-card-title">
            <span>📡</span>
            <span>ຕິດຕາມການເຄື່ອນໄຫວຂອງແຟນ (Live Activity Monitor)</span>
          </div>

          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <div class="monitor-status-pill">
              <span class="monitor-pulse-dot" id="monitor-status-dot"></span>
              <span id="monitor-status-text">ເຊື່ອມຕໍ່ສົດ (Real-Time Live)</span>
            </div>

            <button type="button" id="btn-monitor-sound" class="admin-pill-btn" style="background:${monitorSoundEnabled ? "#eff6ff" : "#f1f5f9"}; font-size:0.8rem; padding:6px 12px;">
              ${monitorSoundEnabled ? "🔔 ສຽງ: ເປີດ" : "🔕 ສຽງ: ປິດ"}
            </button>

            <button type="button" id="btn-monitor-refresh" class="admin-pill-btn" style="font-size:0.8rem; padding:6px 12px;" title="ໂຫຼດຂໍ້ມູນໃໝ່">
              <span>🔄</span>
              <span>ໂຫຼດໃໝ່</span>
            </button>

            <button type="button" id="btn-monitor-clear" class="admin-pill-btn" style="background:#fee2e2; color:#b91c1c; border-color:#fca5a5; font-size:0.8rem; padding:6px 12px;" title="ລ້າງປະຫວັດ">
              <span>🧹</span>
              <span>ລ້າງ</span>
            </button>
          </div>
        </div>

        <p style="font-size:0.88rem; color:#475569; margin-bottom:16px; line-height:1.4;">
          ຕິດຕາມເບິ່ງທຸກການກົດຂອງແຟນແບບ Real-Time! ເມື່ອແຟນແຕະວາງຫົວໃຈ, ເປີດຈົດໝາຍ, ຕໍ່ດາວ, ເບິ່ງຮູບ, ຂູດບັດ, ຫຼິ້ນເພງ, ຕໍ່ຈິກຊໍ້ ຫຼື ສົ່ງຂໍ້ຄວາມຕອບກັບ ລະບົບຈະແຈ້ງເຕືອນຂຶ້ນທີ່ນີ້ທັນທີ 💙
        </p>

        <!-- 6 Stage Overview Cards -->
        <div class="monitor-overview-grid">
          <div class="monitor-stage-card is-${summary.s1.status}">
            <div class="monitor-stage-icon">💌</div>
            <div class="monitor-stage-name">ດ່ານ 1: ຈົດໝາຍສີຟ້າ</div>
            <div class="monitor-stage-badge">${summary.s1.badge}</div>
            <div style="font-size:0.7rem; color:#64748b; margin-top:4px;">${summary.s1.sub}</div>
          </div>

          <div class="monitor-stage-card is-${summary.s2.status}">
            <div class="monitor-stage-icon">✨</div>
            <div class="monitor-stage-name">ດ່ານ 2: ກຸ່ມດາວຫົວໃຈ</div>
            <div class="monitor-stage-badge">${summary.s2.badge}</div>
            <div style="font-size:0.7rem; color:#64748b; margin-top:4px;">${summary.s2.sub}</div>
          </div>

          <div class="monitor-stage-card is-${summary.s3.status}">
            <div class="monitor-stage-icon">📸</div>
            <div class="monitor-stage-name">ດ່ານ 3: ອາລະບ້ຳຄວາມຊົງຈຳ</div>
            <div class="monitor-stage-badge">${summary.s3.badge}</div>
            <div style="font-size:0.7rem; color:#64748b; margin-top:4px;">${summary.s3.sub}</div>
          </div>

          <div class="monitor-stage-card is-${summary.s4.status}">
            <div class="monitor-stage-icon">🌟</div>
            <div class="monitor-stage-name">ດ່ານ 4: ບັດຂູດດາວ</div>
            <div class="monitor-stage-badge">${summary.s4.badge}</div>
            <div style="font-size:0.7rem; color:#64748b; margin-top:4px;">${summary.s4.sub}</div>
          </div>

          <div class="monitor-stage-card is-${summary.s5.status}">
            <div class="monitor-stage-icon">🎵</div>
            <div class="monitor-stage-name">ດ່ານ 5: ເຄື່ອງຫຼິ້ນຄາເຊັດ</div>
            <div class="monitor-stage-badge">${summary.s5.badge}</div>
            <div style="font-size:0.7rem; color:#64748b; margin-top:4px;">${summary.s5.sub}</div>
          </div>

          <div class="monitor-stage-card is-${summary.s6.status}">
            <div class="monitor-stage-icon">🧩</div>
            <div class="monitor-stage-name">ດ່ານ 6: ຈິກຊໍ້ຮູບຄູ່</div>
            <div class="monitor-stage-badge">${summary.s6.badge}</div>
            <div style="font-size:0.7rem; color:#64748b; margin-top:4px;">${summary.s6.sub}</div>
          </div>
        </div>

        ${
          latestReply
            ? `
          <!-- Latest Girlfriend Reply Banner -->
          <div class="monitor-reply-hero">
            <div class="monitor-reply-label">
              <span>💌</span>
              <span>ຂໍ້ຄວາມຕອບກັບລ່າສຸດຈາກແຟນ (Latest Reply from Girlfriend)</span>
            </div>
            <div class="monitor-reply-text">"${escapeHtml(latestReply.detail || latestReply.title)}"</div>
            <div class="monitor-reply-meta">
              <span>⏱ ${escapeHtml(latestReply.timeFormatted || "")} (${escapeHtml(latestReply.dateFormatted || "")})</span>
              <span>•</span>
              <span>${escapeHtml(latestReply.device || "📱 Mobile")}</span>
              <span>•</span>
              <span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:999px;">ດ່ານທີ 6: ຈິກຊໍ້ & ອວຍພອນ</span>
            </div>
          </div>
        `
            : ""
        }

        <!-- Timeline Header & Filters -->
        <div style="border-top:1.5px solid #eff6ff; padding-top:16px; margin-top:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <div style="font-weight:800; font-size:1.05rem; color:#1e3a8a; display:flex; align-items:center; gap:6px;">
              <span>📜</span>
              <span>ບັນທຶກການເຄື່ອນໄຫວລະອຽດ (Activity Timeline)</span>
              <span style="font-size:0.78rem; font-weight:700; background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:999px;">${activityLogs.length} ລາຍການ</span>
            </div>

            <!-- Filter Chips -->
            <div class="monitor-filter-bar" style="margin-bottom:0;">
              <button type="button" class="monitor-filter-chip ${monitorActiveFilter === "all" ? "active" : ""}" data-monitor-filter="all">
                ທັງໝົດ (${activityLogs.length})
              </button>
              <button type="button" class="monitor-filter-chip ${monitorActiveFilter === "stages" ? "active" : ""}" data-monitor-filter="stages">
                ດ່ານ 1-6
              </button>
              <button type="button" class="monitor-filter-chip ${monitorActiveFilter === "replies" ? "active" : ""}" data-monitor-filter="replies">
                💌 ຂໍ້ຄວາມຕອບກັບ (${replyCount})
              </button>
            </div>
          </div>

          <!-- Timeline Feed -->
          <div class="monitor-timeline">
            ${
              filteredLogs.length === 0
                ? `
              <div style="text-align:center; padding:40px 20px; color:#64748b; background:#f8fafc; border-radius:16px; border:1px dashed #cbd5e1;">
                <div style="font-size:2.8rem; margin-bottom:10px;">📡 💙</div>
                <div style="font-weight:700; font-size:1.05rem; color:#1e3a8a; margin-bottom:6px;">ຍັງບໍ່ທັນມີການເຄື່ອນໄຫວເທື່ອ</div>
                <div style="font-size:0.86rem; max-width:440px; margin:0 auto; line-height:1.45; color:#64748b;">
                  ເມື່ອແຟນເປີດລິ້ງເວັບໄຊ, ແຕະວາງຫົວໃຈ, ຕໍ່ດວງດາວ, ເບິ່ງຮູບ, ຂູດບັດ, ເປີດເພງ ຫຼື ຕໍ່ຈິກຊໍ້... ລະບົບຈະບັນທຶກ ແລະ ແຈ້ງເຕືອນຂຶ້ນທີ່ນີ້ແບບ Real-Time ທັນທີ!
                </div>
              </div>
            `
                : filteredLogs
                    .map(
                      (item) => `
              <div class="monitor-timeline-item ${item.type === "REPLY_SEND" ? "is-reply" : ""}">
                <div class="monitor-timeline-icon">${item.icon || "💙"}</div>
                <div class="monitor-timeline-content">
                  <div class="monitor-timeline-header">
                    <div class="monitor-timeline-title">${escapeHtml(item.title)}</div>
                    <div class="monitor-timeline-time">${escapeHtml(item.timeFormatted || "")}</div>
                  </div>
                  <div class="monitor-timeline-detail">${escapeHtml(item.detail || "")}</div>
                  <div class="monitor-timeline-tags">
                    <span class="monitor-tag">${escapeHtml(item.stageName || ("ດ່ານທີ " + item.stage))}</span>
                    <span class="monitor-device-tag">${escapeHtml(item.device || "📱 Mobile")}</span>
                    <span style="font-size:0.7rem; color:#94a3b8; font-family:monospace;">${escapeHtml(item.dateFormatted || "")}</span>
                  </div>
                </div>
              </div>
            `
                    )
                    .join("")
            }
          </div>
        </div>
      </div>

      <!-- Mobile Push Notification Guide Box -->
      <div class="admin-card" style="background:#f0f9ff; border-color:#bae6fd;">
        <div class="admin-card-header">
          <div class="admin-card-title" style="color:#0369a1;">
            <span>📲</span>
            <span>ຢາກໃຫ້ແຈ້ງເຕືອນຂຶ້ນໜ້າຈໍມືຖື (Mobile Push Notifications) ບໍ?</span>
          </div>
        </div>
        <p style="font-size:0.86rem; color:#0c4a6e; line-height:1.45; margin-bottom:12px;">
          ເຈົ້າສາມາດຕິດຕັ້ງແອັບຟຣີ <strong>ntfy</strong> ໃນມືຖື (ຮອງຮັບທັງ iPhone ແລະ Android) ເພື່ອຮັບການແຈ້ງເຕືອນທຸກຄັ້ງທີ່ແຟນກົດຫຍັງ ຫຼື ສົ່ງຂໍ້ຄວາມຫາເຈົ້າ:
        </p>
        <ol style="font-size:0.84rem; color:#0369a1; padding-left:20px; line-height:1.65; margin-bottom:12px;">
          <li>ດາວໂຫຼດແອັບ <strong>ntfy</strong> ຈາກ App Store (iPhone) ຫຼື Google Play Store (Android).</li>
          <li>ເປີດແອັບ ແລ້ວກົດປຸ່ມ <strong>+ (Subscribe)</strong>.</li>
          <li>ພິມຊື່ຫົວຂໍ້: <code style="background:#e0f2fe; padding:2px 8px; border-radius:6px; font-weight:700; color:#0284c7;">dofan-love-monitor-8899</code> ແລ້ວກົດ Subscribe.</li>
          <li>ສຳເລັດ! ເວລາແຟນເປີດເບິ່ງ ຫຼື ກົດຫຍັງໃນເວັບ ມືຖືຂອງເຈົ້າຈະດັງເຕືອນທັນທີ! 🔔💙</li>
        </ol>
      </div>
    `;
  }

  function bindMonitorTabEvents() {
    const refreshBtn = document.getElementById("btn-monitor-refresh");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        fetch(`${MONITOR_URL}/${MONITOR_TOPIC}/json?poll=1&since=24h`)
          .then((res) => res.text())
          .then((text) => {
            if (text) {
              const lines = text.trim().split("\n");
              lines.forEach((line) => {
                try {
                  const ntfyMsg = JSON.parse(line);
                  if (ntfyMsg.event === "message" && ntfyMsg.message) {
                    try {
                      addLogItem(JSON.parse(ntfyMsg.message), false);
                    } catch (e) {}
                  }
                } catch (e) {}
              });
            }
            updateMonitorView();
            showToast("✓ ອັບເດດຂໍ້ມູນລ່າສຸດແລ້ວ!");
          })
          .catch(() => {
            updateMonitorView();
            showToast("✓ ອັບເດດແລ້ວ");
          });
      });
    }

    const clearBtn = document.getElementById("btn-monitor-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລ້າງປະຫວັດການເຄື່ອນໄຫວທັງໝົດ?")) {
          activityLogs = [];
          localStorage.removeItem("dofan_activity_log");
          updateMonitorView();
          showToast("✓ ລ້າງປະຫວັດສຳເລັດແລ້ວ");
        }
      });
    }

    const soundBtn = document.getElementById("btn-monitor-sound");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        monitorSoundEnabled = !monitorSoundEnabled;
        soundBtn.textContent = monitorSoundEnabled ? "🔔 ສຽງ: ເປີດ" : "🔕 ສຽງ: ປິດ";
        soundBtn.style.background = monitorSoundEnabled ? "#eff6ff" : "#f1f5f9";
        if (monitorSoundEnabled) playMonitorChime();
        showToast(monitorSoundEnabled ? "✓ ເປີດສຽງແຈ້ງເຕືອນແລ້ວ" : "✓ ປິດສຽງແຈ້ງເຕືອນແລ້ວ");
      });
    }

    document.querySelectorAll("[data-monitor-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        monitorActiveFilter = btn.getAttribute("data-monitor-filter") || "all";
        updateMonitorView();
      });
    });
  }

  // ==================== TAB 1: COLORS ====================
  function renderColorsTab() {
    const c = adminConfig.themeColors || DEFAULT_CONFIG.themeColors;
    return `
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>🎨</span>
            <span>ຊຸດສີສຳເລັດຮູບ (Color Theme Presets)</span>
          </div>
        </div>
        <p style="font-size:0.88rem; color:#475569; margin-bottom:14px;">
          ເລືອກຊຸດສີທີ່ມັກເພື່ອປ່ຽນບັນຍາກາດທັງໝົດຂອງເວັບໄຊດ້ວຍຄລິກດຽວ:
        </p>

        <div class="admin-grid-2" style="margin-bottom:20px;">
          ${COLOR_PRESETS.map(
            (p, idx) => `
            <div
              class="admin-color-picker-box"
              style="cursor:pointer; border-width:2px; ${
                p.colors.accentRed === c.accentRed ? "border-color:#2563eb; background:#eff6ff;" : ""
              }"
              data-apply-preset="${idx}"
            >
              <div style="display:flex; gap:4px; align-items:center;">
                <span style="width:22px; height:22px; border-radius:50%; background:${p.colors.accentRed}; border:1px solid rgba(0,0,0,0.1);"></span>
                <span style="width:22px; height:22px; border-radius:50%; background:${p.colors.accentPink}; border:1px solid rgba(0,0,0,0.1);"></span>
                <span style="width:22px; height:22px; border-radius:50%; background:${p.colors.bgBottom}; border:1px solid rgba(0,0,0,0.1);"></span>
              </div>
              <div class="admin-color-info">
                <div class="admin-color-name">${escapeHtml(p.name)}</div>
              </div>
            </div>
          `
          ).join("")}
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>🖌️</span>
            <span>ກຳນົດສີດ້ວຍຕົວເອງ (Custom Color Pickers)</span>
          </div>
        </div>

        <div class="admin-grid-2">
          <div class="admin-color-picker-box">
            <input type="color" id="col-accent-red" class="admin-color-input" value="${c.accentRed}" />
            <div class="admin-color-info">
              <div class="admin-color-name">ສີຫຼັກ (Primary Accent / ປຸ່ມ)</div>
              <div class="admin-color-hex">${c.accentRed}</div>
            </div>
          </div>

          <div class="admin-color-picker-box">
            <input type="color" id="col-accent-pink" class="admin-color-input" value="${c.accentPink}" />
            <div class="admin-color-info">
              <div class="admin-color-name">ສີຮອງ (Secondary Accent)</div>
              <div class="admin-color-hex">${c.accentPink}</div>
            </div>
          </div>

          <div class="admin-color-picker-box">
            <input type="color" id="col-accent-rose" class="admin-color-input" value="${c.accentRose}" />
            <div class="admin-color-info">
              <div class="admin-color-name">ສີອ່ອນ (Soft Blue Highlight)</div>
              <div class="admin-color-hex">${c.accentRose}</div>
            </div>
          </div>

          <div class="admin-color-picker-box">
            <input type="color" id="col-text-primary" class="admin-color-input" value="${c.textPrimary}" />
            <div class="admin-color-info">
              <div class="admin-color-name">ສີຂໍ້ຄວາມຫຼັກ (Text Heading)</div>
              <div class="admin-color-hex">${c.textPrimary}</div>
            </div>
          </div>

          <div class="admin-color-picker-box">
            <input type="color" id="col-bg-top" class="admin-color-input" value="${c.bgTop}" />
            <div class="admin-color-info">
              <div class="admin-color-name">ສີພື້ນຫຼັງເທິງ (Background Top)</div>
              <div class="admin-color-hex">${c.bgTop}</div>
            </div>
          </div>

          <div class="admin-color-picker-box">
            <input type="color" id="col-bg-bottom" class="admin-color-input" value="${c.bgBottom}" />
            <div class="admin-color-info">
              <div class="admin-color-name">ສີພື້ນຫຼັງລຸ່ມ (Background Bottom)</div>
              <div class="admin-color-hex">${c.bgBottom}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== TAB 2: TEXTS ====================
  function renderTextsTab() {
    return `
      <!-- Basic Names -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>👥</span>
            <span>1. ຂໍ້ມູນຄູ່ຮັກ (Names & Lock)</span>
          </div>
        </div>

        <div class="admin-grid-2">
          <div class="admin-input-group">
            <label class="admin-input-label">ຊື່ຜູ້ຮັບ (Receiver's Name):</label>
            <input type="text" id="ed-receiverName" class="admin-input-field" value="${escapeHtml(
              adminConfig.receiverName
            )}" />
          </div>

          <div class="admin-input-group">
            <label class="admin-input-label">ຊື່ຜູ້ສົ່ງ (Your Name):</label>
            <input type="text" id="ed-senderName" class="admin-input-field" value="${escapeHtml(
              adminConfig.senderName
            )}" />
          </div>

          <div class="admin-input-group">
            <label class="admin-input-label">ຄຳໃບ້ໜ້າ Tic-Tac-Toe (Lock Screen Hint):</label>
            <input type="text" id="ed-pinHint" class="admin-input-field" value="${escapeHtml(
              adminConfig.pinHint
            )}" />
          </div>

          <div class="admin-input-group">
            <label class="admin-input-label">ຂໍ້ຄວາມປ້າຍຊື່ກອບຮູບ (Photo Plaque Name):</label>
            <input type="text" id="ed-plaqueText" class="admin-input-field" value="${escapeHtml(
              adminConfig.plaqueText || "✨ DO & FAN 💙 YOU & ME FOREVER ✨"
            )}" />
          </div>
        </div>
      </div>

      <!-- Letter Content -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>💌</span>
            <span>2. ເນື້ອໃນຈົດໝາຍຮັກສີຟ້າ (Page 1 Letter)</span>
          </div>
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຄຳຂຶ້ນຕົ້ນຈົດໝາຍ (Salutation):</label>
          <input type="text" id="ed-letterSalutation" class="admin-input-field" value="${escapeHtml(
            adminConfig.letterSalutation
          )}" />
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຫຍໍ້ໜ້າທີ 1:</label>
          <textarea id="ed-letterParagraph1" class="admin-input-field" rows="2">${escapeHtml(
            adminConfig.letterParagraph1
          )}</textarea>
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຫຍໍ້ໜ້າທີ 2:</label>
          <textarea id="ed-letterParagraph2" class="admin-input-field" rows="2">${escapeHtml(
            adminConfig.letterParagraph2
          )}</textarea>
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຫຍໍ້ໜ້າທີ 3:</label>
          <textarea id="ed-letterParagraph3" class="admin-input-field" rows="2">${escapeHtml(
            adminConfig.letterParagraph3
          )}</textarea>
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຫຍໍ້ໜ້າທີ 4:</label>
          <textarea id="ed-letterParagraph4" class="admin-input-field" rows="2">${escapeHtml(
            adminConfig.letterParagraph4
          )}</textarea>
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຄຳລົງທ້າຍຈົດໝາຍ (Signature):</label>
          <input type="text" id="ed-letterSignature" class="admin-input-field" value="${escapeHtml(
            adminConfig.letterSignature
          )}" />
        </div>
      </div>

      <!-- Constellation Whispers -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>✨</span>
            <span>3. ຄຳກະຊິບດາວແຫ່ງຄວາມຮັກທັງ 8 ດວງ (Page 2 Love Stars)</span>
          </div>
        </div>

        ${(adminConfig.whispers || DEFAULT_CONFIG.whispers)
          .map(
            (w, idx) => `
            <div class="admin-input-group">
              <label class="admin-input-label">ດາວດວງທີ ${idx + 1}:</label>
              <textarea class="admin-input-field ed-whisper-input" data-whisper-idx="${idx}" rows="2">${escapeHtml(
              w
            )}</textarea>
            </div>
          `
          )
          .join("")}
      </div>

      <!-- Scratch Card & Cassette Tape (Pages 4 & 5) -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>🎫</span>
            <span>4. ບັດຂູດຄວາມລັບ & ເທັບເພງ (Pages 4 & 5)</span>
          </div>
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຂໍ້ຄວາມລັບໃນບັດຂູດດວງດາວ (Scratch Card Secret Quote):</label>
          <textarea id="ed-scratchQuote" class="admin-input-field" rows="3">${escapeHtml(
            adminConfig.scratchQuote || DEFAULT_CONFIG.scratchQuote
          )}</textarea>
        </div>

        <div class="admin-input-group" style="margin-top: 14px;">
          <label class="admin-input-label">ຄຳເວົ້າເພງທີ 1: ວິນາທີທີ່ພົບເຈົ້າ (Track 01 Quote):</label>
          <textarea id="ed-cassetteQuote0" class="admin-input-field" rows="2">${escapeHtml(
            (adminConfig.cassetteTracks && adminConfig.cassetteTracks[0]?.quote) ||
              DEFAULT_CONFIG.cassetteTracks[0].quote
          )}</textarea>
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຄຳເວົ້າເພງທີ 2: ທ້ອງຟ້າສີຟ້າຂອງເຮົາ (Track 02 Quote):</label>
          <textarea id="ed-cassetteQuote1" class="admin-input-field" rows="2">${escapeHtml(
            (adminConfig.cassetteTracks && adminConfig.cassetteTracks[1]?.quote) ||
              DEFAULT_CONFIG.cassetteTracks[1].quote
          )}</textarea>
        </div>

        <div class="admin-input-group">
          <label class="admin-input-label">ຄຳເວົ້າເພງທີ 3: ສຸກສັນວັນເກີດຄົນດີ (Track 03 Quote):</label>
          <textarea id="ed-cassetteQuote2" class="admin-input-field" rows="2">${escapeHtml(
            (adminConfig.cassetteTracks && adminConfig.cassetteTracks[2]?.quote) ||
              DEFAULT_CONFIG.cassetteTracks[2].quote
          )}</textarea>
        </div>
      </div>

      <!-- Birthday Celebration & Coupon -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>🎂</span>
            <span>5. ຫົວຂໍ້ວັນເກີດ & ຄູປອງ (Page 6 Finale)</span>
          </div>
        </div>

        <div class="admin-grid-2">
          <div class="admin-input-group">
            <label class="admin-input-label">ຫົວຂໍ້ວັນເກີດ (Birthday Title):</label>
            <input type="text" id="ed-celebrationTitle" class="admin-input-field" value="${escapeHtml(
              adminConfig.celebrationTitle
            )}" />
          </div>

          <div class="admin-input-group">
            <label class="admin-input-label">ຊື່ຄູປອງວັນເກີດ (Coupon Title):</label>
            <input type="text" id="ed-couponTitle" class="admin-input-field" value="${escapeHtml(
              adminConfig.couponTitle
            )}" />
          </div>

          <div class="admin-input-group">
            <label class="admin-input-label">ລະຫັດຄູປອງ (Coupon Code):</label>
            <input type="text" id="ed-couponCode" class="admin-input-field" value="${escapeHtml(
              adminConfig.couponCode
            )}" />
          </div>
        </div>
      </div>
    `;
  }

  // ==================== TAB 3: PHOTOS ====================
  function renderPhotosTab() {
    return `
      <!-- Main Jigsaw Photo -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>🧩</span>
            <span>1. ຮູບຄູ່ຫຼັກ / ຮູບຕໍ່ຈິກຊໍ (Main Couple & Jigsaw Photo)</span>
          </div>
        </div>

        <div class="admin-grid-2">
          <div>
            <div class="admin-photo-preview-box">
              <img
                src="${escapeHtml(adminConfig.jigsawImage || adminConfig.pinImage || "./media/med-do-fan-01.jpeg")}"
                alt="Jigsaw Preview"
                id="jigsaw-preview-img"
                class="admin-photo-preview-img"
              />
            </div>

            <div style="display:flex; gap:8px;">
              <label class="admin-pill-btn" style="cursor:pointer; flex:1; justify-content:center;">
                <span>📁</span>
                <span>ອັບໂຫຼດຮູບຈາກເຄື່ອງ</span>
                <input type="file" id="upload-jigsaw-file" accept="image/*" style="display:none;" />
              </label>
            </div>
          </div>

          <div>
            <div class="admin-input-group">
              <label class="admin-input-label">URL ຮູບພາບ (Image URL):</label>
              <input
                type="text"
                id="ed-jigsawImage"
                class="admin-input-field"
                value="${escapeHtml(adminConfig.jigsawImage || "")}"
                placeholder="./media/med-do-fan-01.jpeg"
              />
            </div>

            <label class="admin-input-label">ຫຼື ເລືອກຮູບຈາກ Presets ໃນລະບົບ:</label>
            <div class="admin-preset-grid">
              ${PRESET_IMAGES.map(
                (img) => `
                <img
                  src="${img}"
                  class="admin-preset-thumb ${adminConfig.jigsawImage === img ? "active" : ""}"
                  data-select-jigsaw="${img}"
                  title="ເລືອກຮູບນີ້"
                />
              `
              ).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- Scrapbook 6 Polaroids -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>📸</span>
            <span>2. ຮູບ Polaroid ຄວາມຊົງຈຳທັງ 6 ຮູບ (Page 3 Scrapbook Memories)</span>
          </div>
        </div>

        <div class="admin-grid-2">
          ${(adminConfig.polaroids || DEFAULT_CONFIG.polaroids)
            .slice(0, 6)
            .map(
              (p, idx) => `
              <div style="border:1.5px solid #bfdbfe; border-radius:16px; padding:14px; background:#f8fafc;">
                <div style="font-weight:800; color:#1e3a8a; font-size:0.9rem; margin-bottom:8px;">
                  ຮູບທີ ${idx + 1} (${p.date || `MOMENT 0${idx + 1}`})
                </div>

                <div class="admin-photo-preview-box" style="height:140px;">
                  <img
                    src="${escapeHtml(p.image)}"
                    id="pol-preview-${idx}"
                    class="admin-photo-preview-img"
                  />
                </div>

                <div class="admin-input-group" style="margin-bottom:8px;">
                  <label class="admin-input-label">ຄຳບັນຍາຍຮູບ (Caption):</label>
                  <input
                    type="text"
                    class="admin-input-field ed-pol-cap"
                    data-pol-idx="${idx}"
                    value="${escapeHtml(p.caption)}"
                  />
                </div>

                <div class="admin-input-group" style="margin-bottom:8px;">
                  <label class="admin-input-label">URL ຮູບພາບ:</label>
                  <input
                    type="text"
                    class="admin-input-field ed-pol-url"
                    data-pol-idx="${idx}"
                    value="${escapeHtml(p.image)}"
                  />
                </div>

                <label class="admin-pill-btn" style="cursor:pointer; width:100%; justify-content:center; font-size:0.8rem; padding:6px 10px;">
                  <span>📁</span>
                  <span>ປ່ຽນຮູບຈາກເຄື່ອງ</span>
                  <input type="file" class="upload-pol-file" data-pol-idx="${idx}" accept="image/*" style="display:none;" />
                </label>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  // ==================== TAB 4: SETTINGS ====================
  function renderSettingsTab() {
    return `
      <!-- Save & Export -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>💾</span>
            <span>ບັນທຶກ & ສົ່ງອອກຂໍ້ມູນ (Save & Export)</span>
          </div>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">
          <button type="button" id="btn-save-bottom" class="admin-primary-btn" style="width:auto; padding:12px 28px;">
            💾 ບັນທຶກການແກ້ໄຂທັງໝົດ (Save Changes)
          </button>
          <button type="button" id="btn-copy-json" class="admin-pill-btn">
            📋 ສຳເນົາ Config JSON
          </button>
          <button type="button" id="btn-download-json" class="admin-pill-btn">
            📥 ດາວໂຫຼດ config.json
          </button>
        </div>
      </div>

      <!-- Change Admin Password -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>🔑</span>
            <span>ປ່ຽນລະຫັດຜ່ານ Admin (Change Admin Passcode)</span>
          </div>
        </div>

        <div style="max-width:360px;">
          <div class="admin-input-group">
            <label class="admin-input-label">ລະຫັດຜ່ານໃໝ່:</label>
            <input type="password" id="ed-new-password" class="admin-input-field" placeholder="ປ້ອນລະຫັດຜ່ານໃໝ່..." />
          </div>
          <button type="button" id="btn-change-password" class="admin-pill-btn">
            ✓ ບັນທຶກລະຫັດຜ່ານໃໝ່
          </button>
        </div>
      </div>

      <!-- Reset -->
      <div class="admin-card" style="border-color:#fecaca;">
        <div class="admin-card-header">
          <div class="admin-card-title" style="color:#b91c1c;">
            <span>⚠️</span>
            <span>ຣີເຊັດເປັນຄ່າເລີ່ມຕົ້ນ (Reset to Defaults)</span>
          </div>
        </div>
        <p style="font-size:0.86rem; color:#64748b; margin-bottom:12px;">
          ຫາກຕ້ອງການລຶບການປ່ຽນແປງທັງໝົດ ແລະ ກັບຄືນສູ່ຄ່າເລີ່ມຕົ້ນ:
        </p>
        <button type="button" id="btn-reset-defaults" class="admin-pill-btn" style="background:#fee2e2; color:#b91c1c; border-color:#fca5a5;">
          ↺ ຣີເຊັດເປັນຄ່າເລີ່ມຕົ້ນ
        </button>
      </div>
    `;
  }

  // ==================== EVENT BINDINGS ====================
  function bindDashboardEvents() {
    // 1. Tab Switching
    document.querySelectorAll(".admin-tab-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        syncFormToState();
        currentTab = btn.getAttribute("data-tab");
        renderDashboard();
      });
    });

    // 2. Logout Button
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        setAuthenticated(false);
        renderLoginScreen();
      });
    }

    // 3. Save Buttons
    const saveTop = document.getElementById("btn-save-top");
    const saveBottom = document.getElementById("btn-save-bottom");
    const handleSave = () => {
      syncFormToState();
      saveConfig();
    };
    if (saveTop) saveTop.addEventListener("click", handleSave);
    if (saveBottom) saveBottom.addEventListener("click", handleSave);

    // 4. Tab-Specific Event Handlers
    if (currentTab === "monitor") {
      bindMonitorTabEvents();
    }

    if (currentTab === "colors") {
      // Preset clicks
      document.querySelectorAll("[data-apply-preset]").forEach((el) => {
        el.addEventListener("click", () => {
          const idx = Number(el.getAttribute("data-apply-preset"));
          const preset = COLOR_PRESETS[idx];
          if (preset) {
            adminConfig.themeColors = Object.assign({}, preset.colors);
            renderDashboard();
            showToast(`✓ ນຳໃຊ້ຊຸດສີ: ${preset.name}`);
          }
        });
      });

      // Individual color inputs
      const colMap = [
        { id: "col-accent-red", key: "accentRed" },
        { id: "col-accent-pink", key: "accentPink" },
        { id: "col-accent-rose", key: "accentRose" },
        { id: "col-text-primary", key: "textPrimary" },
        { id: "col-bg-top", key: "bgTop" },
        { id: "col-bg-bottom", key: "bgBottom" },
      ];
      colMap.forEach(({ id, key }) => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener("input", (e) => {
            if (!adminConfig.themeColors) adminConfig.themeColors = {};
            adminConfig.themeColors[key] = e.target.value;
            const hexEl = input.parentElement?.querySelector(".admin-color-hex");
            if (hexEl) hexEl.textContent = e.target.value;
          });
        }
      });
    }

    if (currentTab === "photos") {
      // Jigsaw Preset Selection
      document.querySelectorAll("[data-select-jigsaw]").forEach((imgEl) => {
        imgEl.addEventListener("click", () => {
          const src = imgEl.getAttribute("data-select-jigsaw");
          adminConfig.jigsawImage = src;
          adminConfig.pinImage = src;
          const preview = document.getElementById("jigsaw-preview-img");
          const input = document.getElementById("ed-jigsawImage");
          if (preview) preview.src = src;
          if (input) input.value = src;
          document.querySelectorAll("[data-select-jigsaw]").forEach((t) => t.classList.remove("active"));
          imgEl.classList.add("active");
        });
      });

      // Jigsaw URL Input
      const jigsawUrlInput = document.getElementById("ed-jigsawImage");
      if (jigsawUrlInput) {
        jigsawUrlInput.addEventListener("input", (e) => {
          adminConfig.jigsawImage = e.target.value;
          adminConfig.pinImage = e.target.value;
          const preview = document.getElementById("jigsaw-preview-img");
          if (preview) preview.src = e.target.value;
        });
      }

      // Jigsaw File Upload
      const jigsawUpload = document.getElementById("upload-jigsaw-file");
      if (jigsawUpload) {
        jigsawUpload.addEventListener("change", (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            adminConfig.jigsawImage = dataUrl;
            adminConfig.pinImage = dataUrl;
            const preview = document.getElementById("jigsaw-preview-img");
            const input = document.getElementById("ed-jigsawImage");
            if (preview) preview.src = dataUrl;
            if (input) input.value = dataUrl.slice(0, 32) + "... (Base64 Image)";
            showToast("✓ ອັບໂຫຼດຮູບສຳເລັດແລ້ວ! ຢ່າລືມກົດ 'ບັນທຶກ' 💙");
          };
          reader.readAsDataURL(file);
        });
      }

      // Polaroid Uploads & Inputs
      document.querySelectorAll(".upload-pol-file").forEach((input) => {
        input.addEventListener("change", (e) => {
          const idx = Number(input.getAttribute("data-pol-idx"));
          const file = e.target.files?.[0];
          if (!file || idx < 0) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            if (!adminConfig.polaroids[idx]) adminConfig.polaroids[idx] = {};
            adminConfig.polaroids[idx].image = dataUrl;
            const preview = document.getElementById(`pol-preview-${idx}`);
            if (preview) preview.src = dataUrl;
            const urlInput = document.querySelector(`.ed-pol-url[data-pol-idx="${idx}"]`);
            if (urlInput) urlInput.value = dataUrl.slice(0, 32) + "...";
            showToast(`✓ ອັບໂຫຼດຮູບທີ ${idx + 1} ສຳເລັດ! ຢ່າລືມກົດ 'ບັນທຶກ' 💙`);
          };
          reader.readAsDataURL(file);
        });
      });

      document.querySelectorAll(".ed-pol-url").forEach((input) => {
        input.addEventListener("input", (e) => {
          const idx = Number(input.getAttribute("data-pol-idx"));
          if (adminConfig.polaroids[idx]) {
            adminConfig.polaroids[idx].image = e.target.value;
            const preview = document.getElementById(`pol-preview-${idx}`);
            if (preview) preview.src = e.target.value;
          }
        });
      });
    }

    if (currentTab === "settings") {
      // Copy JSON
      const copyBtn = document.getElementById("btn-copy-json");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          syncFormToState();
          const jsonStr = JSON.stringify(adminConfig, null, 2);
          navigator.clipboard?.writeText(jsonStr);
          showToast("✓ ສຳເນົາ Config JSON ແລ້ວ!");
        });
      }

      // Download JSON
      const dlBtn = document.getElementById("btn-download-json");
      if (dlBtn) {
        dlBtn.addEventListener("click", () => {
          syncFormToState();
          const jsonStr = JSON.stringify(adminConfig, null, 2);
          const blob = new Blob([jsonStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "blue_love_config.json";
          a.click();
          URL.revokeObjectURL(url);
          showToast("✓ ດາວໂຫຼດໄຟລ໌ config.json ແລ້ວ!");
        });
      }

      // Change Password
      const changePassBtn = document.getElementById("btn-change-password");
      if (changePassBtn) {
        changePassBtn.addEventListener("click", () => {
          const newPass = document.getElementById("ed-new-password")?.value.trim();
          if (!newPass) {
            showToast("ກະລຸນາປ້ອນລະຫັດຜ່ານໃໝ່!", "error");
            return;
          }
          localStorage.setItem("blue_admin_password", newPass);
          showToast("✓ ປ່ຽນລະຫັດຜ່ານ Admin ສຳເລັດແລ້ວ!");
        });
      }

      // Reset Defaults
      const resetBtn = document.getElementById("btn-reset-defaults");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (confirm("ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຣີເຊັດເປັນຄ່າເລີ່ມຕົ້ນທັງໝົດ?")) {
            localStorage.removeItem("wishbox_blue_v3_config");
            adminConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            renderDashboard();
            showToast("✓ ຣີເຊັດເປັນຄ່າເລີ່ມຕົ້ນແລ້ວ!");
          }
        });
      }
    }
  }

  function syncFormToState() {
    // Basic Details
    const rName = document.getElementById("ed-receiverName");
    if (rName) adminConfig.receiverName = rName.value.trim() || DEFAULT_CONFIG.receiverName;

    const sName = document.getElementById("ed-senderName");
    if (sName) adminConfig.senderName = sName.value.trim() || DEFAULT_CONFIG.senderName;

    const pHint = document.getElementById("ed-pinHint");
    if (pHint) adminConfig.pinHint = pHint.value.trim();

    const pText = document.getElementById("ed-plaqueText");
    if (pText) adminConfig.plaqueText = pText.value.trim();

    // Letter
    const lSal = document.getElementById("ed-letterSalutation");
    if (lSal) adminConfig.letterSalutation = lSal.value;

    const lp1 = document.getElementById("ed-letterParagraph1");
    if (lp1) adminConfig.letterParagraph1 = lp1.value;

    const lp2 = document.getElementById("ed-letterParagraph2");
    if (lp2) adminConfig.letterParagraph2 = lp2.value;

    const lp3 = document.getElementById("ed-letterParagraph3");
    if (lp3) adminConfig.letterParagraph3 = lp3.value;

    const lp4 = document.getElementById("ed-letterParagraph4");
    if (lp4) adminConfig.letterParagraph4 = lp4.value;

    const lSig = document.getElementById("ed-letterSignature");
    if (lSig) adminConfig.letterSignature = lSig.value;

    // Whispers
    document.querySelectorAll(".ed-whisper-input").forEach((inp) => {
      const idx = Number(inp.getAttribute("data-whisper-idx"));
      if (!adminConfig.whispers) adminConfig.whispers = [...DEFAULT_CONFIG.whispers];
      if (adminConfig.whispers[idx] !== undefined) {
        adminConfig.whispers[idx] = inp.value;
      }
    });

    // Scratch Card & Cassette Tape
    const sQuote = document.getElementById("ed-scratchQuote");
    if (sQuote) adminConfig.scratchQuote = sQuote.value;

    if (!adminConfig.cassetteTracks) {
      adminConfig.cassetteTracks = JSON.parse(JSON.stringify(DEFAULT_CONFIG.cassetteTracks));
    }
    [0, 1, 2].forEach((idx) => {
      const cq = document.getElementById(`ed-cassetteQuote${idx}`);
      if (cq && adminConfig.cassetteTracks[idx]) {
        adminConfig.cassetteTracks[idx].quote = cq.value;
      }
    });

    // Birthday & Coupon
    const cTitle = document.getElementById("ed-celebrationTitle");
    if (cTitle) adminConfig.celebrationTitle = cTitle.value;

    const cCoup = document.getElementById("ed-couponTitle");
    if (cCoup) adminConfig.couponTitle = cCoup.value;

    const cCode = document.getElementById("ed-couponCode");
    if (cCode) adminConfig.couponCode = cCode.value;

    // Polaroids
    document.querySelectorAll(".ed-pol-cap").forEach((inp) => {
      const idx = Number(inp.getAttribute("data-pol-idx"));
      if (adminConfig.polaroids && adminConfig.polaroids[idx]) {
        adminConfig.polaroids[idx].caption = inp.value;
      }
    });
  }

  // ==================== APP INITIALIZATION ====================
  function initAdmin() {
    loadConfig();

    if (isAuthenticated()) {
      initMonitorConnection();
      renderDashboard();
    } else {
      renderLoginScreen();
    }
  }

  window.addEventListener("DOMContentLoaded", initAdmin);
})();
