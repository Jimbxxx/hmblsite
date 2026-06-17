let CURRENT_USER = null;

document.addEventListener("DOMContentLoaded", initAuth);

async function initAuth() {
  const token = localStorage.getItem("hmbl_token");

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
      setLoggedOut();
      return;
    }

    CURRENT_USER = data.user;
    localStorage.setItem("hmbl_user", JSON.stringify(data.user));
    localStorage.setItem("hmbl_is_admin", data.user?.is_admin === true);
    
    setLoggedIn();

  } catch (err) {
    setLoggedOut();
  }
}

// ================= LOGIN =================
function login() {
  window.location.href = `${window.CONFIG.API_BASE}/auth/discord/login`;
}

// ================= HANDLE CALLBACK =================
(function handleAuthCallback() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  if (token) {
    localStorage.setItem("hmbl_token", token);
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.href = "/profile.html";
  }
})();

// ================= INIT AUTH =================
document.addEventListener("DOMContentLoaded", () => {
  initAuthState();
});

// ================= CHECK AUTH =================
async function initAuthState() {

  const token = localStorage.getItem("hmbl_token");

  if (!token) {
    setLoggedOut();
    return;
  }

  try {

    const res = await fetch(`${window.CONFIG.API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status !== "success") {
      logout();
      return;
    }

    CURRENT_USER = data.user;

    localStorage.setItem("hmbl_user", JSON.stringify(data.user));

    setLoggedIn();

  } catch (err) {
    console.log("Auth error:", err);
    logout();
  }
}

// ================= UI STATES =================
function setLoggedIn() {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");

  if (loginBtn) loginBtn.style.display = "none";
  if (profileBtn) profileBtn.style.display = "inline-block";
}

function setLoggedOut() {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");

  if (loginBtn) loginBtn.style.display = "inline-block";
  if (profileBtn) profileBtn.style.display = "none";
}

// ================= HELPERS =================
function getCurrentUser() {
  return CURRENT_USER;
}

function goProfile() {
  const user = getCurrentUser();
  if (!user) return;

  window.location.href = `/${user.username}`;
}

function logout() {
  localStorage.removeItem("hmbl_token");
  localStorage.removeItem("hmbl_user");
  CURRENT_USER = null;
  location.reload();
}
