(async function runVerification() {
  const statusEl = document.getElementById("verifyStatus");
  const titleEl = document.getElementById("verifyTitle");
  const messageEl = document.getElementById("verifyMessage");
  const token = new URLSearchParams(window.location.search).get("verifyToken");

  if (!token) {
    statusEl.textContent = "!";
    statusEl.classList.add("error");
    titleEl.textContent = "Invalid verification link";
    messageEl.textContent = "Verification token is missing. Please request a new verification email.";
    return;
  }

  try {
    await apiVerifyEmail(token);
    statusEl.textContent = "✓";
    statusEl.classList.add("success");
    titleEl.textContent = "Your email has been verified";
    messageEl.textContent = "Go back to login page and sign in to continue.";
  } catch (err) {
    statusEl.textContent = "!";
    statusEl.classList.add("error");
    titleEl.textContent = "Verification failed";
    messageEl.textContent = err.message || "Invalid or expired verification link.";
  }
})();

