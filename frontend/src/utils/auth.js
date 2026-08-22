export const getToken = () => localStorage.getItem("access_token");

export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
    return decoded;
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = decodeToken();
  return user?.role_id === 1;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  window.location.reload();
};