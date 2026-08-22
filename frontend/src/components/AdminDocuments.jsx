import React, { useState } from "react";
import { BackButton } from "./common";
import { uploadDocument } from "../services/api";

export default function AdminDocuments({ onBack }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a PDF or TXT file.");
      return;
    }

    try {
      setLoading(true);
      const data = await uploadDocument(file);
      setMessage(`Document "${data.filename}" uploaded successfully.`);
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <BackButton onBack={onBack} text="Admin Dashboard" />

      <header className="page-header">
        <div className="big-icon">📄</div>
        <h1>Document Management</h1>
        <p>Upload PDF or TXT files to the AI knowledge base.</p>
      </header>

      <div className="form-card">
        <h2>Upload Document</h2>

        <form onSubmit={submit}>
          <label>Select Document</label>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />

          {file && <div className="selected-file">Selected: {file.name}</div>}

          <button disabled={loading}>
            {loading ? "Uploading..." : "Upload Document →"}
          </button>
        </form>

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  );
}