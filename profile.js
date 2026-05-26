console.log("PROFILE LOADED");

const API = window.CONFIG.API_BASE;

let CURRENT = null;
let EDIT = false;

document.addEventListener("DOMContentLoaded", load);

async function load() {

  const token = localStorage.getItem("hmbl_token");
  if (!token) return location.href = "/";

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (data.status !== "success") return;

  const user = data.user;

  const playersRes = await fetch(`${API}/players`);
  const players = Object.values((await playersRes.json()).data);

  const player = players.find(p => p.discord_id === user.discord_id);

  CURRENT = player;

  render(player);
}

function render(p) {

  // PFP
  document.getElementById("pfp").src =
    p.pfp || "https://cdn.discordapp.com/embed/avatars/0.png";

  // HEADER
  document.getElementById("displayName").textContent = p.username;
  document.getElementById("displayPosition").textContent = p.position || "No position";
  document.getElementById("displayCountry").textContent = p.country || "";

  // INPUTS
  username.value = p.username || "";
  position.value = p.position || "";
  country.value = p.country || "";

  discord.value = p.socials?.discord || "";
  twitter.value = p.socials?.twitter || "";
  instagram.value = p.socials?.instagram || "";
  tiktok.value = p.socials?.tiktok || "";
  music.value = p.music || "";

  // STATS
  stats.innerHTML = `
    <div class="stat-box"><h2>${p.goals}</h2><p>Goals</p></div>
    <div class="stat-box"><h2>${p.assists}</h2><p>Assists</p></div>
    <div class="stat-box"><h2>${p.points}</h2><p>Points</p></div>
    <div class="stat-box"><h2>${p.clean_sheets}</h2><p>CS</p></div>
  `;

  // SOCIALS VIEW
  socialsView.innerHTML = `
    ${p.socials?.discord ? `<div>Discord: ${p.socials.discord}</div>` : ""}
    ${p.socials?.twitter ? `<div>Twitter: ${p.socials.twitter}</div>` : ""}
    ${p.socials?.instagram ? `<div>Instagram: ${p.socials.instagram}</div>` : ""}
    ${p.socials?.tiktok ? `<div>TikTok: ${p.socials.tiktok}</div>` : ""}
  `;

  // MUSIC
  musicView.innerHTML = p.music
    ? `<iframe width="100%" height="120" src="${p.music}" frameborder="0"></iframe>`
    : "";
}

function toggleEdit() {
  EDIT = !EDIT;

  editPanel.style.display = EDIT ? "block" : "none";
}

async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

  const payload = {
    username: username.value,
    position: position.value,
    country: country.value,
    socials: {
      discord: discord.value,
      twitter: twitter.value,
      instagram: instagram.value,
      tiktok: tiktok.value
    },
    music: music.value
  };

  const res = await fetch(`${API}/players/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const json = await res.json();

  if (json.status === "success") {
    location.reload();
  }
}

window.saveProfile = saveProfile;
window.toggleEdit = toggleEdit;
