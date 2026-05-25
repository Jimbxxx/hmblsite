const API = "https://hmblapi.onrender.com";

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  load();
  setupTabs();
  setupGlow();
  setupLoginUI();
});

// ================= TAB SYSTEM =================
function setupTabs() {
  const buttons = document.querySelectorAll("[data-tab]");
  const tabs = document.querySelectorAll(".tab");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));

      const active = document.getElementById(target);
      if (active) active.classList.add("active");
    });
  });
}

// ================= LOAD API =================
async function load() {
  try {
    const [teamsRes, divRes] = await Promise.all([
      fetch(`${API}/teams`),
      fetch(`${API}/divisions`)
    ]);

    const teamsJson = await teamsRes.json();
    const divJson = await divRes.json();

    const teams = teamsJson.data || {};
    const divisions = divJson.data || {};

    renderTeams(teams);
    renderDivisions(divisions);

  } catch (err) {
    console.log("API ERROR:", err);
  }
}

// ================= TEAMS =================
function renderTeams(data) {
  const el = document.getElementById("teamsList");
  if (!el) return;

  el.innerHTML = "";

  Object.values(data || {}).forEach(team => {

    const coManagers =
      Array.isArray(team.co_managers) && team.co_managers.length > 0
        ? team.co_managers.join(", ")
        : "None";

    el.innerHTML += `
      <div class="team-card">
        <div class="team-name">${team.name || "Unnamed Team"}</div>

        <div class="team-meta">
          Division: ${team.division || "Unknown"}<br>
          Manager: ${team.manager || "None"}<br>
          Co-Managers: ${coManagers}<br>
          Position: ${team.position || "TBD"}
        </div>
      </div>
    `;
  });
}

// ================= DIVISIONS =================
function renderDivisions(data) {
  const el = document.getElementById("divisionsList");
  if (!el) return;

  el.innerHTML = "";

  Object.values(data || {}).forEach(div => {
    el.innerHTML += `
      <div class="division-pill">
        ${div.name || "Unnamed Division"}
      </div>
    `;
  });
}

// ================= MOUSE GLOW =================
function setupGlow() {
  const glow = document.getElementById("glow");
  if (!glow) return;

  document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// ================= AUTH UI (NEW) =================
function setupLoginUI() {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = `${API}/auth/discord/login`;
    });
  }

  // check if user is logged in
  const token = localStorage.getItem("hmbl_token");

  if (token) {
    if (loginBtn) loginBtn.style.display = "none";
    if (profileBtn) profileBtn.style.display = "inline-block";

    profileBtn.addEventListener("click", () => {
      const user = JSON.parse(localStorage.getItem("hmbl_user"));
      if (user?.username) {
        window.location.href = `/users/${user.username}`;
      }
    });
  }
}
