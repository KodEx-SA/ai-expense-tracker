"use client";

import { useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function AIInsights({ expenses, budgets }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  async function fetchInsights() {
    setLoading(true);
    setError(null);

    const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const byCat = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});
    const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0];

    const month = new Date().toLocaleDateString("en-ZA", { month: "long", year: "numeric" });

    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses, budgets, totalSpent: total, topCategory, month }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsights(data.insights);
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
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow bg */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "var(--accent)",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>✦</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>
            AI Spending Insights
          </span>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading || expenses.length === 0}
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            padding: "8px 16px",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: loading || expenses.length === 0 ? "not-allowed" : "pointer",
            opacity: loading || expenses.length === 0 ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {loading ? <LoadingSpinner size={13} /> : null}
          {insights ? "Refresh" : "Analyze"}
        </button>
      </div>

      {error && (
        <p style={{ color: "var(--danger)", fontSize: 14 }}>⚠ {error}</p>
      )}

      {!insights && !loading && !error && (
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Click <strong style={{ color: "var(--text-secondary)" }}>Analyze</strong> to get AI-powered insights on your spending patterns.
        </p>
      )}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: 14 }}>
          <LoadingSpinner size={16} />
          <span>Claude is analyzing your spending...</span>
        </div>
      )}

      {insights && !loading && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.8,
            borderTop: "1px solid var(--border)",
            paddingTop: "1rem",
          }}
        >
          {insights}
        </p>
      )}
    </div>
  );
}