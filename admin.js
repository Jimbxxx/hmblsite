function isAdmin() {
  const user = JSON.parse(localStorage.getItem("hmbl_user") || "null");
  return user?.is_admin === true;
}

function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = "/";
  }
}
