import React, { useEffect, useState } from "react";
import { getMyTasks } from "../services/api";
import { logout } from "../utils/auth";

import Tasks from "./Tasks";
import Documents from "./Documents";
import AIAssistant from "./AIAssistant";

export default function UserDashboard() {
  const [page, setPage] = useState("dashboard");
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      setTasks(await getMyTasks());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (page === "tasks") {
    return <Tasks onBack={() => { setPage("dashboard"); loadTasks(); }} />;
  }

  if (page === "documents") {
    return <Documents onBack={() => setPage("dashboard")} />;
  }

  if (page === "ai") {
    return <AIAssistant onBack={() => setPage("dashboard")} />;
  }

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="app-page">
      <Navbar title="TaskFlow" onLogout={logout} />

      <header className="page-header">
        <h1>Welcome to TaskFlow 👋</h1>
        <p>Manage your tasks and documents intelligently.</p>
      </header>

      <div className="card-grid">
        <DashboardCard icon="✓" title="Tasks">
          <p>You have <strong>{tasks.length}</strong> assigned tasks.</p>
          <p>Completed: <strong>{completed}</strong></p>
          <p>Pending: <strong>{pending}</strong></p>
          <button onClick={() => setPage("tasks")}>View Tasks →</button>
        </DashboardCard>

        <DashboardCard icon="📄" title="Documents">
          <p>Upload and search your documents.</p>
          <button onClick={() => setPage("documents")}>Documents →</button>
        </DashboardCard>

        <DashboardCard icon="🤖" title="AI Assistant">
          <p>Ask questions from your uploaded documents.</p>
          <button onClick={() => setPage("ai")}>Ask AI →</button>
        </DashboardCard>

      </div>
    </div>
  );
}

function DashboardCard({ icon, title, children }) {
  return (
    <div className="dashboard-card">
      <div className="card-icon">{icon}</div>
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

export function Navbar({ title, onLogout, badge }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="brand-icon small">AI</span>
        <strong>{title}</strong>
        {badge && <span className="role-badge">{badge}</span>}
      </div>
      <button className="secondary-button" onClick={onLogout}>Logout</button>
    </nav>
  );
}