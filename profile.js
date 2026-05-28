console.log("PROFILE JS LOADED");

const API = window.CONFIG?.API_BASE;

let CURRENT_USER = null;

document.addEventListener("DOMContentLoaded", async () => {

  await loadProfile();

  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", livePreview);
  });

});

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

    setVal("username", user.username);
    setVal("position", user.position);
    setVal("country", user.country);

    const socials = user.socials || {};

    setVal("twitter", socials.twitter);
    setVal("instagram", socials.instagram);
    setVal("tiktok", socials.tiktok);

    setVal("music", user.music);

    renderProfile(user);

  } catch (err) {
    console.log(err);
  }
}

function livePreview() {

  const updated = {

    ...CURRENT_USER,

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

  renderProfile(updated);
}

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

      <div class="profile-socials">

        ${renderSocials(player.socials || {})}

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

      <div class="profile-music">
        ${renderMusic(player.music)}
      </div>

    </div>
  `;
}

function renderSocials(socials) {

  return `
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

function renderMusic(link) {

  if (!link) return "";

  if (link.includes("spotify.com")) {

    const cleaned = link.replace(
      "open.spotify.com/",
      "open.spotify.com/embed/"
    );

    return `
      <iframe
        style="
          border-radius:18px;
          width:100%;
        "
        src="${cleaned}"
        height="152"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    `;
  }

  return "";
}

async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

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

      renderProfile(CURRENT_USER);

    }

  } catch (err) {
    console.log(err);
  }
}

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
