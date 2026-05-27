console.log("PROFILE JS LOADED");

const API = window.CONFIG?.API_BASE;

let CURRENT_USER = null;

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

    const res = await fetch(`${API}/auth/me`, {
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

    CURRENT_USER = auth.user;

    const user = CURRENT_USER;

    // ================= INPUTS =================
    setVal("username", user.username);
    setVal("position", user.position);
    setVal("country", user.country);

    const socials = user.socials || {};

    setVal("twitter", socials.twitter);
    setVal("instagram", socials.instagram);
    setVal("tiktok", socials.tiktok);

    setVal("music", user.music);

    // ================= PFP =================
    const pfp = document.getElementById("pfp");

    if (pfp) {
      pfp.src =
        user.pfp ||
        "https://cdn.discordapp.com/embed/avatars/0.png";
    }

    // ================= RENDER =================
    renderDisplay(user);
    livePreview();

  } catch (err) {
    console.log(err);
  }
}

// ================= DISPLAY =================
function renderDisplay(user) {

  // NAME
  document.getElementById("displayName").textContent =
    user.username || "Unknown";

  // POSITION
  document.getElementById("displayPosition").textContent =
    user.position || "No Position";

  // COUNTRY
  document.getElementById("displayCountry").textContent =
    user.country || "Unknown";

  // SOCIALS
  renderSocials(user.socials || {});

  // MUSIC
  renderMusic(user.music);

  // STATS
  renderStats(user);

}

// ================= LIVE PREVIEW =================
function livePreview() {

  document.getElementById("displayName").textContent =
    getVal("username") || "Username";

  document.getElementById("displayPosition").textContent =
    getVal("position") || "Position";

  document.getElementById("displayCountry").textContent =
    getVal("country") || "Country";

  renderSocials({
    twitter: getVal("twitter"),
    instagram: getVal("instagram"),
    tiktok: getVal("tiktok")
  });

  renderMusic(getVal("music"));

}

// ================= SOCIALS =================
function renderSocials(socials) {

  const socialsView =
    document.getElementById("socialsView");

  socialsView.innerHTML = `
    ${socials.twitter ? `
      <a
        href="https://twitter.com/${socials.twitter.replace("@", "")}"
        target="_blank"
        class="social-pill"
      >
        Twitter
      </a>
    ` : ""}

    ${socials.instagram ? `
      <a
        href="https://instagram.com/${socials.instagram.replace("@", "")}"
        target="_blank"
        class="social-pill"
      >
        Instagram
      </a>
    ` : ""}

    ${socials.tiktok ? `
      <a
        href="https://tiktok.com/@${socials.tiktok.replace("@", "")}"
        target="_blank"
        class="social-pill"
      >
        TikTok
      </a>
    ` : ""}
  `;

}

// ================= MUSIC =================
function renderMusic(link) {

  const musicView =
    document.getElementById("musicView");

  if (!link) {
    musicView.innerHTML = "";
    return;
  }

  // SPOTIFY
  if (link.includes("spotify.com")) {

    const cleaned = link
      .replace("open.spotify.com/", "open.spotify.com/embed/");

    musicView.innerHTML = `
      <iframe
        style="
          border-radius:16px;
          margin-top:16px;
        "
        src="${cleaned}"
        width="100%"
        height="152"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    `;

    return;
  }

  // YOUTUBE
  if (
    link.includes("youtube.com") ||
    link.includes("youtu.be")
  ) {

    let videoId = "";

    if (link.includes("watch?v=")) {
      videoId = link.split("watch?v=")[1];
    }

    if (link.includes("youtu.be/")) {
      videoId = link.split("youtu.be/")[1];
    }

    videoId = videoId.split("&")[0];

    musicView.innerHTML = `
      <iframe
        width="100%"
        height="220"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0"
        allowfullscreen
        style="
          border:none;
          border-radius:18px;
          margin-top:16px;
        "
      ></iframe>
    `;

    return;
  }

  // FALLBACK
  musicView.innerHTML = `
    <a
      href="${link}"
      target="_blank"
      class="social-pill"
    >
      Open Music
    </a>
  `;
}

// ================= STATS =================
function renderStats(user) {

  const stats =
    document.getElementById("stats");

  stats.innerHTML = `

    <div>
      <h2>${user.goals || 0}</h2>
      <p>Goals</p>
    </div>

    <div>
      <h2>${user.assists || 0}</h2>
      <p>Assists</p>
    </div>

    <div>
      <h2>${user.points || 0}</h2>
      <p>Points</p>
    </div>

    <div>
      <h2>${user.clean_sheets || 0}</h2>
      <p>Clean Sheets</p>
    </div>

  `;
}

// ================= SAVE =================
async function saveProfile() {

  const token =
    localStorage.getItem("hmbl_token");

  const payload = {

    username: getVal("username"),

    position: getVal("position"),

    country: getVal("country"),

    socials: {

      twitter: getVal("twitter"),

      instagram: getVal("instagram"),

      tiktok: getVal("tiktok")
    },

    music: getVal("music")
  };

  if (!payload.position) {
    alert("Pick a position");
    return;
  }

  try {

    const res = await fetch(
      `${API}/players/update-profile`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(payload)
      }
    );

    const json = await res.json();

    if (json.status === "success") {

      CURRENT_USER = {
        ...CURRENT_USER,
        ...payload
      };

      renderDisplay(CURRENT_USER);

    }

  } catch (err) {
    console.log(err);
  }
}

// ================= HELPERS =================
function setVal(id, val) {

  const el = document.getElementById(id);

  if (el) {
    el.value = val || "";
  }
}

function getVal(id) {

  return document
    .getElementById(id)
    ?.value
    ?.trim() || "";
}

window.saveProfile = saveProfile;
