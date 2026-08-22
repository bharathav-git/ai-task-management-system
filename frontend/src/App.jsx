import React, { useState } from "react";
import { loginUser } from "./services/api";
import { decodeToken, isAdmin, logout } from "./utils/auth";

import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  if (!loggedIn) {
    return (
      <Login
        onLogin={() => setLoggedIn(true)}
      />
    );
  }

  const user = decodeToken();

  if (!user) {
    logout();
    return null;
  }

  return isAdmin() ? <AdminDashboard /> : <UserDashboard />;
}