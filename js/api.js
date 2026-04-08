// Simple API helper for DRIVE frontend
// The backend may run on 5000 or (if 5000 is busy) 5001, etc.
// We auto-detect a working base URL and cache it in localStorage.

// Render production backend URL
const PROD_API_BASE_URL = "https://car-rental-backend-zksf.onrender.com";

function buildApiCandidates() {
  const host = window.location.hostname || "localhost";
  const hosts = Array.from(new Set([host, "localhost", "127.0.0.1"]));
  const ports = Array.from({ length: 10 }, (_, i) => 5000 + i); // 5000-5009

  const urls = [PROD_API_BASE_URL];
  // Add local candidates for dev fallback
  for (const h of hosts) {
    for (const p of ports) {
      const localUrl = `http://${h}:${p}`;
      if (localUrl !== PROD_API_BASE_URL) {
        urls.push(localUrl);
      }
    }
  }
  return urls;
}

async function resolveApiBaseUrl() {
  const cached = localStorage.getItem("apiBaseUrl");
  const dynamicCandidates = buildApiCandidates();
  const candidates = cached
    ? [cached, ...dynamicCandidates.filter(u => u !== cached)]
    : dynamicCandidates;

  for (const baseUrl of candidates) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${baseUrl}/api/health`, {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(t);
      if (res.ok || res.status === 304) {
        localStorage.setItem("apiBaseUrl", baseUrl);
        return baseUrl;
      }
    } catch (e) {
      // try next candidate
    }
  }

  throw new Error(
    "Backend not reachable. Start the backend and refresh the page."
  );
}

function getAuthToken() {
  return localStorage.getItem("authToken");
}

async function apiRequest(path, options = {}) {
  const headers = options.headers || {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = await resolveApiBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore parse errors for empty responses
  }

  if (!res.ok) {
    const message = (data && data.message) || "Request failed";
    throw new Error(message);
  }

  return data;
}

async function apiLogin(email, password) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function apiSignup(name, email, password) {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

async function apiVerifyEmail(token) {
  return apiRequest(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
}

async function apiResendVerification(email) {
  return apiRequest("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

async function apiGetMe() {
  return apiRequest("/api/auth/me");
}

async function apiUpdateProfile(payload) {
  return apiRequest("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

async function apiGoogleLogin(credential) {
  // Backend expects /auth/google-login with { token }
  return apiRequest("/auth/google-login", {
    method: "POST",
    body: JSON.stringify({ token: credential }),
  });
}

async function apiGetCars(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiRequest(`/api/cars${query}`);
}

async function apiCreateBooking(payload) {
  return apiRequest("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function apiGetMyBookings() {
  return apiRequest("/api/bookings/me");
}

async function apiCancelBooking(bookingId) {
  return apiRequest(`/api/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: "DELETE",
  });
}

