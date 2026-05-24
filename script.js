const API = "http://api.hmbl.pro:12994";

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", load);

// ---------------- LOAD ----------------
async function load() {
  try {
    const [teamsRes, divRes] = await Promise.all([
      fetch(`${API}/teams`),
      fetch(`${API}/divisions`)
    ]);

    const teamsJson = await teamsRes.json();
    const divJson = await divRes.json();

    const teams = teamsJson.data || teamsJson || {};
    const divisions = divJson.data || divJson || {};

    renderTeams(teams);
    renderDivisions(divisions);

  } catch (err) {
    console.log("API ERROR:", err);
  }
}

// ---------------- TEAMS ----------------
function renderTeams(data) {
  const el = document.getElementById("teamsList");
  if (!el) return;

  el.innerHTML = "";

  Object.values(data).forEach(team => {

    const coManagers =
      Array.isArray(team.co_managers) && team.co_managers.length > 0
        ? team.co_managers.join(", ")
        : "None";

    el.innerHTML += `
      <div class="team-card">

        <div class="team-name">
          ${team.name || "Unnamed Team"}
        </div>

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

// ---------------- DIVISIONS ----------------
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

// ---------------- MOUSE GLOW ----------------
const glow = document.getElementById("glow");

if (glow) {
  document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// ---------------- INIT ----------------
load();
