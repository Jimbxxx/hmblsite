const API = CONFIG.API_BASE;

let CURRENT_USER = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
});

// ================= MAIN AUTH CHECK =================
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


// ================= AUTO ROUTE =================
(async function handlePostLoginRedirect() {
  try {
    const token = localStorage.getItem("hmbl_token");

    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status !== "success") return;

    const setupRes = await fetch(`${API}/auth/needs-setup`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const setupJson = await setupRes.json();

    // NEW USER → setup page
    if (setupJson.status === "success" && setupJson.needs_setup) {
      window.location.href = "/profile.html";
    }

  } catch (err) {
    console.log(err);
  }
})();
