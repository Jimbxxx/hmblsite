const API = CONFIG.API_BASE;

let CURRENT_USER = null;

// ================= LOAD PROFILE =================
async function loadProfile() {

  const token = localStorage.getItem("hmbl_token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    // get auth user (JWT)
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

    // fill basic JWT data
    document.getElementById("username").value = json.user.username || "";

    // fetch full player data (pfp + position)
    const playersRes = await fetch(`${API}/players`);
    const playersJson = await playersRes.json();

    const players = playersJson.data || {};

    const player = Object.values(players).find(
      p => p.discord_id === json.user.discord_id
    );

    if (player) {

      if (player.position) {
        document.getElementById("position").value = player.position;
      }

      if (player.pfp) {
        document.getElementById("pfp").src = player.pfp;
      }
    }

    // check if new user
    const url = new URL(window.location.href);
    const isNew = url.searchParams.get("new");

    if (isNew === "false") {
      document.getElementById("title").innerText = "Edit Profile";
      document.getElementById("skipBtn").style.display = "none";
    }

  } catch (err) {
    console.log("Profile load error:", err);
    window.location.href = "/";
  }
}

// ================= SAVE PROFILE =================
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

// auto run
loadProfile();
