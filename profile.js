const API = CONFIG.API_BASE;

let CURRENT_USER = null;
let CURRENT_PLAYER = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

// ================= LOAD =================
async function loadProfile() {
  const token = localStorage.getItem("hmbl_token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    // ================= AUTH =================
    const authRes = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const auth = await authRes.json();

    if (auth.status !== "success") {
      localStorage.removeItem("hmbl_token");
      window.location.href = "/";
      return;
    }

    CURRENT_USER = auth.user;

    // ================= USERNAME =================
    const usernameEl = document.getElementById("username");
    if (usernameEl) {
      usernameEl.value = auth.user.username || "";
    }

    // ================= PLAYERS =================
    const playersRes = await fetch(`${API}/players`);
    const playersJson = await playersRes.json();

    const players = Object.values(playersJson.data || {});

    CURRENT_PLAYER = players.find(
      p => p.discord_id === auth.user.discord_id
    );

    // ================= PFP FIX (IMPORTANT) =================
    const pfpEl = document.getElementById("pfp");

    if (pfpEl) {
      const pfpUrl = CURRENT_PLAYER?.pfp;

      pfpEl.onerror = () => {
        pfpEl.src = "https://cdn.discordapp.com/embed/avatars/0.png";
      };

      // FORCE CLEAN SET
      if (pfpUrl) {
        pfpEl.src = pfpUrl;
      } else {
        pfpEl.src = "https://cdn.discordapp.com/embed/avatars/0.png";
      }
    }

    // ================= POSITION =================
    const posEl = document.getElementById("position");
    if (posEl) {
      posEl.value = CURRENT_PLAYER?.position || "";
    }

  } catch (err) {
    console.log("Profile load error:", err);
    window.location.href = "/";
  }
}

// ================= SAVE =================
async function saveProfile() {
  const token = localStorage.getItem("hmbl_token");

  const username = document.getElementById("username")?.value?.trim();
  const position = document.getElementById("position")?.value?.trim();

  if (!username) return;

  try {
    await fetch(`${API}/players/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username, position })
    });

    window.location.href = "/";
  } catch (err) {
    console.log("Save error:", err);
  }
}

// ================= SKIP =================
function skipProfile() {
  window.location.href = "/";
}

// expose
window.saveProfile = saveProfile;
window.skipProfile = skipProfile;
