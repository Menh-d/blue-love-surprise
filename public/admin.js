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
  let currentTab = "colors"; // 'colors' | 'texts' | 'photos' | 'settings'

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
          renderDashboard();
        } else {
          renderLoginScreen("ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
        }
      });
    }
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
          <button type="button" class="admin-tab-item ${currentTab === "colors" ? "active" : ""}" data-tab="colors">
            🎨 1. ປັບແຕ່ງສີ (Colors & Theme)
          </button>
          <button type="button" class="admin-tab-item ${currentTab === "texts" ? "active" : ""}" data-tab="texts">
            ✍️ 2. ປັບແຕ່ງຂໍ້ຄວາມ (Texts & Content)
          </button>
          <button type="button" class="admin-tab-item ${currentTab === "photos" ? "active" : ""}" data-tab="photos">
            🖼️ 3. ປັບແຕ່ງຮູບພາບ (Photos & Gallery)
          </button>
          <button type="button" class="admin-tab-item ${currentTab === "settings" ? "active" : ""}" data-tab="settings">
            ⚙️ 4. ຕັ້ງຄ່າ & ສຳຮອງ (Settings)
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
    if (currentTab === "colors") return renderColorsTab();
    if (currentTab === "texts") return renderTextsTab();
    if (currentTab === "photos") return renderPhotosTab();
    if (currentTab === "settings") return renderSettingsTab();
    return "";
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

      <!-- Birthday Celebration & Coupon -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title">
            <span>🎂</span>
            <span>4. ຫົວຂໍ້ວັນເກີດ & ຄູປອງ (Page 4 Finale)</span>
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
      renderDashboard();
    } else {
      renderLoginScreen();
    }
  }

  window.addEventListener("DOMContentLoaded", initAdmin);
})();
