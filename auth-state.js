const API = CONFIG.API_BASE;

let CURRENT_USER = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
});

// ================= AUTH CHECK =================
async function initAuth() {
  const token = localStorage.getItem("hmbl_token");

  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!token) {
    setLoggedOut();
    return;
  }

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status !== "success") {
      throw new Error("Invalid auth");
    }

    CURRENT_USER = data.user;

    setLoggedIn();

  } catch (err) {
    console.log("Auth error:", err);
    localStorage.removeItem("hmbl_token");
    CURRENT_USER = null;
    setLoggedOut();
  }
}

// ================= UI STATES =================
function setLoggedIn() {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) loginBtn.style.display = "none";
  if (profileBtn) profileBtn.style.display = "inline-block";
  if (logoutBtn) logoutBtn.style.display = "inline-block";

  // prevent duplicate listeners
  if (profileBtn && !profileBtn.dataset.bound) {
    profileBtn.dataset.bound = "true";

    profileBtn.onclick = () => {
      const user = CURRENT_USER;
      if (user?.username) {
        window.location.href = `/users.html?u=${user.username}`;
      }
    };
  }

  if (logoutBtn && !logoutBtn.dataset.bound) {
    logoutBtn.dataset.bound = "true";

    logoutBtn.onclick = logout;
  }
}

function setLoggedOut() {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) loginBtn.style.display = "inline-block";
  if (profileBtn) profileBtn.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "none";
}

// ================= GET USER =================
function getCurrentUser() {
  return CURRENT_USER;
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("hmbl_token");
  CURRENT_USER = null;
  setLoggedOut();
  window.location.href = "/";
}
