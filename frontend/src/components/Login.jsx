import React, { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("access_token", data.access_token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <section className="login-brand">
          <div className="brand">
            <span className="brand-icon">AI</span>
            <strong>TaskFlow</strong>
          </div>
          <h1>Manage your tasks intelligently.</h1>
          <p>
            Organize tasks, manage documents and get AI-powered answers
            from your knowledge base.
          </p>
          <div className="feature-list">
            <span>✓ Smart Task Management</span>
            <span>✓ AI Document Assistant</span>
            <span>✓ Role Based Access</span>
          </div>
        </section>

        <section className="login-box">
          <h2>Welcome back</h2>
          <p>Login to your TaskFlow account</p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          {error && <div className="error-box">{error}</div>}
          <small>AI Task Management System</small>
        </section>
      </div>
    </div>
  );
}