// ============================
// SWITCH LOGIN / REGISTER
// ============================
const switchButtons = document.querySelectorAll(".switch-btn");
const forms = document.querySelectorAll(".form");

// ============================
// TOAST POPUP
// ============================
const toastEl = document.getElementById("toast");
const toastIconEl = document.getElementById("toastIcon");
const toastTitleEl = document.getElementById("toastTitle");
const toastMessageEl = document.getElementById("toastMessage");
const toastCloseEl = document.getElementById("toastClose");

let toastTimer = null;

function showToast(message, variant = "info", title = null, timeoutMs = 3500) {
  if (!toastEl || !toastMessageEl || !toastTitleEl || !toastIconEl) return;

  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  const icons = { info: "i", success: "✓", error: "!" };
  const titles = {
    info: "Notice",
    success: "Success",
    error: "Something went wrong",
  };

  toastEl.dataset.variant = variant;
  toastIconEl.textContent = icons[variant] || "!";
  toastTitleEl.textContent = title || titles[variant] || "Notice";
  toastMessageEl.textContent = message;

  toastEl.classList.add("show");

  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, timeoutMs);
}

if (toastCloseEl && toastEl) {
  toastCloseEl.addEventListener("click", () => toastEl.classList.remove("show"));
}

switchButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    switchButtons.forEach(b => b.classList.remove("active"));
    forms.forEach(f => f.classList.remove("active"));

    btn.classList.add("active");
    document
      .getElementById(btn.dataset.tab + "Form")
      .classList.add("active");
  });
});

// ============================
// LOGIN
// ============================
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  if (!email || !pass) {
    showToast("Please enter email and password.", "info");
    return;
  }

  try {
    const data = await apiLogin(email, pass);

    // Persist auth info
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("profileName", data.user.name || "Drive User");
    localStorage.setItem("profileAvatar", data.user.avatar_url || data.user.avatar || "");

    // Welcome toast on next page (colorful popup)
    sessionStorage.setItem(
      "pendingToast",
      JSON.stringify({
        variant: "success",
        title: "Welcome to DRIVE",
        message: `Hi ${data.user.name || "Driver"} — you're logged in successfully.`,
        timeoutMs: 4000
      })
    );

    const redirect =
      localStorage.getItem("redirectAfterLogin") || "luxury.html";

    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirect;
  } catch (err) {
    const msg =
      err && err.message === "Failed to fetch"
        ? "Cannot reach the server. Please start the backend and try again."
        : err.message || "Login failed";
    showToast(msg, "error");
  }
});

// ============================
// REGISTER
// ============================
document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPassword").value.trim();

  if (!name || !email || !pass) {
    showToast("Please fill all fields to register.", "info");
    return;
  }

  try {
    await apiSignup(name, email, pass);
    document.querySelector('[data-tab="login"]').click();
    showToast("Account created. Please verify your email from inbox, then login.", "success");
  } catch (err) {
    const msg =
      err && err.message === "Failed to fetch"
        ? "Cannot reach the server. Please start the backend and try again."
        : err.message || "Signup failed";
    showToast(msg, "error");
  }
});

// ============================
// GOOGLE SIGN-IN CALLBACK
// ============================
window.onGoogleCredential = async function onGoogleCredential(response) {
  try {
    const data = await apiGoogleLogin(response.credential);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("profileName", data.user.name || "Drive User");
    localStorage.setItem("profileAvatar", data.user.avatar_url || data.user.avatar || "");

    sessionStorage.setItem(
      "pendingToast",
      JSON.stringify({
        variant: "success",
        title: "Welcome to DRIVE",
        message: `Hi ${data.user.name || "Driver"} — you're logged in successfully.`,
        timeoutMs: 4000
      })
    );

    const redirect =
      localStorage.getItem("redirectAfterLogin") || "luxury.html";
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirect;
  } catch (err) {
    const msg =
      err && err.message === "Failed to fetch"
        ? "Cannot reach the server. Please start the backend and try again."
        : err.message || "Google sign-in failed";
    showToast(msg, "error");
  }
};

// Initialize Google Identity Services using clientId from backend
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("googleSignInContainer");
  if (!container) return;

  // Wait until GIS script is ready (it loads async+defer from login.html)
  const waitForGoogle = () =>
    new Promise(resolve => {
      const start = Date.now();
      const tick = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) return resolve(true);
        if (Date.now() - start > 8000) return resolve(false);
        setTimeout(tick, 50);
      };
      tick();
    });

  const ready = await waitForGoogle();
  if (!ready) {
    container.innerHTML = "<p style='color:#64748b;font-size:0.9rem;'>Google Sign-In failed to load.</p>";
    return;
  }

  try {
    const baseUrl = await resolveApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/auth/google/client-id`);
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      // ignore parse errors
    }

    // If backend is not configured (or returns 500), don't break the whole page.
    // Just keep Google button unavailable and allow email/password login.
    if (!res.ok || !data || !data.clientId) {
      container.innerHTML =
        "<p style='color:#64748b;font-size:0.9rem;'>Google login is not available right now.</p>";
      return;
    }

    window.google.accounts.id.initialize({
      client_id: data.clientId,
      callback: window.onGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      width: 320,
    });
  } catch (err) {
    container.innerHTML = "<p style='color:#64748b;font-size:0.9rem;'>Google login is not available right now.</p>";
    // Don't hard-fail on Google sign-in initialization errors.
  }
});