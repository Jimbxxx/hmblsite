document.addEventListener("DOMContentLoaded", async () => {
  await requireAdmin();
  loadAdmin();
});

async function loadAdmin() {
  const res = await fetch(`${API}/players`);
  const data = await res.json();

  const users = data.data || {};

  let html = "<h2>Players</h2>";

  Object.values(users).forEach(u => {
    html += `
      <div class="card">
        <b>${u.username}</b><br>
        Admin: ${u.is_admin ? "YES" : "NO"}
      </div>
    `;
  });

  document.getElementById("adminContent").innerHTML = html;
}

function goAdmin() {
  window.location.href = "/admin.html";
}
