console.log("PROFILE JS LOADED");

// ================= CONFIG =================
const API = window.CONFIG?.API_BASE;

if (!API) {
  console.error("CONFIG NOT LOADED");
}

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

    const authRes = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const auth = await authRes.json();

    console.log("AUTH:", auth);

    if (auth.status !== "success") {
      localStorage.removeItem("hmbl_token");
      window.location.href = "/";
      return;
    }

    const user = auth.user;

    console.log("USER:", user);

    // ================= FILL INPUTS =================
    document.getElementById("username").value = user.username || "";
    document.getElementById("position").value = user.position || "";

    // ================= PFP =================
    const pfp = document.getElementById("pfp");

    if (pfp) {
      const url =
        user.pfp ||
        "https://cdn.discordapp.com/embed/avatars/0.png";

      pfp.src = url;

      pfp.onerror = () => {
        pfp.src = "https://cdn.discordapp.com/embed/avatars/0.png";
      };
    }

  } catch (err) {
    console.log("PROFILE ERROR:", err);
  }
}

// ================= SAVE =================
async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

  const username = document.getElementById("username")?.value?.trim();
  const position = document.getElementById("position")?.value?.trim();

  if (!username) return;

  try {

    const res = await fetch(`${API}/players/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username, position })
    });

    const json = await res.json();

    console.log("SAVE:", json);

    if (json.status === "success") {
      window.location.href = "/";
    }

  } catch (err) {
    console.log("SAVE ERROR:", err);
  }
}

// ================= EXPOSE =================
window.saveProfile = saveProfile;
window.skipProfile = () => window.location.href = "/";
