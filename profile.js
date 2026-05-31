console.log("PROFILE JS LOADED");

const API_BASE = window.CONFIG?.API_BASE;

window.CURRENT_USER = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", async () => {

  await loadProfile();

  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", livePreview);
  });

});

// ================= LOAD =================
async function loadProfile() {

  const token = localStorage.getItem("hmbl_token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {

    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const auth = await res.json();

    if (auth.status !== "success") {
      localStorage.removeItem("hmbl_token");
      window.location.href = "/";
      return;
    }

    window.CURRENT_USER = auth.user;

    const user = window.CURRENT_USER;

    setVal("username", user.username);
    setVal("position", user.position);
    setVal("country", user.country);

    setVal("twitter", user.twitter);
    setVal("instagram", user.instagram);
    setVal("tiktok", user.tiktok);

    setVal("music", user.music);

    await renderProfile(user);

  } catch (err) {
    console.log("LOAD PROFILE ERROR:", err);
  }
}

// ================= LIVE PREVIEW =================
function livePreview() {

  if (!window.CURRENT_USER) return;

  const updated = {
    ...window.CURRENT_USER,

    username: getVal("username"),
    position: getVal("position"),
    country: getVal("country"),

    twitter: getVal("twitter"),
    instagram: getVal("instagram"),
    tiktok: getVal("tiktok"),

    music: getVal("music")
  };

  renderProfile(updated);
}

// ================= RENDER PROFILE (FIXED ASYNC) =================
async function renderProfile(player) {

  const el = document.getElementById("profile");
  if (!el) return;

  const musicHTML = await renderMusic(player.music);

  el.innerHTML = `
    <div class="profile-view">

      <img src="${player.pfp || "https://cdn.discordapp.com/embed/avatars/0.png"}"
           class="profile-pfp-large">

      <h1>${player.username || "Unknown User"}</h1>

      <p class="profile-position">
        ${player.position || "No position set"}
      </p>

      ${player.country ? `
        <div class="profile-country">
          ${player.country}
        </div>
      ` : ""}

      <div class="profile-socials">
        ${renderSocials({
          twitter: player.twitter,
          instagram: player.instagram,
          tiktok: player.tiktok
        })}
      </div>

      <div class="profile-stats">

        <div class="stat-box"><h2>${player.goals || 0}</h2><p>Goals</p></div>
        <div class="stat-box"><h2>${player.assists || 0}</h2><p>Assists</p></div>
        <div class="stat-box"><h2>${player.points || 0}</h2><p>Points</p></div>
        <div class="stat-box"><h2>${player.clean_sheets || 0}</h2><p>Clean Sheets</p></div>

      </div>

      ${musicHTML}

    </div>
  `;
}

// ================= SOCIALS =================
function renderSocials(socials = {}) {

  return `
    ${socials.twitter ? `
      <a href="https://twitter.com/${socials.twitter.replace("@", "")}"
         target="_blank"
         class="social-pill">
        Twitter
      </a>
    ` : ""}

    ${socials.instagram ? `
      <a href="https://instagram.com/${socials.instagram.replace("@", "")}"
         target="_blank"
         class="social-pill">
        Instagram
      </a>
    ` : ""}

    ${socials.tiktok ? `
      <a href="https://tiktok.com/@${socials.tiktok.replace("@", "")}"
         target="_blank"
         class="social-pill">
        TikTok
      </a>
    ` : ""}
  `;
}

// ================= MUSIC =================
async function renderMusic(link) {

  if (!link) return "";

  try {

    const res = await fetch(`${API_BASE}/spotify-track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: link })
    });

    const json = await res.json();

    if (json.status !== "success") return "";

    const t = json.track;

    return `
      <div class="music-card">

        <img src="${t.cover}" class="music-cover" />

        <div class="music-info">

          <div class="music-title">${t.name}</div>

          <div class="music-artist">${t.artist}</div>

          <a href="${t.spotify_url}" target="_blank" class="music-btn">
            Open in Spotify
          </a>

        </div>

      </div>
    `;

  } catch (err) {
    console.log("MUSIC ERROR:", err);
    return "";
  }
}

// ================= SAVE =================
async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

  const payload = {
    username: getVal("username"),
    position: getVal("position"),
    country: getVal("country"),
    twitter: getVal("twitter"),
    instagram: getVal("instagram"),
    tiktok: getVal("tiktok"),
    music: getVal("music")
  };

  try {

    const res = await fetch(`${API_BASE}/players/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (json.status === "success") {

      window.CURRENT_USER = {
        ...window.CURRENT_USER,
        ...payload
      };

      await renderProfile(window.CURRENT_USER);

      alert("Profile saved");

    } else {
      alert(json.message || "Failed to save profile");
    }

  } catch (err) {
    console.log("SAVE ERROR:", err);
  }
}

// ================= HELPERS =================
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

function getVal(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

window.saveProfile = saveProfile;
