const API = window.CONFIG?.API_BASE;

window.CURRENT_USER = null;

// ================= UI STATES =================
function setLoggedIn() {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) loginBtn.style.display = "none";
  if (profileBtn) profileBtn.style.display = "inline-block";
  if (logoutBtn) logoutBtn.style.display = "inline-block";
}

function setLoggedOut() {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) loginBtn.style.display = "inline-block";
  if (profileBtn) profileBtn.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "none";
}

// ================= HELPERS =================
function getCurrentUser() {
  return CURRENT_USER;
}

function logout() {
  localStorage.removeItem("hmbl_token");
  CURRENT_USER = null;
  setLoggedOut();
  window.location.href = "/";
}
