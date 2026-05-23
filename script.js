const API = "http://127.0.0.1:8000";

// ---------------- NAV TABS ----------------
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

// ---------------- LOAD DATA ----------------
async function load() {
  try {
    const teamsRes = await fetch(`${API}/teams`);
    const divRes = await fetch(`${API}/divisions`);

    const teams = await teamsRes.json();
    const divisions = await divRes.json();

    renderTeams(teams.data);
    renderDivisions(divisions.data);

  } catch (err) {
    console.log("API error:", err);
  }
}

function renderTeams(data) {
  const el = document.getElementById("teamsList");
  el.innerHTML = "";

  Object.values(data || {}).forEach(t => {
    el.innerHTML += `<div class="item">${t.name}</div>`;
  });
}

function renderDivisions(data) {
  const el = document.getElementById("divisionsList");
  el.innerHTML = "";

  Object.values(data || {}).forEach(d => {
    el.innerHTML += `<div class="item">${d.name}</div>`;
  });
}

// ---------------- INIT ----------------
load();
