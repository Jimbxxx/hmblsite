console.log("PROFILE JS LOADED");

const API = window.CONFIG?.API_BASE;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

// ================= LOAD =================
async function loadProfile() {

  const token = localStorage.getItem("hmbl_token");
  if (!token) return window.location.href = "/";

  try {

    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const auth = await res.json();

    if (auth.status !== "success") {
      localStorage.removeItem("hmbl_token");
      return window.location.href = "/";
    }

    const user = auth.user;

    // ================= INPUTS =================
    setVal("username", user.username);
    setVal("position", user.position);
    setVal("country", user.country);

    const socials = user.socials || {};

    setVal("discord", socials.discord);
    setVal("twitter", socials.twitter);
    setVal("instagram", socials.instagram);
    setVal("tiktok", socials.tiktok);

    setVal("music", user.music);

    // ================= PFP =================
    const pfp = document.getElementById("pfp");

    if (pfp) {
      pfp.src = user.pfp || "https://cdn.discordapp.com/embed/avatars/0.png";
    }

    // ================= DISPLAY MODE =================
    renderDisplay(user);

  } catch (err) {
    console.log(err);
  }
}

// ================= HELPERS =================
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

// ================= RENDER PROFILE =================
function renderDisplay(user) {

  const displayName = document.getElementById("displayName");
  const displayPos = document.getElementById("displayPosition");
  const displayCountry = document.getElementById("displayCountry");
  const socialsView = document.getElementById("socialsView");
  const musicView = document.getElementById("musicView");
  const stats = document.getElementById("stats");

  if (displayName) displayName.textContent = user.username;
  if (displayPos) displayPos.textContent = user.position || "No position";
  if (displayCountry) displayCountry.textContent = user.country || "Unknown";

  // socials
  if (socialsView) {
    const s = user.socials || {};
    socialsView.innerHTML = `
      <div>Discord: ${s.discord || "-"}</div>
      <div>Twitter: ${s.twitter || "-"}</div>
      <div>Instagram: ${s.instagram || "-"}</div>
      <div>TikTok: ${s.tiktok || "-"}</div>
    `;
  }

  // music
  if (musicView) {
    musicView.innerHTML = user.music
      ? `<a href="${user.music}" target="_blank">🎵 Music Link</a>`
      : "";
  }

  // stats
  if (stats) {
    stats.innerHTML = `
      <div>Goals: ${user.goals || 0}</div>
      <div>Assists: ${user.assists || 0}</div>
      <div>Points: ${user.points || 0}</div>
      <div>Clean Sheets: ${user.clean_sheets || 0}</div>
    `;
  }
}

// ================= SAVE =================
async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

  const payload = {
    username: getVal("username"),
    position: getVal("position"),
    country: getVal("country"),

    socials: {
      discord: getVal("discord"),
      twitter: getVal("twitter"),
      instagram: getVal("instagram"),
      tiktok: getVal("tiktok")
    },

    music: getVal("music")
  };

  // enforce position
  if (!payload.position) {
    alert("Pick a position");
    return;
  }

  try {

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
      window.location.href = "/";
    }

  } catch (err) {
    console.log(err);
  }
}

// ================= HELPERS =================
function getVal(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function toggleEdit() {
  const edit = document.getElementById("editPanel");
  if (!edit) return;

  edit.style.display =
    edit.style.display === "none" ? "block" : "none";
}

window.saveProfile = saveProfile;
window.toggleEdit = toggleEdit;
window.skipProfile = () => (window.location.href = "/");
