const API = CONFIG.API_BASE;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

// ================= LOAD PROFILE =================
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

    const json = await res.json();

    console.log(json);

    if (json.status !== "success") {
      window.location.href = "/";
      return;
    }

    const user = json.user;

    // ================= USERNAME =================
    const usernameEl = document.getElementById("username");

    if (usernameEl) {
      usernameEl.value = user.username || "";
    }

    // ================= POSITION =================
    const positionEl = document.getElementById("position");

    if (positionEl) {
      positionEl.value = user.position || "";
    }

    // ================= PFP =================
    const pfpEl = document.getElementById("pfp");

    if (pfpEl) {

      console.log("PFP URL:", user.pfp);

      pfpEl.src =
        user.pfp ||
        "https://cdn.discordapp.com/embed/avatars/0.png";

      pfpEl.onerror = () => {
        pfpEl.src =
          "https://cdn.discordapp.com/embed/avatars/0.png";
      };
    }

  } catch (err) {

    console.log("Profile load error:", err);

  }
}

// ================= SAVE =================
async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

  const username =
    document.getElementById("username")
    ?.value
    ?.trim();

  const position =
    document.getElementById("position")
    ?.value
    ?.trim();

  if (!username) {
    alert("Username required");
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

        body: JSON.stringify({
          username,
          position
        })
      }
    );

    const json = await res.json();

    console.log(json);

    if (json.status === "success") {
      window.location.href = "/";
    }

  } catch (err) {

    console.log("Save error:", err);

  }
}

// ================= SKIP =================
function skipProfile() {
  window.location.href = "/";
}

// expose
window.saveProfile = saveProfile;
window.skipProfile = skipProfile;
