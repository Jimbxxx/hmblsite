console.log("PROFILE JS LOADED");

// ================= CONFIG =================
window.API = window.CONFIG.API_BASE;

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
    const authRes = await fetch(`${window.API}/auth/me`, {
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

    // ================= USERNAME =================
    const usernameEl = document.getElementById("username");

    if (usernameEl) {
      usernameEl.value = user.username || "";
    }

    // ================= POSITION =================
    const positionEl = document.getElementById("position");

    if (positionEl) {
      positionEl.value = user.position || "";
    }

    // ================= GET PLAYERS =================
    const playersRes = await fetch(`${window.API}/players`);

    const playersJson = await playersRes.json();

    console.log("PLAYERS:", playersJson);

    const players = Object.values(playersJson.data || {});

    const player = players.find(
      p => p.discord_id === user.discord_id
    );

    console.log("MATCHED PLAYER:", player);

    // ================= PFP =================
    const pfpEl = document.getElementById("pfp");

    if (pfpEl) {

      const pfpUrl =
        player?.pfp ||
        "https://cdn.discordapp.com/embed/avatars/0.png";

      console.log("SETTING PFP:", pfpUrl);

      pfpEl.src = pfpUrl;

      pfpEl.onerror = () => {
        pfpEl.src =
          "https://cdn.discordapp.com/embed/avatars/0.png";
      };
    }

  } catch (err) {

    console.log("PROFILE ERROR:", err);

  }
}

// ================= SAVE =================
async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

  const username =
    document.getElementById("username")
    ?.value
    ?.trim();

  const position =
    document.getElementById("position")
    ?.value
    ?.trim();

  if (!username) return;

  try {

    const res = await fetch(
      `${window.API}/players/update-profile`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          username,
          position
        })
      }
    );

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

// ================= EXPOSE =================
window.saveProfile = saveProfile;
window.skipProfile = skipProfile;
