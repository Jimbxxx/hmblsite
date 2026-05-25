const API = CONFIG.API_BASE;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
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

    const json = await res.json();

    console.log("AUTH RESPONSE:", json);

    if (json.status !== "success") {
      localStorage.removeItem("hmbl_token");
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

    // ================= PFP (WORKING) =================
    const pfpEl = document.getElementById("pfp");

    if (pfpEl) {
      const url =
        user.pfp ||
        "https://cdn.discordapp.com/embed/avatars/0.png";

      console.log("SETTING PFP:", url);

      pfpEl.src = url;

      pfpEl.onerror = () => {
        pfpEl.src = "https://cdn.discordapp.com/embed/avatars/0.png";
      };
    }

  } catch (err) {
    console.log("Profile load error:", err);
  }
}

// ================= SAVE =================
async function saveProfile() {
  const token = localStorage.getItem("hmbl_token");

  const username = document.getElementById("username")?.value?.trim();
  const position = document.getElementById("position")?.value?.trim();

  if (!username) {
    alert("Username required");
    return;
  }

  try {
    const res = await fetch(`${API}/players/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        position
      })
    });

    const json = await res.json();

    console.log("SAVE RESPONSE:", json);

    if (json.status === "success") {
      window.location.href = "/";
    } else {
      alert("Failed to save profile");
    }

  } catch (err) {
    console.log("Save error:", err);
  }
}

// ================= SKIP =================
function skipProfile() {
  window.location.href = "/";
}

// expose to HTML
window.saveProfile = saveProfile;
window.skipProfile = skipProfile;
