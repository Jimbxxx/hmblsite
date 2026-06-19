const API = "https://hmblapi.onrender.com";

async function isAdmin() {
  const token = localStorage.getItem("hmbl_token");
  if (!token) return false;

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data.user?.is_admin === true;
}

async function requireAdmin() {
  const ok = await isAdmin();

  if (!ok) {
    window.location.href = "/";
  }
}


async function openPanel(roleId, url) {

  const token = localStorage.getItem("hmbl_token");

  const res = await fetch(`${API}/auth/check-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      role: roleId
    })
  });

  const data = await res.json();

  if (data.allowed) {
    window.location.href = url;
  } else {
    alert("No permission");
  }
}
