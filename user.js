console.log("USER PROFILE LOADED");

// ================= CONFIG =================
window.API = window.CONFIG.API_BASE;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
});

// ================= LOAD PROFILE =================
async function loadUserProfile() {

  const username = getUsernameFromURL();

  if (!username) {
    showError("User not found");
    return;
  }

  try {

    const res = await fetch(`${window.API}/players`);

    const json = await res.json();

    const players = Object.values(json.data || {});

    const player = players.find(
      p =>
        p.username &&
        p.username.toLowerCase() === username.toLowerCase()
    );

    if (!player) {
      showError("User not found");
      return;
    }

    renderProfile(player);

  } catch (err) {

    console.log(err);

    showError("Error loading profile");

  }
}

// ================= URL USERNAME =================
function getUsernameFromURL() {

  const path = window.location.pathname;

  const parts = path.split("/").filter(Boolean);

  return parts[parts.length - 1];

}

// ================= RENDER =================
function renderProfile(player) {

  const el = document.getElementById("profile");

  if (!el) return;

  el.innerHTML = `
  
    <div class="profile-view">

      <img
        src="${player.pfp || "https://cdn.discordapp.com/embed/avatars/0.png"}"
        class="profile-pfp-large"
      >

      <h1>${player.username || "Unknown User"}</h1>

      <p class="profile-position">
        ${player.position || "No position set"}
      </p>

      <div class="profile-stats">

        <div class="stat-box">
          <h2>${player.goals || 0}</h2>
          <p>Goals</p>
        </div>

        <div class="stat-box">
          <h2>${player.assists || 0}</h2>
          <p>Assists</p>
        </div>

        <div class="stat-box">
          <h2>${player.points || 0}</h2>
          <p>Points</p>
        </div>

        <div class="stat-box">
          <h2>${player.clean_sheets || 0}</h2>
          <p>Clean Sheets</p>
        </div>

      </div>

    </div>

  `;
}

// ================= ERROR =================
function showError(msg) {

  const el = document.getElementById("profile");

  if (!el) return;

  el.innerHTML = `<h2>${msg}</h2>`;
}
