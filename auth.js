const API = CONFIG.API_BASE;

// ================= LOGIN =================
function login() {
  window.location.href = `${API}/auth/discord/login`;
}

// ================= HANDLE CALLBACK =================
// runs on any page load
(function handleAuthCallback() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  if (token) {
    localStorage.setItem("hmbl_token", token);

    // remove token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();

// ================= GET CURRENT USER =================
function getCurrentUser() {
  const raw = localStorage.getItem("hmbl_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("hmbl_token");
  localStorage.removeItem("hmbl_user");
  location.reload();
}
