const API = "http://127.0.0.1:8000";

// NAV
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

// LOAD
async function load() {
  const teamsRes = await fetch(`${API}/teams`);
  const divRes = await fetch(`${API}/divisions`);

  const teams = await teamsRes.json();
  const divisions = await divRes.json();

  renderTeams(teams.data);
  renderDivisions(divisions.data);
}

// TEAMS (RICH UI)
function renderTeams(data) {
  const el = document.getElementById("teamsList");
  el.innerHTML = "";

  Object.values(data || {}).forEach(team => {

    const coManagers = (team.co_managers || []).join(", ") || "None";

    el.innerHTML += `
      <div class="team-card">

        <div class="team-title">${team.name}</div>

        <div class="meta">
          Division: ${team.division || "Unknown"} <br>
          Manager: ${team.manager || "None"} <br>
          Co-Managers: ${coManagers} <br>
          Table Position: ${team.position || "TBD"}
        </div>

      </div>
    `;
  });
}

// DIVISIONS
function renderDivisions(data) {
  const el = document.getElementById("divisionsList");
  el.innerHTML = "";

  Object.values(data || {}).forEach(div => {
    el.innerHTML += `<div class="item">${div.name}</div>`;
  });
}

load();
