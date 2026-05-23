const API = "http://127.0.0.1:8000";

// ---------------- TABS ----------------
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.remove("active");
  });

  document.getElementById(tab).classList.add("active");
}

// ---------------- API LOAD ----------------
async function load() {
  try {
    const teamsRes = await fetch(`${API}/teams`);
    const divRes = await fetch(`${API}/divisions`);

    const teams = await teamsRes.json();
    const divisions = await divRes.json();

    renderTeams(teams.data);
    renderDivisions(divisions.data);

  } catch (err) {
    console.log(err);
  }
}

// ---------------- TEAMS ----------------
function renderTeams(data) {
  const el = document.getElementById("teamsList");

  el.innerHTML = "";

  Object.values(data || {}).forEach(team => {

    const coManagers =
      (team.co_managers || []).join(", ") || "None";

    el.innerHTML += `
      <div class="team-card">

        <div class="team-name">
          ${team.name}
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

  el.innerHTML = "";

  Object.values(data || {}).forEach(div => {

    el.innerHTML += `
      <div class="division-pill">
        ${div.name}
      </div>
    `;
  });
}

// ---------------- MOUSE GLOW ----------------
const glow = document.getElementById("glow");

document.addEventListener("mousemove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ---------------- INIT ----------------
load();
