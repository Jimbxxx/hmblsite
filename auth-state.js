const API = CONFIG.API_BASE;

let CURRENT_USER = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
});

// ================= MAIN AUTH CHECK =================
async function initAuth() {
  const token = localStorage.getItem("hmbl_token");

  if (!token) {
    setLoggedOut();
    return;
  }

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status !== "success") {
      setLoggedOut();
      return;
    }

    CURRENT_USER = data.user;

    setLoggedIn();
  } catch (err) {
    console.log("Auth error:", err);
    setLoggedOut();
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
