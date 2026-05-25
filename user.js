const API = CONFIG.API_BASE;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

// ================= LOAD PROFILE =================
async function loadProfile() {
  const username = getUsernameFromURL();

  if (!username) return;

  const player = await getPlayerByUsername(username);

  if (!player) {
    document.getElementById("profileUsername").innerText = "User not found";
    return;
  }

  renderProfile(player);
}

// ================= GET USERNAME FROM URL =================
function getUsernameFromURL() {
  const path = window.location.pathname;

  // /users/theirname
  const parts = path.split("/");

  return parts[parts.length - 1];
}

// ================= RENDER PROFILE =================
function renderProfile(player) {

  document.getElementById("profileUsername").innerText =
    player.username || "Unknown";

  document.getElementById("profilePfp").src =
    player.pfp || "";

  document.getElementById("profileTeam").innerText =
    `Team: ${player.team_id || "None"}`;

  document.getElementById("profilePosition").innerText =
    `Position: ${player.position || "Unknown"}`;

  // stats (default safe values)
  document.getElementById("statPoints").innerText =
    player.points || 0;

  document.getElementById("statGoals").innerText =
    player.goals || 0;

  document.getElementById("statAssists").innerText =
    player.assists || 0;

  document.getElementById("statCS").innerText =
    player.clean_sheets || 0;

  document.getElementById("statViews").innerText =
    player.profile_views || 0;
}
