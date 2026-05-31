console.log("USER PROFILE LOADED");

const API = window.CONFIG?.API_BASE;

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

    const res = await fetch(`${API}/players`);
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
    console.log("LOAD ERROR:", err);
    showError("Error loading profile");
  }
}

// ================= URL PARSER =================
function getUsernameFromURL() {

  const path = window.location.pathname.replace(/^\/+/, "");

  if (!path || path.endsWith(".html")) {
    return null;
  }

  return decodeURIComponent(path);
}

// ================= RENDER =================
function renderProfile(player) {

  const el = document.getElementById("profile");
  if (!el) return;

  const musicHTML = renderMusic(player.music);

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

      ${musicHTML}

    </div>
  `;
}

// ================= SOCIALS =================
function renderSocials(socials = {}) {

  return `
    ${socials.twitter ? `
      <a href="https://twitter.com/${socials.twitter.replace("@", "")}" target="_blank">
        Twitter
      </a>
    ` : ""}

    ${socials.instagram ? `
      <a href="https://instagram.com/${socials.instagram.replace("@", "")}" target="_blank">
        Instagram
      </a>
    ` : ""}

    ${socials.tiktok ? `
      <a href="https://tiktok.com/@${socials.tiktok.replace("@", "")}" target="_blank">
        TikTok
      </a>
    ` : ""}
  `;
}

// ================= MUSIC (SAFE + CLEAN) =================
function renderMusic(link) {

  if (!link || typeof link !== "string") return "";

  const clean = link.trim();

  // SPOTIFY
  if (clean.includes("spotify.com")) {

    const embed = clean.replace(
      "open.spotify.com/",
      "open.spotify.com/embed/"
    );

    return `
      <div class="profile-music">
        <iframe
          style="
            border-radius:18px;
            width:100%;
            max-width:700px;
            margin-top:24px;
          "
          src="${embed}"
          height="152"
          frameborder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    `;
  }

  // YOUTUBE
  if (clean.includes("youtube.com") || clean.includes("youtu.be")) {

    let videoId = "";

    if (clean.includes("watch?v=")) {
      videoId = clean.split("watch?v=")[1];
    }

    if (clean.includes("youtu.be/")) {
      videoId = clean.split("youtu.be/")[1];
    }

    videoId = videoId.split("&")[0];

    return `
      <div class="profile-music">
        <iframe
          width="100%"
          height="380"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allowfullscreen
          style="
            border:none;
            border-radius:18px;
            margin-top:24px;
            max-width:700px;
          "
        ></iframe>
      </div>
    `;
  }

  return "";
}

// ================= ERROR =================
function showError(msg) {
  const el = document.getElementById("profile");
  if (!el) return;

  el.innerHTML = `<h2>${msg}</h2>`;
}
