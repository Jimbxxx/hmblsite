const API = CONFIG.API_BASE;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

// ================= LOAD PROFILE =================
async function loadProfile() {

  const username = getUsernameFromURL();

  if (!username) {
    showError("User not found");
    return;
  }

  try {

    const res = await fetch(`${API}/players`);
    const json = await res.json();

    const players = Object.values(json.data || {});

    const player = players.find(
      p => p.username === username
    );

    if (!player) {
      showError("User not found");
      return;
    }

    renderProfile(player);

    // increment views (safe fire-and-forget)
    fetch(`${API}/players/increment-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    }).catch(() => {});

  } catch (err) {
    console.log(err);
    showError("Error loading profile");
  }
}

// ================= GET USERNAME =================
function getUsernameFromURL() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1];
}

// ================= RENDER =================
function renderProfile(player) {

  const el = document.getElementById("profile");

  el.innerHTML = `
    <div class="profile-header">

      <img 
        src="${player.pfp || ""}" 
        class="profile-avatar"
      />

      <div>
        <h2>${player.username || "Unknown"}</h2>
        <p>${player.position || "No position set"}</p>
        <p>Team: ${player.team_id || "None"}</p>
      </div>

    </div>

    <hr class="divider">

    <div class="stats">

      <div>Goals: ${player.goals || 0}</div>
      <div>Assists: ${player.assists || 0}</div>
      <div>Points: ${player.points || 0}</div>
      <div>Clean Sheets: ${player.clean_sheets || 0}</div>
      <div>Profile Views: ${player.profile_views || 0}</div>

    </div>
  `;
}

// ================= ERROR =================
function showError(msg) {
  const el = document.getElementById("profile");

  if (!el) return;

  el.innerHTML = `<h2>${msg}</h2>`;
}
