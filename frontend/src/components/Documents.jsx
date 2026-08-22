import React, { useState } from "react";
import { BackButton } from "./common";
import { searchDocuments } from "../services/api";

export default function Documents({ onBack }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      setLoading(true);
      const data = await searchDocuments(query);
      setResults(data.results || []);
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
        <div className="big-icon">📄</div>
        <h1>Documents</h1>
        <p>Search information from your uploaded documents.</p>
      </header>

      <form className="search-row" onSubmit={search}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your documents..."
        />
        <button>{loading ? "Searching..." : "Search"}</button>
      </form>

      <div className="list">
        {results.map((result, index) => (
          <div className="document-card" key={`${result.document_id}-${index}`}>
            <h2>📄 {result.filename}</h2>
            <p>{result.chunk}</p>
            <small>Relevance distance: {Number(result.distance).toFixed(3)}</small>
          </div>
        ))}
        {!loading && query && results.length === 0 && (
          <div className="empty-box">No matching documents found.</div>
        )}
      </div>
    </div>
  );
}