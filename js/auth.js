// Navbar auth switch + global toast popup used across pages (no backend changes)

function ensureToast() {
  if (document.getElementById("toast")) return;

  const styleId = "toast-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(20px);width:min(560px,calc(100vw - 24px));opacity:0;pointer-events:none;transition:opacity 180ms ease,transform 180ms ease;z-index:9999}
      .toast.show{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}
      .toast-content{display:flex;align-items:flex-start;gap:14px;padding:14px;border-radius:14px;background:rgba(15,23,42,.92);border:1px solid rgba(148,163,184,.18);box-shadow:0 18px 40px rgba(2,6,23,.28);color:#e2e8f0;backdrop-filter:blur(10px);font-family:"Outfit",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;position:relative;overflow:hidden}
      .toast-content::before{content:"";position:absolute;left:0;top:0;height:3px;width:100%;background:linear-gradient(90deg,var(--gold,#38bdf8),#1d4ed8);opacity:.9}
      .toast-icon{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-weight:700;flex:0 0 auto;margin-top:1px;background:rgba(56,189,248,.18);color:var(--gold,#38bdf8)}
      .toast-title{font-weight:600;letter-spacing:.2px;margin-bottom:2px}
      .toast-message{color:rgba(226,232,240,.86);font-size:.95rem;line-height:1.25rem}
      .toast-close{width:auto;margin-top:0;padding:6px 10px;border-radius:10px;background:transparent;color:rgba(226,232,240,.85);border:1px solid rgba(148,163,184,.18);cursor:pointer}
      .toast-close:hover{background:rgba(148,163,184,.10);color:#e2e8f0}
      .toast[data-variant="success"] .toast-icon{background:rgba(34,197,94,.18);color:#22c55e}
      .toast[data-variant="error"] .toast-icon{background:rgba(239,68,68,.18);color:#ef4444}
    `;
    document.head.appendChild(style);
  }

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = "toast";
  toast.setAttribute("aria-live", "polite");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-icon" id="toastIcon">i</div>
      <div class="toast-text">
        <div class="toast-title" id="toastTitle">Notice</div>
        <div class="toast-message" id="toastMessage"></div>
      </div>
      <button class="toast-close" id="toastClose" type="button" aria-label="Close">✕</button>
    </div>
  `;
  document.body.appendChild(toast);

  document.getElementById("toastClose")?.addEventListener("click", () => {
    toast.classList.remove("show");
  });
}

let toastTimer = null;
window.showToast = function showToast(message, variant = "info", title = null, timeoutMs = 3500) {
  ensureToast();
  const toastEl = document.getElementById("toast");
  const toastIconEl = document.getElementById("toastIcon");
  const toastTitleEl = document.getElementById("toastTitle");
  const toastMessageEl = document.getElementById("toastMessage");
  if (!toastEl || !toastMessageEl || !toastTitleEl || !toastIconEl) return;

  if (toastTimer) clearTimeout(toastTimer);
  const icons = { info: "i", success: "✓", error: "!" };
  const titles = { info: "Notice", success: "Welcome!", error: "Something went wrong" };

  toastEl.dataset.variant = variant;
  toastIconEl.textContent = icons[variant] || "!";
  toastTitleEl.textContent = title || titles[variant] || "Notice";
  toastMessageEl.textContent = message;
  toastEl.classList.add("show");

  toastTimer = setTimeout(() => toastEl.classList.remove("show"), timeoutMs);
};

function consumePendingToast() {
  try {
    const raw = sessionStorage.getItem("pendingToast");
    if (!raw) return;
    sessionStorage.removeItem("pendingToast");
    const t = JSON.parse(raw);
    window.showToast(t.message || "", t.variant || "info", t.title || null, t.timeoutMs || 3500);
  } catch (e) {
    // ignore
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("authLink");
  if (authLink) {
    if (localStorage.getItem("isLoggedIn") === "true" && localStorage.getItem("authToken")) {
      authLink.innerHTML = `<a href="account.html" class="auth-btn">Account</a>`;
    } else {
      authLink.innerHTML = `<a href="login.html" class="auth-btn">Login</a>`;
    }
  }

  consumePendingToast();
});
