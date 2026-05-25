const API = CONFIG.API_BASE;

// ================= LOAD PROFILE =================
async function loadProfile() {
  const token = localStorage.getItem("hmbl_token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (!json.user) return;

  const usernameInput = document.getElementById("username");
  const positionInput = document.getElementById("position");

  usernameInput.value = json.user.username || "";
  positionInput.value = json.user.position || "";

  // fetch full player data (pfp)
  const playersRes = await fetch(`${API}/players`);
  const playersJson = await playersRes.json();

  const players = playersJson.data;

  const player = Object.values(players).find(
    p => p.discord_id === json.user.discord_id
  );

  if (player && player.pfp) {
    document.getElementById("pfp").src = player.pfp;
  }
}

// ================= SAVE PROFILE =================
async function saveProfile() {
  const token = localStorage.getItem("hmbl_token");

  const username = document.getElementById("username").value;
  const position = document.getElementById("position").value;

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
}

// ================= SKIP =================
function skipProfile() {
  window.location.href = "/";
}

// auto run
loadProfile();
