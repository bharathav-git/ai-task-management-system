import React, { useEffect, useState } from "react";
import { BackButton } from "./common";
import { getMyTasks, updateTask } from "../services/api";

export default function Tasks({ onBack }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setTasks(await getMyTasks());
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const changeStatus = async (task) => {
    const status = task.status === "completed" ? "pending" : "completed";

    try {
      await updateTask(task.id, status);
      await loadTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app-page">
      <BackButton onBack={onBack} text="Dashboard" />
      <header className="page-header">
        <h1>My Tasks</h1>
        <p>Manage your assigned tasks.</p>
      </header>

      {loading ? <div className="center-box">Loading tasks...</div> : (
        <div className="list">
          {tasks.length === 0 && <div className="empty-box">No tasks assigned.</div>}

          {tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <div>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <span className={`status ${task.status}`}>{task.status}</span>
              </div>

              <button onClick={() => changeStatus(task)}>
                {task.status === "completed" ? "Mark Pending" : "Mark Completed"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}