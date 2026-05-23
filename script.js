const PASSWORD = "hmbl123"; // change later

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function checkPassword() {
  const input = document.getElementById("passwordInput").value;

  if (input === PASSWORD) {
    document.getElementById("loginModal").style.display = "none";
    document.querySelector(".container").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    loadData();
  } else {
    document.getElementById("error").innerText = "Wrong password";
  }
}

async function loadData() {
  const teamsRes = await fetch("http://127.0.0.1:8000/teams");
  const divisionsRes = await fetch("http://127.0.0.1:8000/divisions");

  const teams = await teamsRes.json();
  const divisions = await divisionsRes.json();

  renderTeams(teams.data);
  renderDivisions(divisions.data);
}

function renderTeams(data) {
  const el = document.getElementById("teams");
  el.innerHTML = "";

  data.forEach(t => {
    el.innerHTML += `<p>⚽ ${t.name}</p>`;
  });
}

function renderDivisions(data) {
  const el = document.getElementById("divisions");
  el.innerHTML = "";

  data.forEach(d => {
    el.innerHTML += `<p>🏆 ${d.name}</p>`;
  });
}
