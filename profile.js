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

    // username from JWT
    document.getElementById("username").value =
      json.user.username || "";

    // ALWAYS try Discord avatar first (important fix)
    const discordId = json.user.discord_id;

    if (discordId) {
      const avatar = `https://cdn.discordapp.com/avatars/${discordId}/${json.user.avatar || ""}.png`;

      document.getElementById("pfp").src = avatar;
    }

    // fallback position from API
    const playersRes = await fetch(`${API}/players`);
    const playersJson = await playersRes.json();

    const player = Object.values(playersJson.data || {}).find(
      p => p.discord_id === json.user.discord_id
    );

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

  await fetch(`${API}/players/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ username, position })
  });

  window.location.href = "/";
}

// ================= SKIP =================
function skipProfile() {
  window.location.href = "/";
}

// expose to HTML
window.saveProfile = saveProfile;
window.skipProfile = skipProfile;
