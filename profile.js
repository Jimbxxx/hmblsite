const API = CONFIG.API_BASE;

let CURRENT_USER = null;

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
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const json = await res.json();

    if (json.status !== "success") {
      localStorage.removeItem("hmbl_token");
      window.location.href = "/";
      return;
    }

    CURRENT_USER = json.user;

    // ================= USERNAME =================
    document.getElementById("username").value =
      json.user.username || "";

    // ================= PFP FIX (SUPABASE FIRST) =================
    const playersRes = await fetch(`${API}/players`);
    const playersJson = await playersRes.json();

    const player = Object.values(playersJson.data || {}).find(
      p => p.discord_id === json.user.discord_id
    );

    const pfpEl = document.getElementById("pfp");

    if (player?.pfp) {
      // Supabase stored pfp (BEST SOURCE)
      pfpEl.src = player.pfp;
    } else if (json.user.discord_id && json.user.avatar) {
      // Discord fallback
      pfpEl.src = `https://cdn.discordapp.com/avatars/${json.user.discord_id}/${json.user.avatar}.png`;
    } else {
      // final fallback (prevents broken image)
      pfpEl.src = "https://cdn.discordapp.com/embed/avatars/0.png";
    }

    // ================= POSITION =================
    if (player?.position) {
      document.getElementById("position").value = player.position;
    }

  } catch (err) {
    console.log("Profile load error:", err);
  }
}

// ================= SAVE =================
async function saveProfile() {
  const token = localStorage.getItem("hmbl_token");

  const username = document.getElementById("username").value;
  const position = document.getElementById("position").value;

  if (!username) return;

  try {
    await fetch(`${API}/players/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        position
      })
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

// expose to HTML buttons
window.saveProfile = saveProfile;
window.skipProfile = skipProfile;
