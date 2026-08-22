import React, { useState } from "react";
import { BackButton } from "./common";
import { createTask } from "../services/api";

export default function AdminTasks({ onBack }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await createTask({
        title,
        description,
        assigned_to: Number(assignedTo)
      });

      setMessage(`Task "${data.title}" created successfully.`);
      setTitle("");
      setDescription("");
      setAssignedTo("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-page">
      <BackButton onBack={onBack} text="Admin Dashboard" />

      <header className="page-header">
        <h1>Task Management</h1>
        <p>Create and assign tasks to users.</p>
      </header>

      <div className="form-card">
        <h2>Create New Task</h2>

        <form onSubmit={submit}>
          <label>Task Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title" required />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description" rows="5" />

          <label>Assign To User ID</label>
          <input type="number" min="1" value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Enter user ID" required />

          <button>Create Task →</button>
        </form>

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  );
}