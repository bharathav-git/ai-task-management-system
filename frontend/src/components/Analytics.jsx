import React, { useEffect, useState } from "react";
import { BackButton } from "./common";
import { getAnalytics } from "../services/api";

export default function Analytics({ onBack }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="app-page">
        <BackButton onBack={onBack} text="Dashboard" />
        <div className="error-box">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app-page">
        <BackButton onBack={onBack} text="Dashboard" />
        <div className="center-box">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <BackButton onBack={onBack} text="Dashboard" />

      <header className="page-header">
        <div className="big-icon">📊</div>
        <h1>Analytics</h1>
        <p>View task and document search statistics.</p>
      </header>

      <div className="stats-grid">
        <Stat title="Total Tasks" value={data.total_tasks ?? 0} icon="📋" />
        <Stat title="Completed Tasks" value={data.completed_tasks ?? 0} icon="✅" />
        <Stat title="Pending Tasks" value={data.pending_tasks ?? 0} icon="⏳" />
      </div>

      <div className="wide-card">
        <h2>🔎 Most Searched Queries</h2>

        {(data.most_searched_queries || []).map((item, index) => (
          <div className="query-row" key={index}>
            <span>{item.query}</span>
            <strong>{item.count} searches</strong>
          </div>
        ))}

        {(!data.most_searched_queries ||
          data.most_searched_queries.length === 0) && (
          <div className="empty-box">No searches yet.</div>
        )}
      </div>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="big-icon">{icon}</div>
      <h3>{title}</h3>
      <strong>{value}</strong>
    </div>
  );
}