import React, { useState } from "react";
import { BackButton } from "./common";
import { askDocument } from "../services/api";

export default function AIAssistant({ onBack }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    try {
      setLoading(true);
      const data = await askDocument(question);
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <BackButton onBack={onBack} text="Dashboard" />

      <header className="page-header">
        <div className="big-icon">🤖</div>
        <h1>AI Assistant</h1>
        <p>Ask questions from your uploaded documents.</p>
      </header>

      <div className="form-card">
        <form onSubmit={ask}>
          <label>Your Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What is FastAPI used for?"
            rows="5"
          />
          <button>{loading ? "Thinking..." : "Ask AI →"}</button>
        </form>
      </div>

      {answer && (
        <div className="answer-card">
          <h2>🤖 AI Answer</h2>
          <p>{answer}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="sources-card">
          <h2>📄 Sources</h2>
          {sources.map((source, index) => (
            <div className="source-item" key={index}>
              <h3>{source.filename}</h3>
              <p>{source.chunk}</p>
              <small>Relevance distance: {Number(source.distance).toFixed(3)}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}