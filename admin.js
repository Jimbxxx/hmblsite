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
