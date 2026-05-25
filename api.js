const API = window.CONFIG.API_BASE;

// GET helpers
async function getTeams() {
  const res = await fetch(`${API}/teams`);
  return res.json();
}

async function getDivisions() {
  const res = await fetch(`${API}/divisions`);
  return res.json();
}

async function getPlayers() {
  const res = await fetch(`${API}/players`);
  return res.json();
}

// USER PROFILE FETCH
async function getPlayerByUsername(username) {
  const res = await fetch(`${API}/players`);
  const data = await res.json();

  const players = data.data || {};

  return Object.values(players).find(
    p => p.username === username
  );
}
