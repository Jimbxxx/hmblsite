const API = CONFIG.API_BASE;

let CURRENT_USER = null;

// ================= LOAD PROFILE =================
async function loadProfile() {
  const token = localStorage.getItem("hmbl_token");
  if (!token) return (window.location.href = "/");

  // UI state
  const url = new URL(window.location.href);
  const isNew = url.searchParams.get("new");

  const title = document.getElementById("title");
  const skipBtn = document.getElementById("skipBtn");

  if (isNew === "false") {
    if (title) title.innerText = "Edit Profile";
    if (skipBtn) skipBtn.style.display = "none";
  } else {
    if (title) title.innerText = "Complete Your Profile";
    if (skipBtn) skipBtn.style.display = "inline-block";
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
      return (window.location.href = "/");
    }

    CURRENT_USER = json.user;

    const usernameEl = document.getElementById("username");
    if (usernameEl) usernameEl.value = json.user.username || "";

    // fetch player data
    const playersRes = await fetch(`${API}/players`);
    const playersJson = await playersRes.json();

    const players = playersJson.data || {};

    const player = Object.values(players).find(
      p => p.discord_id === json.user.discord_id
    );

    if (player) {
      if (document.getElementById("position"))
        document.getElementById("position").value = player.position || "";

      if (player.pfp && document.getElementById("pfp"))
        document.getElementById("pfp").src = player.pfp;
    }

  } catch (err) {
    console.log("Profile load error:", err);
    window.location.href = "/";
  }
}

// ================= SAVE =================
async function saveProfile() {
  const token = localStorage.getItem("hmbl_token");

  const username = document.getElementById("username").value;
  const position = document.getElementById("position").value;

  const status = document.getElementById("status");
  status.innerText = "Saving...";

  if (!username) {
    status.innerText = "Username required";
    return;
  }

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

    if (json.status !== "success") {
      status.innerText = "Failed to save";
      return;
    }

    status.innerText = "Saved successfully";

    setTimeout(() => {
      window.location.href = "/";
    }, 600);

  } catch (err) {
    console.log(err);
    status.innerText = "Server error";
  }
}

// ================= SKIP =================
function skipProfile() {
  window.location.href = "/";
}

loadProfile();
