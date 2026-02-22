"use client";

import { useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function NaturalLanguageInput({ onParsed }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const examples = [
    "Spent R85 on coffee this morning",
    "Grocery run at Pick n Pay R620",
    "Netflix R199 last Friday",
    "Petrol R450 yesterday",
  ];

  async function handleParse(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to parse expense");
      const parsed = await res.json();
      if (parsed.error) throw new Error(parsed.error);

      onParsed(parsed);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--accent-glow)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
        <span style={{ fontSize: 18 }}>✦</span>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--accent)",
          }}
        >
          AI Natural Language Input
        </span>
      </div>

      <form onSubmit={handleParse} style={{ display: "flex", gap: 8 }}>
        <input
          className="input-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='e.g. "Spent R120 on lunch yesterday"'
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: loading || !text.trim() ? "not-allowed" : "pointer",
            opacity: loading || !text.trim() ? 0.6 : 1,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {loading ? <LoadingSpinner size={14} /> : "✦ Parse"}
        </button>
      </form>

      {error && (
        <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8 }}>
          ⚠ {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "0.75rem" }}>
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => setText(ex)}
            style={{
              background: "transparent",
              border: "1px solid var(--border-light)",
              borderRadius: 99,
              color: "var(--text-muted)",
              fontSize: 12,
              padding: "3px 10px",
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--text-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border-light)";
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}