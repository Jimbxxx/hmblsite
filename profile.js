const API = CONFIG.API_BASE;

let CURRENT = null;

// ================= LOAD =================
async function loadProfile() {

  const token = localStorage.getItem("hmbl_token");
  if (!token) return (window.location.href = "/");

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status !== "success") return;

  CURRENT = json;

  document.getElementById("username").value = json.user.username || "";
  document.getElementById("position").value = json.profile?.position || "";

  const pfp = json.profile?.pfp;
  if (pfp) document.getElementById("pfp").src = pfp;

  // hide skip if NOT new user
  const url = new URL(window.location.href);
  const isNew = url.searchParams.get("new");

  if (isNew === "false") {
    document.getElementById("title").innerText = "Edit Profile";
    document.getElementById("skipBtn").style.display = "none";
  }
}

// ================= SAVE =================
async function saveProfile() {

  const token = localStorage.getItem("hmbl_token");

  const username = document.getElementById("username").value;
  const position = document.getElementById("position").value;

  await fetch(`${API}/players/update-profile`, {
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

  window.location.href = "/";
}

// ================= SKIP =================
function skipProfile() {
  window.location.href = "/";
}

loadProfile();
