"use client";

import { useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";

const EXAMPLES = [
  "Spent R85 on coffee this morning",
  "Groceries R620 at Pick n Pay",
  "Netflix R199 last Friday",
  "Petrol R450 yesterday",
];

export default function NaturalLanguageInput({ onParsed }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleParse(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/ai/parse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error("Failed to parse");
      const parsed = await res.json();
      if (parsed.error) throw new Error(parsed.error);
      onParsed(parsed);
      setText("");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div
      className="card"
      style={{
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
        background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)",
        border: "1px solid #bbf7d0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.85rem" }}>
        <span className="ai-pill">✦ AI</span>
        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 14, color: "var(--text-primary)" }}>
          Natural Language Input
        </span>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>— just describe your expense</span>
      </div>

      <form onSubmit={handleParse} style={{ display: "flex", gap: 8 }}>
        <input
          className="input-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`e.g. "${EXAMPLES[0]}"`}
          disabled={loading}
          style={{ flex: 1, background: "white", border: "1.5px solid #bbf7d0" }}
        />
        <button type="submit" disabled={loading || !text.trim()} className="btn-primary" style={{ flexShrink: 0 }}>
          {loading ? <LoadingSpinner size={13} /> : "✦"} Parse
        </button>
      </form>

      {error && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8 }}>⚠ {error}</p>}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "0.75rem" }}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setText(ex)}
            style={{
              background: "white",
              border: "1px solid #bbf7d0",
              borderRadius: 99,
              color: "var(--text-secondary)",
              fontSize: 12,
              padding: "3px 11px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#bbf7d0"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}