console.log("PROFILE JS LOADED");

const API = window.CONFIG.API_BASE;

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

    console.log("AUTH:", auth);

    if (auth.status !== "success") {
      localStorage.removeItem("hmbl_token");
      window.location.href = "/";
      return;
    }

    const user = auth.user;

    // ================= INPUTS =================
    const usernameEl = document.getElementById("username");
    if (usernameEl) usernameEl.value = user.username || "";

    const positionEl = document.getElementById("position");
    if (positionEl) positionEl.value = user.position || "";

    // ================= PLAYERS =================
    const playersRes = await fetch(`${API}/players`);
    const playersJson = await playersRes.json();

    const players = Object.values(playersJson.data || {});

    const player = players.find(
      p => p.discord_id === user.discord_id
    );

    console.log("PLAYER:", player);

    // ================= PFP =================
    const pfpEl = document.getElementById("pfp");

    if (pfpEl) {
      const url =
        player?.pfp ||
        "https://cdn.discordapp.com/embed/avatars/0.png";

      pfpEl.src = url;

      pfpEl.onerror = () => {
        pfpEl.src = "https://cdn.discordapp.com/embed/avatars/0.png";
      };
    }

  } catch (err) {
    console.log("PROFILE ERROR:", err);
  }
}

// ================= SAVE =================
async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

  const username = document.getElementById("username")?.value?.trim();
  const position = document.getElementById("position")?.value?.trim();

  if (!username) return;

  try {

    const res = await fetch(`${API}/players/update-profile`, {
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

    const json = await res.json();

    console.log("SAVE:", json);

    if (json.status === "success") {
      window.location.href = "/";
    }

  } catch (err) {
    console.log("SAVE ERROR:", err);
  }
}

// ================= SKIP =================
function skipProfile() {
  window.location.href = "/";
}

// expose
window.saveProfile = saveProfile;
window.skipProfile = skipProfile;
