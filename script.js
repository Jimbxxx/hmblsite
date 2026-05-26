const API = "https://hmblapi.onrender.com";

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  // HARD GUARD: prevent double execution
  if (window.__HMBL_INIT__) return;
  window.__HMBL_INIT__ = true;

  handleAuthRedirect();
  setupAuthUI();

  // DO NOT run homepage logic on profile page
  if (window.location.pathname.includes("profile.html")) return;

  load();
  setupTabs();
  setupGlow();
});

// ================= TOKEN HANDLER =================
function handleAuthRedirect() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  if (!token) return;

  // prevent repeated writes
  if (localStorage.getItem("hmbl_token") === token) return;

  localStorage.setItem("hmbl_token", token);

  // clean URL without reload
  window.history.replaceState({}, document.title, "/");
}

// ================= TAB SYSTEM =================
function setupTabs() {
  const buttons = document.querySelectorAll("[data-tab]");
  const tabs = document.querySelectorAll(".tab");

  if (!buttons.length || !tabs.length) return;

  buttons.forEach(btn => {
    btn.onclick = () => {
      const target = btn.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));

      const active = document.getElementById(target);
      if (active) active.classList.add("active");
    };
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

    renderTeams(teamsJson.data || {});
    renderDivisions(divJson.data || {});

  } catch (err) {
    console.log("API ERROR:", err);
  }
}

// ================= TEAMS =================
function renderTeams(data) {
  const el = document.getElementById("teamsList");
  if (!el) return;

  el.innerHTML = "";

  Object.values(data).forEach(team => {
    const coManagers =
      Array.isArray(team.co_managers) && team.co_managers.length
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

  Object.values(data).forEach(div => {
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

// ================= AUTH UI =================
function setupAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");

  const token = localStorage.getItem("hmbl_token");

  if (loginBtn) {
    loginBtn.onclick = () => {
      window.location.href = `${API}/auth/discord/login`;
    };
  }

  // SINGLE STATE UPDATE (no timeout, no loop risk)
  if (token) {
    if (loginBtn) loginBtn.style.display = "none";
    if (profileBtn) profileBtn.style.display = "inline-block";

    if (profileBtn && !profileBtn.dataset.bound) {
      profileBtn.dataset.bound = "true";
      profileBtn.onclick = () => {
        const user = JSON.parse(localStorage.getItem("hmbl_user"));

        if (!user) return;
        
        window.location.href = `/${user.username}`;
      };
    }
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (profileBtn) profileBtn.style.display = "none";
  }
}

// ================= PROFILE PAGE =================
function goProfile() {
  window.location.href = "/profile.html";
}
