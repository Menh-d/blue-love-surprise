/**
 * BLUE LETTER — Admin CMS Application (/admin)
 * Implements all 10 required sections:
 * 1. Overview (Draft/Published status, missing personal asset checklist, quick links)
 * 2. Couple profile (Sender/recipient names, nicknames, couple photo, special date)
 * 3. Stage editor (Edit title/body/CTA/hint, stage-specific config, enable/disable, reorder)
 * 4. Memories (Add/remove timeline events, photo, date, caption, alt text, focal point)
 * 5. Music & voice (Upload BGM, featured song, voice note, transcript, volumes, preview)
 * 6. Gift (Coupon, message, gift photo/video, optional real appointment details)
 * 7. Appearance (Colors, font, effect intensity, reduced motion default)
 * 8. Responses (View visitor date choices, hearts, letter replies, JSON/CSV export, delete)
 * 9. Preview & Publish (Mobile/Desktop live preview iframe, stage jump, atomic publish/unpublish/rollback)
 * 10. Settings (Public vs Private Passphrase mode, change Admin password, JSON backup/restore, logout)
 */

(function () {
  "use strict";

  const adminState = {
    authenticated: false,
    adminUser: null,
    csrfToken: "",
    activeTab: "overview",
    draft: null,
    hasPassphrase: false,
    publishedVersionId: null,
    updatedAt: null,
    readiness: null,
    versions: [],
    media: [],
    responses: [],
    dirty: false,
    saving: false,
    statusBanner: null, // { type: 'success'|'error'|'info', text: '' }
    selectedStageId: null,
    previewDevice: "mobile", // 'mobile' | 'desktop'
    previewStageId: "",
  };

  const TABS = [
    { id: "overview", icon: "📊", label: "Overview (ພາບລວມ)" },
    { id: "profile", icon: "💑", label: "Couple Profile (ຂໍ້ມູນຄູ່ຮັກ)" },
    { id: "stages", icon: "💌", label: "Stage Editor (12 ດ່ານ)" },
    { id: "memories", icon: "⭐", label: "Memories (ຄວາມຊົງຈຳ)" },
    { id: "music", icon: "🎵", label: "Music & Voice (ເພງ & ສຽງ)" },
    { id: "gift", icon: "🎁", label: "Gift (ຂອງຂວັນ & ຄູປອງ)" },
    { id: "appearance", icon: "🎨", label: "Appearance (ສີ & ຮູບແບບ)" },
    { id: "responses", icon: "📬", label: "Responses (ຄຳຕອບຈາກແຟນ)" },
    { id: "publish", icon: "🚀", label: "Preview & Publish" },
    { id: "settings", icon: "⚙️", label: "Settings (ຕັ້ງຄ່າ & ລະຫັດ)" },
  ];

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  function markDirty() {
    adminState.dirty = true;
    const ind = document.getElementById("unsaved-indicator");
    if (ind) {
      ind.textContent = "● ມີການແກ້ໄຂທີ່ຍັງບໍ່ທັນບັນທຶກ (Unsaved changes)";
      ind.style.color = "#B85D00";
    }
  }

  function showBanner(type, text) {
    adminState.statusBanner = { type, text };
    const box = document.getElementById("admin-status-banner");
    if (box) {
      box.style.display = "block";
      box.style.background =
        type === "error" ? "#FFF2F2" : type === "success" ? "#E3F6EC" : "#EAF4FF";
      box.style.color =
        type === "error" ? "#A61B1B" : type === "success" ? "#145235" : "#183B63";
      box.style.borderColor =
        type === "error" ? "#F2A0A0" : type === "success" ? "#6BC497" : "#8CC8FF";
      box.textContent = text;
    }
  }

  // Warn before closing tab if unsaved changes exist
  window.addEventListener("beforeunload", (e) => {
    if (adminState.dirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  // ==================== API CALLS ====================
  async function checkAuthAndLoad() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.authenticated) {
        adminState.authenticated = false;
        renderLoginScreen();
        return;
      }
      adminState.authenticated = true;
      adminState.adminUser = data.admin;
      adminState.csrfToken = data.csrf_token;
      await fetchAdminStoryData();
      renderAdminShell();
    } catch (e) {
      renderLoginScreen("ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້");
    }
  }

  async function fetchAdminStoryData() {
    const res = await fetch("/api/admin/story");
    if (!res.ok) throw new Error("Failed to load story");
    const data = await res.json();
    adminState.draft = data.draft;
    adminState.hasPassphrase = data.has_passphrase;
    adminState.publishedVersionId = data.published_version_id;
    adminState.updatedAt = data.updated_at;
    adminState.readiness = data.readiness;
    adminState.versions = data.versions || [];
    adminState.media = data.media || [];
    if (!adminState.selectedStageId && adminState.draft.stages.length) {
      adminState.selectedStageId = adminState.draft.stages[0].id;
    }

    const respRes = await fetch("/api/admin/responses");
    if (respRes.ok) {
      const respData = await respRes.json();
      adminState.responses = respData.responses || [];
    }
  }

  async function saveDraftToServer(extraFields = {}) {
    if (!adminState.draft) return false;
    adminState.saving = true;
    renderTopBarStatus();

    const payload = {
      slug: adminState.draft.slug,
      sender_name: adminState.draft.sender_name,
      recipient_name: adminState.draft.recipient_name,
      sender_nickname: adminState.draft.sender_nickname,
      recipient_nickname: adminState.draft.recipient_nickname,
      couple_photo_media_id: adminState.draft.couple_photo_media_id,
      special_date: adminState.draft.special_date,
      access_mode: adminState.draft.access_mode,
      theme: adminState.draft.theme,
      music: adminState.draft.music,
      gift: adminState.draft.gift,
      stages: adminState.draft.stages,
      memories: adminState.draft.memories,
      ...extraFields,
    };

    try {
      const res = await fetch("/api/admin/story", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": adminState.csrfToken,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      adminState.saving = false;
      if (!res.ok) {
        showBanner("error", `⚠️ ບັນທຶກບໍ່ສຳເລັດ: ${data.error || "Unknown error"}`);
        renderTopBarStatus();
        return false;
      }
      adminState.draft = data.draft;
      adminState.readiness = data.readiness;
      adminState.updatedAt = data.updated_at;
      adminState.dirty = false;
      showBanner("success", data.message || "✓ ບັນທຶກຮ່າງ (Save Draft) ສຳເລັດແລ້ວ 💙");
      renderAdminShell();
      return true;
    } catch (err) {
      adminState.saving = false;
      showBanner("error", "⚠️ ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ Server (ຂໍ້ມູນທີ່ພິມໄວ້ຍັງຢູ່ຄົບ)");
      renderTopBarStatus();
      return false;
    }
  }

  function uploadMediaWithProgress(file, altText, focalPoint, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/media", true);
      xhr.setRequestHeader("X-CSRF-Token", adminState.csrfToken);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && typeof onProgress === "function") {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data.media);
          } else {
            reject(new Error(data.error || "ອັບໂຫຼດໄຟລ໌ບໍ່ສຳເລັດ"));
          }
        } catch (err) {
          reject(new Error("Invalid response from server"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));

      const fd = new FormData();
      fd.append("file", file);
      fd.append("alt_text", altText || "");
      fd.append("focal_point", focalPoint || "50% 50%");
      xhr.send(fd);
    });
  }

  // ==================== LOGIN SCREEN ====================
  function renderLoginScreen(errMsg = "") {
    const root = document.getElementById("admin-root");
    root.innerHTML = `
      <main style="max-width:440px; margin:70px auto; padding:0 16px;">
        <div class="stage-card">
          <div class="stage-badge">🔐 BLUE LETTER CMS</div>
          <h1 class="stage-title" style="font-size:1.5rem;">ເຂົ້າສູ່ລະບົບ Admin 💙</h1>
          <p style="font-size:0.94rem; color:var(--text-muted); margin-bottom:18px;">
            ຈັດການຂໍ້ຄວາມ 12 ດ່ານ, ຮູບຄວາມຊົງຈຳ, ເພງ, ຂອງຂວັນ ແລະ ອ່ານຄຳຕອບຈາກແຟນ.
          </p>
          ${
            errMsg
              ? `<div style="background:#FFF2F2; color:#A61B1B; padding:10px 14px; border-radius:12px; margin-bottom:14px; font-size:0.9rem;">
                  ⚠️ ${escapeHtml(errMsg)}
                </div>`
              : ""
          }
          <form id="admin-login-form">
            <div class="field-group">
              <label for="login-email">ອີເມວ Admin (Email)</label>
              <input type="email" id="login-email" class="input-field" value="admin@blueletter.local" required />
            </div>
            <div class="field-group">
              <label for="login-password">ລະຫັດຜ່ານ (Password)</label>
              <input type="password" id="login-password" class="input-field" placeholder="ໃສ່ລະຫັດຜ່ານ Admin..." required />
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
              ເຂົ້າສູ່ລະບົບ Admin 💙
            </button>
          </form>
          <div style="margin-top:16px; text-align:center;">
            <a href="/" style="color:var(--cta-blue); font-size:0.9rem; font-weight:600;">← ກັບໄປໜ້າເວັບຫຼັກ</a>
          </div>
        </div>
      </main>
    `;

    const form = document.getElementById("admin-login-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          renderLoginScreen(data.error || "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ");
          return;
        }
        adminState.authenticated = true;
        adminState.adminUser = data.admin;
        adminState.csrfToken = data.csrf_token;
        await fetchAdminStoryData();
        renderAdminShell();
      } catch (err) {
        renderLoginScreen("ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່");
      }
    });
  }

  // ==================== ADMIN SHELL ====================
  function renderTopBarStatus() {
    const ind = document.getElementById("unsaved-indicator");
    if (ind) {
      if (adminState.saving) {
        ind.textContent = "⏳ ກຳລັງບັນທຶກ...";
        ind.style.color = "var(--cta-blue)";
      } else if (adminState.dirty) {
        ind.textContent = "● ມີການແກ້ໄຂທີ່ຍັງບໍ່ທັນບັນທຶກ (Unsaved changes)";
        ind.style.color = "#B85D00";
      } else {
        ind.textContent = "✓ ບັນທຶກຮ່າງລ່າສຸດແລ້ວ";
        ind.style.color = "#1B7A48";
      }
    }
  }

  function renderAdminShell() {
    const root = document.getElementById("admin-root");
    const isPub = Boolean(adminState.publishedVersionId);
    const activeVer = adminState.versions.find((v) => v.id === adminState.publishedVersionId);

    root.innerHTML = `
      <div class="admin-layout">
        <aside class="admin-sidebar" aria-label="ເມນູຈັດການ Admin">
          <div style="padding:6px 10px 14px; border-bottom:1px solid var(--border-soft); margin-bottom:10px;">
            <div style="font-weight:700; font-size:1.1rem; color:var(--cta-blue);">💙 BLUE LETTER</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(
              adminState.adminUser ? adminState.adminUser.email : ""
            )}</div>
          </div>
          ${TABS.map(
            (t) => `
            <button type="button" class="admin-nav-btn ${
              adminState.activeTab === t.id ? "active" : ""
            }" data-tab="${t.id}">
              <span>${t.icon}</span>
              <span>${escapeHtml(t.label)}</span>
            </button>
          `
          ).join("")}
        </aside>

        <div class="admin-main">
          <header class="admin-topbar">
            <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <span class="badge-status ${isPub ? "badge-published" : "badge-draft"}">
                ${
                  isPub
                    ? `🟢 Published (${activeVer ? "v" + activeVer.version_number : "Live"})`
                    : "🟡 Unpublished (Draft Only)"
                }
              </span>
              <span id="unsaved-indicator" style="font-size:0.88rem; font-weight:600;"></span>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <a href="/?preview=1" target="_blank" class="btn btn-secondary" style="min-height:40px; padding:6px 14px; font-size:0.9rem;">
                👁️ ເປີດ Preview
              </a>
              <button type="button" class="btn btn-primary" id="btn-global-save-draft" style="min-height:40px; padding:6px 18px; font-size:0.9rem;">
                💾 Save Draft (ບັນທຶກຮ່າງ)
              </button>
            </div>
          </header>

          <div id="admin-status-banner" style="display:${
            adminState.statusBanner ? "block" : "none"
          }; padding:12px 16px; border-radius:14px; border:1px solid #8CC8FF; font-weight:600; font-size:0.94rem;">
            ${adminState.statusBanner ? escapeHtml(adminState.statusBanner.text) : ""}
          </div>

          <section class="admin-panel" id="admin-tab-content"></section>
        </div>
      </div>
    `;

    renderTopBarStatus();

    root.querySelectorAll(".admin-nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        adminState.activeTab = btn.getAttribute("data-tab");
        adminState.statusBanner = null;
        renderAdminShell();
      });
    });

    document.getElementById("btn-global-save-draft").addEventListener("click", () => {
      saveDraftToServer();
    });

    const contentBox = document.getElementById("admin-tab-content");
    switch (adminState.activeTab) {
      case "overview":
        renderTabOverview(contentBox);
        break;
      case "profile":
        renderTabProfile(contentBox);
        break;
      case "stages":
        renderTabStages(contentBox);
        break;
      case "memories":
        renderTabMemories(contentBox);
        break;
      case "music":
        renderTabMusic(contentBox);
        break;
      case "gift":
        renderTabGift(contentBox);
        break;
      case "appearance":
        renderTabAppearance(contentBox);
        break;
      case "responses":
        renderTabResponses(contentBox);
        break;
      case "publish":
        renderTabPublish(contentBox);
        break;
      case "settings":
        renderTabSettings(contentBox);
        break;
    }
  }

  // ==================== TAB 1: OVERVIEW ====================
  function renderTabOverview(box) {
    const r = adminState.readiness || {};
    const d = adminState.draft;
    const publicUrl = `${window.location.origin}/s/${encodeURIComponent(d.slug)}`;

    box.innerHTML = `
      <h2 style="margin-top:0;">📊 ພາບລວມຂອງເວັບ (Overview)</h2>
      <div class="form-grid" style="margin-bottom:20px;">
        <div style="background:#EEF6FF; padding:16px; border-radius:16px; border:1px solid var(--border-soft);">
          <div style="font-size:0.85rem; color:var(--text-muted);">🔗 ລິ້ງສຳລັບສົ່ງໃຫ້ແຟນ</div>
          <div style="font-weight:700; word-break:break-all; margin:4px 0 8px;">
            <a href="${escapeHtml(publicUrl)}" target="_blank" style="color:var(--cta-blue);">${escapeHtml(
      publicUrl
    )}</a>
          </div>
          <div style="font-size:0.85rem;">ໂໝດການເຂົ້າເບິ່ງ: <strong>${
            d.access_mode === "passphrase" ? "🔒 ລັອກດ້ວຍລະຫັດຜ່ານ (Private)" : "🌐 ເປີດສາທາລະນະຕາມລິ້ງ"
          }</strong></div>
        </div>

        <div style="background:#EEF6FF; padding:16px; border-radius:16px; border:1px solid var(--border-soft);">
          <div style="font-size:0.85rem; color:var(--text-muted);">💌 ດ່ານທີ່ເປີດໃຊ້ງານ</div>
          <div style="font-size:1.4rem; font-weight:700; color:var(--cta-blue); margin:4px 0;">
            ${r.enabled_stage_count || 0} / ${r.total_stage_count || 12} ດ່ານ
          </div>
          <div style="font-size:0.85rem;">ຄຳຕອບຈາກແຟນທັງໝົດ: <strong>${adminState.responses.length} ລາຍການ</strong></div>
        </div>
      </div>

      ${
        r.blocking_errors && r.blocking_errors.length
          ? `
        <div style="background:#FFF2F2; border:1px solid #F2A0A0; padding:16px; border-radius:16px; margin-bottom:16px;">
          <strong style="color:#A61B1B;">⛔ ຂໍ້ມູນສຳຄັນທີ່ຕ້ອງແກ້ໄຂກ່ອນ Publish:</strong>
          <ul style="margin:8px 0 0; padding-left:20px; color:#A61B1B;">
            ${r.blocking_errors.map((e) => `<li>${escapeHtml(e)}</li>`).join("")}
          </ul>
        </div>
      `
          : ""
      }

      <div style="background:#FFFDF5; border:1px solid #F0D98C; padding:16px; border-radius:16px;">
        <strong>📝 ລາຍການກວດສອບຂໍ້ມູນສ່ວນຕົວ (Checklist ກ່ອນສົ່ງໃຫ້ແຟນ):</strong>
        ${
          r.placeholder_warnings && r.placeholder_warnings.length
            ? `
          <ul style="margin:8px 0 0; padding-left:20px;">
            ${r.placeholder_warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}
          </ul>
        `
            : `<p style="margin:8px 0 0; color:#1B7A48; font-weight:600;">✓ ປ່ຽນຂໍ້ມູນສ່ວນຕົວຄົບຖ້ວນແລ້ວ ພ້ອມສົ່ງເຊີໄພຣສ໌!</p>`
        }
      </div>
    `;
  }

  // ==================== TAB 2: COUPLE PROFILE ====================
  function renderTabProfile(box) {
    const d = adminState.draft;
    const imageMedia = adminState.media.filter((m) => m.mime_type.startsWith("image/"));

    box.innerHTML = `
      <h2 style="margin-top:0;">💑 ຂໍ້ມູນຄູ່ຮັກ (Couple Profile)</h2>
      <div class="form-grid">
        <div class="field-group">
          <label>ຊື່ຜູ້ຮັບ (ຊື່ແຟນ ທີ່ສະແດງໜ້າຊອງຈົດໝາຍ)</label>
          <input type="text" id="prof-recipient-name" class="input-field" value="${escapeHtml(
            d.recipient_name
          )}" />
        </div>
        <div class="field-group">
          <label>ຊື່ຜູ້ສົ່ງ (ຊື່ຂອງເຈົ້າ)</label>
          <input type="text" id="prof-sender-name" class="input-field" value="${escapeHtml(
            d.sender_name
          )}" />
        </div>
        <div class="field-group">
          <label>ຄຳເອີ້ນແທນຜູ້ຮັບ (ເຊັ່ນ: ເຈົ້າ, ທີ່ຮັກ, ຄົນດີ)</label>
          <input type="text" id="prof-recipient-nick" class="input-field" value="${escapeHtml(
            d.recipient_nickname
          )}" />
        </div>
        <div class="field-group">
          <label>ຄຳເອີ້ນແທນຜູ້ສົ່ງ (ເຊັ່ນ: ຂ້ອຍ, ເค้า)</label>
          <input type="text" id="prof-sender-nick" class="input-field" value="${escapeHtml(
            d.sender_nickname
          )}" />
        </div>
        <div class="field-group">
          <label>ວັນສຳຄັນ / ວັນຄົບຮອບ (ສະແດງໃນຈົດໝາຍ)</label>
          <input type="text" id="prof-special-date" class="input-field" value="${escapeHtml(
            d.special_date
          )}" placeholder="ເຊັ່ນ: 14 ກຸມພາ 2026" />
        </div>
        <div class="field-group">
          <label>URL Slug ຂອງເລື່ອງລາວ</label>
          <input type="text" id="prof-slug" class="input-field" value="${escapeHtml(d.slug)}" />
        </div>
      </div>

      <hr style="border:none; border-top:1px solid var(--border-soft); margin:20px 0;" />

      <h3>📸 ຮູບຄູ່ຫຼັກ (ໃຊ້ໃນໜ້າເພງ, ຕໍ່ຮູບ Puzzle ແລະ ຈົດໝາຍສຸດທ້າຍ)</h3>
      <div class="field-group">
        <label>ເລືອກຈາກຮູບທີ່ອັບໂຫຼດແລ້ວ</label>
        <select id="prof-couple-photo-select" class="input-field">
          <option value="">-- ໃຊ້ຮູບ Illustration ມາດຕະຖານ --</option>
          ${imageMedia
            .map(
              (m) =>
                `<option value="${escapeHtml(m.id)}" ${
                  d.couple_photo_media_id === m.id ? "selected" : ""
                }>${escapeHtml(m.original_name)} (${Math.round(m.bytes / 1024)} KB)</option>`
            )
            .join("")}
        </select>
      </div>

      <div style="background:#F4F9FF; padding:16px; border-radius:16px; border:1px dashed var(--primary-blue);">
        <label style="font-weight:600; display:block; margin-bottom:8px;">ອັບໂຫຼດຮູບຄູ່ໃໝ່ (JPG/PNG/WebP ສູງສຸດ 10MB)</label>
        <input type="file" id="prof-upload-file" accept="image/*" />
        <div id="prof-upload-progress" style="font-size:0.88rem; margin-top:6px; color:var(--cta-blue);"></div>
      </div>
    `;

    const bindInput = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          d[key] = el.value;
          markDirty();
        });
      }
    };
    bindInput("prof-recipient-name", "recipient_name");
    bindInput("prof-sender-name", "sender_name");
    bindInput("prof-recipient-nick", "recipient_nickname");
    bindInput("prof-sender-nick", "sender_nickname");
    bindInput("prof-special-date", "special_date");
    bindInput("prof-slug", "slug");

    document.getElementById("prof-couple-photo-select").addEventListener("change", (e) => {
      d.couple_photo_media_id = e.target.value || null;
      markDirty();
    });

    document.getElementById("prof-upload-file").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const progEl = document.getElementById("prof-upload-progress");
      try {
        const mediaObj = await uploadMediaWithProgress(file, "ຮູບຄູ່ຂອງເຮົາ", "50% 50%", (pct) => {
          progEl.textContent = `ກຳລັງອັບໂຫຼດ... ${pct}%`;
        });
        adminState.media.unshift(mediaObj);
        d.couple_photo_media_id = mediaObj.id;
        d.couple_photo = mediaObj;
        markDirty();
        progEl.textContent = "✓ ອັບໂຫຼດຮູບຄູ່ສຳເລັດແລ້ວ (ກົດ Save Draft ເພື່ອບັນທຶກ)";
        renderTabProfile(box);
      } catch (err) {
        progEl.textContent = `⚠️ ${err.message}`;
      }
    });
  }

  // ==================== TAB 3: STAGE EDITOR ====================
  function renderTabStages(box) {
    const stages = adminState.draft.stages;
    const selected = stages.find((s) => s.id === adminState.selectedStageId) || stages[0];
    if (selected) adminState.selectedStageId = selected.id;

    box.innerHTML = `
      <h2 style="margin-top:0;">💌 ຈັດການທັງ 12 ດ່ານ (Stage Editor)</h2>
      <p style="font-size:0.9rem; color:var(--text-muted); margin-top:0;">
        ເປີດ/ປິດດ່ານ, ຈັດລຳດັບ (Reorder) ແລະ ແກ້ໄຂຂໍ້ຄວາມ/ຄຳຖາມຂອງແຕ່ລະດ່ານ. (ຕ້ອງເປີດຢ່າງໜ້ອຍ 8 ດ່ານ ແລະ ຮັກສາດ່ານເລີ່ມ/ດ່ານຈົບ)
      </p>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap:20px;">
        <!-- Left: Stage List & Reorder -->
        <div>
          ${stages
            .map(
              (st, idx) => `
              <div class="stage-item-row" style="border-color:${
                st.id === selected.id ? "var(--cta-blue)" : "var(--border-soft)"
              }; background:${st.id === selected.id ? "#EAF4FF" : "#F9FCFF"};">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                  <button type="button" class="btn-select-stage" data-id="${escapeHtml(
                    st.id
                  )}" style="background:none; border:none; text-align:left; font-family:var(--font-lao); font-weight:700; font-size:0.96rem; cursor:pointer; color:var(--text-navy); flex:1;">
                    #${idx + 1} ${escapeHtml(st.title)}
                  </button>
                  <label style="font-size:0.82rem; display:flex; align-items:center; gap:4px; cursor:pointer;">
                    <input type="checkbox" class="chk-stage-enable" data-id="${escapeHtml(st.id)}" ${
                st.enabled ? "checked" : ""
              } />
                    ເປີດ
                  </label>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:0.8rem; color:var(--text-muted);">
                  <span>Type: <code>${escapeHtml(st.type)}</code></span>
                  <div style="display:flex; gap:4px;">
                    <button type="button" class="btn-move-up" data-idx="${idx}" ${
                idx === 0 ? "disabled" : ""
              } style="cursor:pointer; border:1px solid var(--border-soft); background:#FFF; border-radius:6px; padding:2px 8px;">↑</button>
                    <button type="button" class="btn-move-down" data-idx="${idx}" ${
                idx === stages.length - 1 ? "disabled" : ""
              } style="cursor:pointer; border:1px solid var(--border-soft); background:#FFF; border-radius:6px; padding:2px 8px;">↓</button>
                  </div>
                </div>
              </div>
            `
            )
            .join("")}
        </div>

        <!-- Right: Active Stage Form -->
        ${
          selected
            ? `
          <div style="background:#F6FAFF; padding:18px; border-radius:18px; border:1px solid var(--border-soft);">
            <h3 style="margin-top:0;">✏️ ແກ້ໄຂ: ${escapeHtml(selected.title)}</h3>
            <div class="field-group">
              <label>ຫົວຂໍ້ດ່ານ (Title)</label>
              <input type="text" id="st-title" class="input-field" value="${escapeHtml(selected.title)}" />
            </div>
            <div class="field-group">
              <label>ຂໍ້ຄວາມຫຼັກ (Body)</label>
              <textarea id="st-body" class="textarea-field" rows="4">${escapeHtml(selected.body)}</textarea>
            </div>
            <div class="field-group">
              <label>ຂໍ້ຄວາມປຸ່ມໄປຕໍ່ (CTA Button)</label>
              <input type="text" id="st-cta" class="input-field" value="${escapeHtml(selected.cta)}" />
            </div>
            <div class="field-group">
              <label>ຄຳໃບ້ / ຄຳແນະນຳ (Hint)</label>
              <input type="text" id="st-hint" class="input-field" value="${escapeHtml(selected.hint || "")}" />
            </div>

            ${renderStageSpecificConfigEditor(selected)}
          </div>
        `
            : ""
        }
      </div>
    `;

    box.querySelectorAll(".btn-select-stage").forEach((btn) => {
      btn.addEventListener("click", () => {
        adminState.selectedStageId = btn.getAttribute("data-id");
        renderTabStages(box);
      });
    });

    box.querySelectorAll(".chk-stage-enable").forEach((chk) => {
      chk.addEventListener("change", () => {
        const id = chk.getAttribute("data-id");
        const st = stages.find((s) => s.id === id);
        if (st) {
          st.enabled = chk.checked;
          markDirty();
        }
      });
    });

    const swapPositions = (i, j) => {
      const tmp = stages[i];
      stages[i] = stages[j];
      stages[j] = tmp;
      stages.forEach((s, idx) => {
        s.position = idx + 1;
      });
      markDirty();
      renderTabStages(box);
    };

    box.querySelectorAll(".btn-move-up").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        if (idx > 0) swapPositions(idx, idx - 1);
      });
    });

    box.querySelectorAll(".btn-move-down").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        if (idx < stages.length - 1) swapPositions(idx, idx + 1);
      });
    });

    if (selected) {
      ["title", "body", "cta", "hint"].forEach((field) => {
        const el = document.getElementById(`st-${field}`);
        if (el) {
          el.addEventListener("input", () => {
            selected[field] = el.value;
            markDirty();
          });
        }
      });
      wireStageSpecificConfigEditor(selected);
    }
  }

  function renderStageSpecificConfigEditor(stage) {
    const cfg = stage.config || {};
    const imageMedia = adminState.media.filter((m) => m.mime_type.startsWith("image/"));
    const choices = Array.isArray(cfg.icon_choices) ? cfg.icon_choices : [];

    let html = `
      <hr style="border:none; border-top:1px solid var(--border-soft); margin:14px 0;" />
      <h4 style="margin-bottom:8px;">✨ ຄຳຖາມ & ຕົວເລືອກ Icon 3 ອັນ (ສຳລັບດ່ານນີ້)</h4>
      <div class="field-group">
        <label>ຄຳຖາມໃນດ່ານ (Question)</label>
        <input type="text" id="cfg-stage-question" class="input-field" value="${escapeHtml(
          cfg.question || ""
        )}" />
      </div>
      ${choices
        .map(
          (ch, idx) => `
        <div style="background:#F8FBFF; border:1px solid var(--border-soft); border-radius:12px; padding:10px; margin-bottom:10px;">
          <div style="font-weight:700; font-size:0.86rem; margin-bottom:6px; color:var(--cta-blue);">ຕົວເລືອກ Icon ທີ #${
            idx + 1
          }</div>
          <div class="form-grid" style="margin-bottom:6px;">
            <div class="field-group" style="margin-bottom:0;">
              <label>Icon (Emoji)</label>
              <input type="text" class="input-field cfg-ic-icon" data-idx="${idx}" value="${escapeHtml(
            ch.icon || "💙"
          )}" />
            </div>
            <div class="field-group" style="margin-bottom:0;">
              <label>ຊື່ຕົວເລືອກ (Label)</label>
              <input type="text" class="input-field cfg-ic-label" data-idx="${idx}" value="${escapeHtml(
            ch.label || ""
          )}" />
            </div>
          </div>
          <div class="field-group" style="margin-bottom:0;">
            <label>ຂໍ້ຄວາມເຊື່ອມຕໍ່ຫຼັງວາງດາວ (Bridge Text)</label>
            <input type="text" class="input-field cfg-ic-bridge" data-idx="${idx}" value="${escapeHtml(
            ch.bridge_text || ""
          )}" />
          </div>
        </div>
      `
        )
        .join("")}

      <div class="form-grid" style="margin-top:10px;">
        <div class="field-group">
          <label>ຮູບພາບປະຈຳດ່ານ (ສຳລັບດ່ານ 3–10)</label>
          <select id="cfg-stage-photo" class="input-field">
            <option value="">-- ບໍ່ມີຮູບປະຈຳດ່ານ --</option>
            ${imageMedia
              .map(
                (img) =>
                  `<option value="${escapeHtml(img.id)}" ${
                    cfg.photo_media_id === img.id ? "selected" : ""
                  }>${escapeHtml(img.original_name)}</option>`
              )
              .join("")}
          </select>
        </div>
        <div class="field-group">
          <label>ຄຳບັນຍາຍໃຕ້ຮູບປະຈຳດ່ານ (Photo Caption)</label>
          <input type="text" id="cfg-stage-photo-caption" class="input-field" value="${escapeHtml(
            cfg.photo_caption || ""
          )}" />
        </div>
      </div>
    `;

    if (stage.type === "final_letter" || stage.position === 12) {
      html += `
        <hr style="border:none; border-top:1px solid var(--border-soft); margin:14px 0;" />
        <h4>🎂 ຈົດໝາຍອວຍພອນວັນເກີດໜ້າສຸດທ້າຍ (HAPPY BIRTHDAY Letter)</h4>
        <textarea id="cfg-birthday-letter" class="textarea-field" rows="6">${escapeHtml(
          cfg.birthday_letter || ""
        )}</textarea>
      `;
    }

    return html;
  }

  function wireStageSpecificConfigEditor(stage) {
    if (!stage.config) stage.config = {};
    const cfg = stage.config;

    const qEl = document.getElementById("cfg-stage-question");
    if (qEl) {
      qEl.addEventListener("input", () => {
        cfg.question = qEl.value;
        markDirty();
      });
    }

    document.querySelectorAll(".cfg-ic-icon").forEach((inp) => {
      inp.addEventListener("input", () => {
        const idx = Number(inp.getAttribute("data-idx"));
        if (cfg.icon_choices && cfg.icon_choices[idx]) {
          cfg.icon_choices[idx].icon = inp.value;
          markDirty();
        }
      });
    });

    document.querySelectorAll(".cfg-ic-label").forEach((inp) => {
      inp.addEventListener("input", () => {
        const idx = Number(inp.getAttribute("data-idx"));
        if (cfg.icon_choices && cfg.icon_choices[idx]) {
          cfg.icon_choices[idx].label = inp.value;
          markDirty();
        }
      });
    });

    document.querySelectorAll(".cfg-ic-bridge").forEach((inp) => {
      inp.addEventListener("input", () => {
        const idx = Number(inp.getAttribute("data-idx"));
        if (cfg.icon_choices && cfg.icon_choices[idx]) {
          cfg.icon_choices[idx].bridge_text = inp.value;
          markDirty();
        }
      });
    });

    const photoEl = document.getElementById("cfg-stage-photo");
    if (photoEl) {
      photoEl.addEventListener("change", () => {
        cfg.photo_media_id = photoEl.value || null;
        markDirty();
      });
    }

    const capEl = document.getElementById("cfg-stage-photo-caption");
    if (capEl) {
      capEl.addEventListener("input", () => {
        cfg.photo_caption = capEl.value;
        markDirty();
      });
    }

    const bdayEl = document.getElementById("cfg-birthday-letter");
    if (bdayEl) {
      bdayEl.addEventListener("input", () => {
        cfg.birthday_letter = bdayEl.value;
        markDirty();
      });
    }
  }

  // ==================== TAB 4: MEMORIES ====================
  function renderTabMemories(box) {
    const memories = adminState.draft.memories;
    const imageMedia = adminState.media.filter((m) => m.mime_type.startsWith("image/"));

    box.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        <h2 style="margin:0;">⭐ ຄວາມຊົງຈຳ Timeline (Memories)</h2>
        <button type="button" class="btn btn-secondary" id="btn-add-memory">+ ເພີ່ມເຫດການຄວາມຊົງຈຳ</button>
      </div>

      <div id="memories-editor-list">
        ${memories
          .map(
            (m, idx) => `
          <div class="stage-item-row" style="margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <strong>ເຫດການທີ #${idx + 1}</strong>
              <button type="button" class="btn btn-ghost btn-del-mem" data-idx="${idx}" style="min-height:34px; padding:4px 10px; color:#C93B3B;">ລຶບ</button>
            </div>
            <div class="form-grid">
              <div class="field-group">
                <label>ວັນທີ / ຊ່ວງເວລາ</label>
                <input type="text" class="input-field mem-date" data-idx="${idx}" value="${escapeHtml(
              m.date_label
            )}" />
              </div>
              <div class="field-group">
                <label>ຊື່ເຫດການ</label>
                <input type="text" class="input-field mem-title" data-idx="${idx}" value="${escapeHtml(
              m.title || ""
            )}" />
              </div>
            </div>
            <div class="field-group">
              <label>ຄຳບັນຍາຍຄວາມຊົງຈຳ (Caption)</label>
              <textarea class="textarea-field mem-caption" data-idx="${idx}" rows="2">${escapeHtml(
              m.caption
            )}</textarea>
            </div>
            <div class="field-group">
              <label>ຮູບພາບປະກອບ</label>
              <select class="input-field mem-media" data-idx="${idx}">
                <option value="">-- ໃຊ້ຮູບ Illustration ມາດຕະຖານ --</option>
                ${imageMedia
                  .map(
                    (img) =>
                      `<option value="${escapeHtml(img.id)}" ${
                        m.media_id === img.id ? "selected" : ""
                      }>${escapeHtml(img.original_name)}</option>`
                  )
                  .join("")}
              </select>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="background:#F4F9FF; padding:16px; border-radius:16px; border:1px dashed var(--primary-blue); margin-top:14px;">
        <strong>📤 ອັບໂຫຼດຮູບຄວາມຊົງຈຳເພີ່ມເຕີມ (ພ້ອມ Alt Text & Focal Point)</strong>
        <div class="form-grid" style="margin-top:10px;">
          <input type="text" id="mem-upload-alt" class="input-field" placeholder="Alt text (ຄຳອະທິບາຍຮູບສຳລັບ Screen Reader)" />
          <select id="mem-upload-focal" class="input-field">
            <option value="50% 50%">ຈຸດໂຟກັສກາງຮູບ (Center 50% 50%)</option>
            <option value="50% 25%">ໂຟກັສດ້ານເທິງ (ກັນຕັດໜ້າຄົນ 50% 25%)</option>
            <option value="50% 75%">ໂຟກັສດ້ານລຸ່ມ (50% 75%)</option>
          </select>
        </div>
        <input type="file" id="mem-upload-file" accept="image/*" style="margin-top:10px;" />
        <div id="mem-upload-status" style="font-size:0.88rem; margin-top:6px; color:var(--cta-blue);"></div>
      </div>
    `;

    document.getElementById("btn-add-memory").addEventListener("click", () => {
      memories.push({
        id: `mem-${Date.now()}`,
        date_label: "[ໃສ່ວັນທີ]",
        title: "ຄວາມຊົງຈຳໃໝ່",
        caption: "ຂຽນຄວາມຮູ້ສຶກໃນມື້ນັ້ນ...",
        media_id: null,
        position: memories.length + 1,
      });
      markDirty();
      renderTabMemories(box);
    });

    box.querySelectorAll(".btn-del-mem").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        memories.splice(idx, 1);
        markDirty();
        renderTabMemories(box);
      });
    });

    box.querySelectorAll(".mem-date").forEach((el) => {
      el.addEventListener("input", () => {
        memories[Number(el.getAttribute("data-idx"))].date_label = el.value;
        markDirty();
      });
    });
    box.querySelectorAll(".mem-title").forEach((el) => {
      el.addEventListener("input", () => {
        memories[Number(el.getAttribute("data-idx"))].title = el.value;
        markDirty();
      });
    });
    box.querySelectorAll(".mem-caption").forEach((el) => {
      el.addEventListener("input", () => {
        memories[Number(el.getAttribute("data-idx"))].caption = el.value;
        markDirty();
      });
    });
    box.querySelectorAll(".mem-media").forEach((el) => {
      el.addEventListener("change", () => {
        memories[Number(el.getAttribute("data-idx"))].media_id = el.value || null;
        markDirty();
      });
    });

    document.getElementById("mem-upload-file").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const alt = document.getElementById("mem-upload-alt").value;
      const focal = document.getElementById("mem-upload-focal").value;
      const stEl = document.getElementById("mem-upload-status");
      try {
        const mediaObj = await uploadMediaWithProgress(file, alt, focal, (pct) => {
          stEl.textContent = `ກຳລັງອັບໂຫຼດ... ${pct}%`;
        });
        adminState.media.unshift(mediaObj);
        stEl.textContent = "✓ ອັບໂຫຼດສຳເລັດ! ເລືອກຮູບນີ້ໃນລາຍການຄວາມຊົງຈຳໄດ້ເລີຍ";
        renderTabMemories(box);
      } catch (err) {
        stEl.textContent = `⚠️ ${err.message}`;
      }
    });
  }

  // ==================== TAB 5: MUSIC & VOICE ====================
  function renderTabMusic(box) {
    const m = adminState.draft.music || {};
    const audioMedia = adminState.media.filter((item) => item.mime_type.startsWith("audio/"));

    box.innerHTML = `
      <h2 style="margin-top:0;">🎵 ເພງພື້ນຫຼັງ & ສຽງອັດ (Music & Voice)</h2>
      <p style="font-size:0.9rem; color:var(--text-muted); margin-top:0;">
        ອັບໂຫຼດໄຟລ໌ສຽງ MP3/M4A/WAV ທີ່ເຈົ້າມີສິດໃຊ້ (ສູງສຸດ 20MB). ຫ້າມດຶງລິ້ງໂດຍກົງຈາກ YouTube/Spotify.
      </p>

      <div class="form-grid">
        <div class="field-group">
          <label>ໄຟລ໌ເພງພື້ນຫຼັງ (BGM)</label>
          <select id="mus-bgm-id" class="input-field">
            <option value="">-- ໃຊ້ສຽງ Soft Piano ໃນຕົວເຄື່ອງ --</option>
            ${audioMedia
              .map(
                (a) =>
                  `<option value="${escapeHtml(a.id)}" ${
                    m.bgm_media_id === a.id ? "selected" : ""
                  }>${escapeHtml(a.original_name)}</option>`
              )
              .join("")}
          </select>
        </div>
        <div class="field-group">
          <label>ໄຟລ໌ເພງພິເສດໃນດ່ານທີ 7 (Featured Song)</label>
          <select id="mus-song-id" class="input-field">
            <option value="">-- ຍັງບໍ່ໄດ້ເລືອກໄຟລ໌ MP3 --</option>
            ${audioMedia
              .map(
                (a) =>
                  `<option value="${escapeHtml(a.id)}" ${
                    m.featured_song_media_id === a.id ? "selected" : ""
                  }>${escapeHtml(a.original_name)}</option>`
              )
              .join("")}
          </select>
        </div>
        <div class="field-group">
          <label>ຊື່ເພງພິເສດ (ດ່ານທີ 7)</label>
          <input type="text" id="mus-song-title" class="input-field" value="${escapeHtml(
            m.featured_song_title || ""
          )}" />
        </div>
        <div class="field-group">
          <label>ຊື່ສິລະປິນ / ຜູ້ຮ້ອງ</label>
          <input type="text" id="mus-song-artist" class="input-field" value="${escapeHtml(
            m.featured_song_artist || ""
          )}" />
        </div>
      </div>

      <div class="field-group">
        <label>ໄຟລ໌ສຽງອັດຈາກຜູ້ສົ່ງ (Voice Note ໃນດ່ານທີ 7)</label>
        <select id="mus-voice-id" class="input-field">
          <option value="">-- ຍັງບໍ່ໄດ້ເລືອກໄຟລ໌ສຽງອັດ --</option>
          ${audioMedia
            .map(
              (a) =>
                `<option value="${escapeHtml(a.id)}" ${
                  m.voice_note_media_id === a.id ? "selected" : ""
                }>${escapeHtml(a.original_name)}</option>`
            )
            .join("")}
        </select>
      </div>

      <div class="field-group">
        <label>ຂໍ້ຄວາມຖອດສຽງອັດ (Voice Transcript ສຳລັບຄົນທີ່ບໍ່ສະດວກເປີດສຽງ)</label>
        <textarea id="mus-voice-transcript" class="textarea-field" rows="3">${escapeHtml(
          m.voice_note_transcript || ""
        )}</textarea>
      </div>

      <div style="background:#F4F9FF; padding:16px; border-radius:16px; border:1px dashed var(--primary-blue);">
        <label style="font-weight:600; display:block; margin-bottom:8px;">📤 ອັບໂຫຼດໄຟລ໌ສຽງໃໝ່ (MP3/M4A/WAV ສູງສຸດ 20MB)</label>
        <input type="file" id="mus-upload-file" accept="audio/*" />
        <div id="mus-upload-status" style="font-size:0.88rem; margin-top:6px; color:var(--cta-blue);"></div>
      </div>
    `;

    document.getElementById("mus-bgm-id").addEventListener("change", (e) => {
      m.bgm_media_id = e.target.value || null;
      markDirty();
    });
    document.getElementById("mus-song-id").addEventListener("change", (e) => {
      m.featured_song_media_id = e.target.value || null;
      markDirty();
    });
    document.getElementById("mus-song-title").addEventListener("input", (e) => {
      m.featured_song_title = e.target.value;
      markDirty();
    });
    document.getElementById("mus-song-artist").addEventListener("input", (e) => {
      m.featured_song_artist = e.target.value;
      markDirty();
    });
    document.getElementById("mus-voice-id").addEventListener("change", (e) => {
      m.voice_note_media_id = e.target.value || null;
      markDirty();
    });
    document.getElementById("mus-voice-transcript").addEventListener("input", (e) => {
      m.voice_note_transcript = e.target.value;
      markDirty();
    });

    document.getElementById("mus-upload-file").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const stEl = document.getElementById("mus-upload-status");
      try {
        const mediaObj = await uploadMediaWithProgress(file, file.name, "50% 50%", (pct) => {
          stEl.textContent = `ກຳລັງອັບໂຫຼດໄຟລ໌ສຽງ... ${pct}%`;
        });
        adminState.media.unshift(mediaObj);
        stEl.textContent = "✓ ອັບໂຫຼດໄຟລ໌ສຽງສຳເລັດແລ້ວ!";
        renderTabMusic(box);
      } catch (err) {
        stEl.textContent = `⚠️ ${err.message}`;
      }
    });
  }

  // ==================== TAB 6: GIFT ====================
  function renderTabGift(box) {
    const g = adminState.draft.gift || {};
    box.innerHTML = `
      <h2 style="margin-top:0;">🎁 ຕັ້ງຄ່າຂອງຂວັນ & ຄູປອງ (ດ່ານທີ 11)</h2>
      <div class="form-grid">
        <div class="field-group">
          <label>ຫົວຂໍ້ຂອງຂວັນ / ຄູປອງ</label>
          <input type="text" id="gift-title" class="input-field" value="${escapeHtml(
            g.coupon_title || ""
          )}" />
        </div>
        <div class="field-group">
          <label>ລາຍລະອຽດຄູປອງ</label>
          <input type="text" id="gift-desc" class="input-field" value="${escapeHtml(
            g.coupon_description || ""
          )}" />
        </div>
      </div>
      <div class="field-group">
        <label>ຂໍ້ຄວາມພິເສດໃນກ່ອງຂອງຂວັນ</label>
        <textarea id="gift-msg" class="textarea-field" rows="3">${escapeHtml(
          g.gift_message || ""
        )}</textarea>
      </div>

      <hr style="border:none; border-top:1px solid var(--border-soft); margin:18px 0;" />
      <label style="display:flex; align-items:center; gap:8px; font-weight:700; cursor:pointer; margin-bottom:12px;">
        <input type="checkbox" id="gift-has-appt" ${g.has_real_appointment ? "checked" : ""} />
        📅 ມີວັນນັດໝາຍແທ້ (ສະແດງສະເພາະເມື່ອມີນັດໝາຍຈິງເທົ່ານັ້ນ)
      </label>
      <div class="form-grid">
        <div class="field-group">
          <label>ວັນທີນັດໝາຍຈິງ</label>
          <input type="text" id="gift-appt-date" class="input-field" value="${escapeHtml(
            g.appointment_date || ""
          )}" placeholder="ເຊັ່ນ: ວັນເສົາທີ 24 ຕຸລາ" />
        </div>
        <div class="field-group">
          <label>ເວລາ</label>
          <input type="text" id="gift-appt-time" class="input-field" value="${escapeHtml(
            g.appointment_time || ""
          )}" placeholder="ເຊັ່ນ: 18:30 ໂມງ" />
        </div>
        <div class="field-group">
          <label>ສະຖານທີ່</label>
          <input type="text" id="gift-appt-loc" class="input-field" value="${escapeHtml(
            g.appointment_location || ""
          )}" />
        </div>
      </div>
    `;

    document.getElementById("gift-title").addEventListener("input", (e) => {
      g.coupon_title = e.target.value;
      markDirty();
    });
    document.getElementById("gift-desc").addEventListener("input", (e) => {
      g.coupon_description = e.target.value;
      markDirty();
    });
    document.getElementById("gift-msg").addEventListener("input", (e) => {
      g.gift_message = e.target.value;
      markDirty();
    });
    document.getElementById("gift-has-appt").addEventListener("change", (e) => {
      g.has_real_appointment = e.target.checked;
      markDirty();
    });
    document.getElementById("gift-appt-date").addEventListener("input", (e) => {
      g.appointment_date = e.target.value;
      markDirty();
    });
    document.getElementById("gift-appt-time").addEventListener("input", (e) => {
      g.appointment_time = e.target.value;
      markDirty();
    });
    document.getElementById("gift-appt-loc").addEventListener("input", (e) => {
      g.appointment_location = e.target.value;
      markDirty();
    });
  }

  // ==================== TAB 7: APPEARANCE ====================
  function renderTabAppearance(box) {
    const th = adminState.draft.theme || {};
    box.innerHTML = `
      <h2 style="margin-top:0;">🎨 ປັບແຕ່ງໂທນສີຟ້າ & Effect (Appearance)</h2>
      <div class="form-grid">
        <div class="field-group">
          <label>ພື້ນຫຼັງ (Background #F2F8FF)</label>
          <input type="color" id="th-bg" value="${escapeHtml(th.bg_color || "#F2F8FF")}" style="height:44px; width:100%;" />
        </div>
        <div class="field-group">
          <label>ສີຟ້າຫຼັກ (Primary Blue #8CC8FF)</label>
          <input type="color" id="th-primary" value="${escapeHtml(th.primary_blue || "#8CC8FF")}" style="height:44px; width:100%;" />
        </div>
        <div class="field-group">
          <label>ສີປຸ່ມຫຼັກ (CTA Blue #3478D4)</label>
          <input type="color" id="th-cta" value="${escapeHtml(th.cta_blue || "#3478D4")}" style="height:44px; width:100%;" />
        </div>
        <div class="field-group">
          <label>ສີຕົວໜັງສື (Deep Navy #183B63)</label>
          <input type="color" id="th-text" value="${escapeHtml(th.text_navy || "#183B63")}" style="height:44px; width:100%;" />
        </div>
      </div>

      <label style="display:flex; align-items:center; gap:8px; margin-top:16px; font-weight:600; cursor:pointer;">
        <input type="checkbox" id="th-reduce-motion" ${th.reduced_motion_default ? "checked" : ""} />
        ເປີດໂໝດຫຼຸດການເຄື່ອນໄຫວ (Reduce Motion) ເປັນຄ່າເລີ່ມຕົ້ນ
      </label>
    `;

    document.getElementById("th-bg").addEventListener("input", (e) => {
      th.bg_color = e.target.value;
      markDirty();
    });
    document.getElementById("th-primary").addEventListener("input", (e) => {
      th.primary_blue = e.target.value;
      markDirty();
    });
    document.getElementById("th-cta").addEventListener("input", (e) => {
      th.cta_blue = e.target.value;
      markDirty();
    });
    document.getElementById("th-text").addEventListener("input", (e) => {
      th.text_navy = e.target.value;
      markDirty();
    });
    document.getElementById("th-reduce-motion").addEventListener("change", (e) => {
      th.reduced_motion_default = e.target.checked;
      markDirty();
    });
  }

  // ==================== TAB 8: RESPONSES ====================
  function renderTabResponses(box) {
    const list = adminState.responses;
    box.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
        <h2 style="margin:0;">📬 ຄຳຕອບ & ການຕອບກັບຈາກແຟນ (${list.length})</h2>
        <button type="button" class="btn btn-secondary" id="btn-export-responses">📥 Export JSON</button>
      </div>

      ${
        list.length === 0
          ? `<p style="color:var(--text-muted);">ຍັງບໍ່ມີຄຳຕອບທີ່ສົ່ງເຂົ້າມາເທື່ອ 💙</p>`
          : list
              .map(
                (r) => `
              <div class="stage-item-row" style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
                <div>
                  <span class="stage-badge" style="margin-bottom:4px;">
                    ${
                      r.type === "date_choice"
                        ? "🍽️ ເລືອກເດດ (ດ່ານ 9)"
                        : r.type === "heart_sent"
                        ? "💙 ສົ່ງຫົວໃຈກັບໄປ (ດ່ານ 12)"
                        : "✍️ ຂໍ້ຄວາມຕອບກັບ (ດ່ານ 12)"
                    }
                  </span>
                  <div style="font-weight:600; font-size:1.02rem; margin-top:4px;">
                    ${escapeHtml(
                      r.payload.message || r.payload.option_title || r.payload.reaction || JSON.stringify(r.payload)
                    )}
                  </div>
                  <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                    ເວລາ: ${escapeHtml(r.created_at)}
                  </div>
                </div>
                <button type="button" class="btn btn-ghost btn-del-resp" data-id="${escapeHtml(
                  r.id
                )}" style="min-height:36px; padding:4px 12px; color:#C93B3B;">
                  ລຶບ
                </button>
              </div>
            `
              )
              .join("")
      }
    `;

    const expBtn = document.getElementById("btn-export-responses");
    if (expBtn) {
      expBtn.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `blue-letter-responses-${Date.now()}.json`;
        a.click();
      });
    }

    box.querySelectorAll(".btn-del-resp").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const res = await fetch(`/api/admin/responses?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { "X-CSRF-Token": adminState.csrfToken },
        });
        if (res.ok) {
          adminState.responses = adminState.responses.filter((item) => item.id !== id);
          renderTabResponses(box);
        }
      });
    });
  }

  // ==================== TAB 9: PREVIEW & PUBLISH ====================
  function renderTabPublish(box) {
    const enabledStages = adminState.draft.stages.filter((s) => s.enabled);
    const previewUrl = `/?preview=1${
      adminState.previewStageId ? `&stage=${encodeURIComponent(adminState.previewStageId)}` : ""
    }`;

    box.innerHTML = `
      <h2 style="margin-top:0;">🚀 Preview & Publish (ເຜີຍແຜ່ເວັບ)</h2>

      <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; padding:16px; background:#EEF6FF; border-radius:16px;">
        <button type="button" class="btn btn-primary" id="btn-publish-now">
          🚀 Publish ຂຶ້ນເວັບຈິງ (ສ້າງ Snapshot ໃໝ່)
        </button>
        ${
          adminState.publishedVersionId
            ? `<button type="button" class="btn btn-secondary" id="btn-unpublish-now" style="color:#A61B1B;">
                ⏸️ Unpublish (ປິດການເຂົ້າຊົມຊົ່ວຄາວ)
              </button>`
            : ""
        }
      </div>

      <!-- Version History & Rollback -->
      <div style="margin-bottom:22px;">
        <h3>🕒 ປະຫວັດເວີຊັນທີ່ເຄີຍ Publish (Rollback ໄດ້ທຸກເມື່ອ)</h3>
        ${
          adminState.versions.length === 0
            ? `<p>ຍັງບໍ່ມີເວີຊັນທີ່ Publish</p>`
            : adminState.versions
                .map(
                  (v) => `
                <div class="stage-item-row" style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong>Version v${v.version_number}</strong>
                    ${
                      v.id === adminState.publishedVersionId
                        ? `<span class="badge-status badge-published" style="margin-left:8px;">Active Live</span>`
                        : ""
                    }
                    <div style="font-size:0.82rem; color:var(--text-muted);">${escapeHtml(v.created_at)}</div>
                  </div>
                  ${
                    v.id !== adminState.publishedVersionId
                      ? `<button type="button" class="btn btn-secondary btn-rollback-ver" data-ver-id="${escapeHtml(
                          v.id
                        )}" style="min-height:36px; padding:4px 14px; font-size:0.86rem;">
                          ⏪ Rollback ມາໃຊ້ v${v.version_number}
                        </button>`
                      : ""
                  }
                </div>
              `
                )
                .join("")
        }
      </div>

      <!-- Interactive Device & Stage Tester -->
      <div style="border-top:1px solid var(--border-soft); padding-top:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <h3 style="margin:0;">📱 ທົດສອບແຕ່ລະດ່ານ (Live Draft Preview)</h3>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <select id="prev-stage-jump" class="input-field" style="width:auto; min-height:40px; padding:4px 12px;">
              <option value="">-- ເລີ່ມຈາກດ່ານ 1 --</option>
              ${enabledStages
                .map(
                  (s, i) =>
                    `<option value="${escapeHtml(s.id)}" ${
                      adminState.previewStageId === s.id ? "selected" : ""
                    }>ດ່ານ ${i + 1}: ${escapeHtml(s.title)}</option>`
                )
                .join("")}
            </select>
            <button type="button" class="btn btn-secondary" id="btn-prev-mobile" style="min-height:40px; padding:6px 14px;">📱 Mobile (375px)</button>
            <button type="button" class="btn btn-secondary" id="btn-prev-desktop" style="min-height:40px; padding:6px 14px;">💻 Desktop</button>
          </div>
        </div>

        <div style="display:flex; justify-content:center; background:#D8E8F8; padding:20px; border-radius:20px;">
          <iframe
            src="${escapeHtml(previewUrl)}"
            style="width:${adminState.previewDevice === "mobile" ? "375px" : "100%"}; height:680px; border:4px solid #183B63; border-radius:24px; background:#FFF;"
            title="Live Preview"
          ></iframe>
        </div>
      </div>
    `;

    document.getElementById("btn-publish-now").addEventListener("click", async () => {
      if (adminState.dirty) {
        const saved = await saveDraftToServer();
        if (!saved) return;
      }
      await triggerPublish(false);
    });

    const unpubBtn = document.getElementById("btn-unpublish-now");
    if (unpubBtn) {
      unpubBtn.addEventListener("click", async () => {
        const res = await fetch("/api/admin/unpublish", {
          method: "POST",
          headers: { "X-CSRF-Token": adminState.csrfToken },
        });
        const data = await res.json();
        if (res.ok) {
          await fetchAdminStoryData();
          showBanner("info", data.message);
          renderAdminShell();
        }
      });
    }

    box.querySelectorAll(".btn-rollback-ver").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const verId = btn.getAttribute("data-ver-id");
        const res = await fetch("/api/admin/rollback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": adminState.csrfToken,
          },
          body: JSON.stringify({ version_id: verId }),
        });
        const data = await res.json();
        if (res.ok) {
          await fetchAdminStoryData();
          showBanner("success", data.message);
          renderAdminShell();
        }
      });
    });

    document.getElementById("prev-stage-jump").addEventListener("change", (e) => {
      adminState.previewStageId = e.target.value;
      renderTabPublish(box);
    });
    document.getElementById("btn-prev-mobile").addEventListener("click", () => {
      adminState.previewDevice = "mobile";
      renderTabPublish(box);
    });
    document.getElementById("btn-prev-desktop").addEventListener("click", () => {
      adminState.previewDevice = "desktop";
      renderTabPublish(box);
    });
  }

  async function triggerPublish(allowPlaceholders) {
    const res = await fetch("/api/admin/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": adminState.csrfToken,
      },
      body: JSON.stringify({ allow_placeholders: allowPlaceholders }),
    });
    const data = await res.json();
    if (res.status === 409 && data.requires_confirmation) {
      const ok = window.confirm(
        `${data.error}\n\nລາຍການ Placeholder ທີ່ຍັງເຫຼືອ:\n- ${(
          data.readiness.placeholder_warnings || []
        ).join("\n- ")}\n\nກົດ OK ຖ້າຕ້ອງການ Publish ທັນທີ.`
      );
      if (ok) {
        await triggerPublish(true);
      }
      return;
    }
    if (!res.ok) {
      showBanner("error", `⚠️ ${data.error || "Publish failed"}`);
      return;
    }
    await fetchAdminStoryData();
    showBanner("success", data.message);
    renderAdminShell();
  }

  // ==================== TAB 10: SETTINGS ====================
  function renderTabSettings(box) {
    const d = adminState.draft;
    box.innerHTML = `
      <h2 style="margin-top:0;">⚙️ ຕັ້ງຄ່າຄວາມປອດໄພ, Media & Backup (Settings)</h2>

      <div style="background:#EEF6FF; padding:18px; border-radius:18px; margin-bottom:20px;">
        <h3 style="margin-top:0;">🔒 ການລັອກເວັບສຳລັບຜູ້ຮັບ (Visitor Access Mode)</h3>
        <div class="form-grid">
          <div class="field-group">
            <label>ໂໝດການເຂົ້າຊົມ</label>
            <select id="set-access-mode" class="input-field">
              <option value="public" ${d.access_mode === "public" ? "selected" : ""}>🌐 ເປີດໃຫ້ເຂົ້າເບິ່ງຜ່ານລິ້ງໂດຍກົງ (Public Link)</option>
              <option value="passphrase" ${d.access_mode === "passphrase" ? "selected" : ""}>🔒 ຕ້ອງໃສ່ລະຫັດຜ່ານກ່ອນເປີດອ່ານ (Private Passphrase)</option>
            </select>
          </div>
          <div class="field-group">
            <label>ຕັ້ງລະຫັດຜ່ານສຳລັບແຟນ ${adminState.hasPassphrase ? "(ຕັ້ງໄວ້ແລ້ວ — ພິມໃໝ່ເພື່ອປ່ຽນ)" : ""}</label>
            <input type="password" id="set-visitor-passphrase" class="input-field" placeholder="ລະຫັດຜ່ານສຳລັບເປີດຊອງຈົດໝາຍ..." />
          </div>
        </div>
        <button type="button" class="btn btn-primary" id="btn-save-access-settings">ບັນທຶກການຕັ້ງຄ່າການເຂົ້າຊົມ</button>
      </div>

      <!-- Media Library Management (Cannot delete media in use) -->
      <div style="margin-bottom:20px;">
        <h3>🖼️ ຄັງໄຟລ໌ Media ທັງໝົດ (${adminState.media.length})</h3>
        ${
          adminState.media.length === 0
            ? `<p style="color:var(--text-muted);">ຍັງບໍ່ມີໄຟລ໌ທີ່ອັບໂຫຼດ</p>`
            : adminState.media
                .map(
                  (m) => `
                <div class="stage-item-row" style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                  <div>
                    <strong>${escapeHtml(m.original_name)}</strong> (${Math.round(m.bytes / 1024)} KB)
                    <div style="font-size:0.8rem; color:var(--text-muted);">
                      ${
                        m.usages && m.usages.length
                          ? `📌 ກຳລັງໃຊ້ຢູ່ໃນ: ${escapeHtml(m.usages.join(", "))}`
                          : "ບໍ່ໄດ້ຖືກໃຊ້ (ສາມາດລຶບໄດ້)"
                      }
                    </div>
                  </div>
                  <button type="button" class="btn btn-ghost btn-del-media" data-id="${escapeHtml(
                    m.id
                  )}" style="min-height:36px; padding:4px 12px; color:#C93B3B;">
                    ລຶບໄຟລ໌
                  </button>
                </div>
              `
                )
                .join("")
        }
      </div>

      <!-- Backup & Logout -->
      <div style="display:flex; gap:12px; flex-wrap:wrap; padding-top:14px; border-top:1px solid var(--border-soft);">
        <button type="button" class="btn btn-secondary" id="btn-download-backup">📦 ດາວໂຫຼດ Backup JSON</button>
        <button type="button" class="btn btn-ghost" id="btn-admin-logout" style="color:#A61B1B;">🚪 ອອກຈາກລະບົບ (Logout)</button>
      </div>
    `;

    document.getElementById("btn-save-access-settings").addEventListener("click", async () => {
      d.access_mode = document.getElementById("set-access-mode").value;
      const newPass = document.getElementById("set-visitor-passphrase").value.trim();
      await saveDraftToServer(newPass ? { new_passphrase: newPass } : {});
    });

    box.querySelectorAll(".btn-del-media").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const res = await fetch(`/api/admin/media/${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { "X-CSRF-Token": adminState.csrfToken },
        });
        const data = await res.json();
        if (!res.ok) {
          showBanner("error", `⚠️ ${data.error}`);
          return;
        }
        await fetchAdminStoryData();
        showBanner("success", "✓ ລຶບໄຟລ໌ສຳເລັດແລ້ວ");
        renderAdminShell();
      });
    });

    document.getElementById("btn-download-backup").addEventListener("click", async () => {
      const res = await fetch("/api/admin/backup");
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `blue-letter-backup-${Date.now()}.json`;
        a.click();
      }
    });

    document.getElementById("btn-admin-logout").addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      adminState.authenticated = false;
      renderLoginScreen();
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    checkAuthAndLoad();
  });
})();
