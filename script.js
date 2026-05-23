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
  try {
    const teamsRes = await fetch("http://127.0.0.1:8000/teams");
    const divisionsRes = await fetch("http://127.0.0.1:8000/divisions");

    const teamsJson = await teamsRes.json();
    const divisionsJson = await divisionsRes.json();

    renderTeams(teamsJson.data);
    renderDivisions(divisionsJson.data);

  } catch (err) {
    console.log("API error:", err);
  }
}

function renderTeams(data) {
  const el = document.getElementById("teams");
  el.innerHTML = "";

  Object.values(data || {}).forEach(team => {
    el.innerHTML += `
      <div>
        <p>⚽ ${team.name}</p>
        <small>${team.division}</small>
      </div>
      <hr>
    `;
  });
}

function renderDivisions(data) {
  const el = document.getElementById("divisions");
  el.innerHTML = "";

  Object.values(data || {}).forEach(div => {
    el.innerHTML += `<p>🏆 ${div.name}</p>`;
  });
}
