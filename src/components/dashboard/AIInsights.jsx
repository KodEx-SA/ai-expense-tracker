"use client";

import { useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function AIInsights({ expenses, budgets }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchInsights() {
    setLoading(true);
    setError(null);
    const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const byCat = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});
    const topCategory = Object.entries(byCat).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];
    const month = new Date().toLocaleDateString("en-ZA", {
      month: "long",
      year: "numeric",
    });

    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenses,
          budgets,
          totalSpent: total,
          topCategory,
          month,
        }),
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
      className="card"
      style={{
        padding: "1.5rem",
        background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)",
        border: "1px solid #bbf7d0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #059669, #2563EB)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                color: "var(--text-primary)",
              }}
            >
              AI Spending Insights
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Powered by Claude
            </p>
          </div>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading || expenses.length === 0}
          className="btn-primary"
          style={{ fontSize: 13, padding: "8px 16px" }}
        >
          {loading ? <LoadingSpinner size={13} /> : "✦"}
          {insights ? "Refresh" : "Analyze spending"}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "var(--danger-light)",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            fontSize: 13,
            color: "var(--danger)",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {!insights && !loading && !error && (
        <p
          style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7 }}
        >
          Click{" "}
          <strong style={{ color: "var(--text-secondary)" }}>
            Analyze spending
          </strong>{" "}
          to get personalized insights on your spending patterns, savings
          opportunities, and budget health.
        </p>
      )}

      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--text-secondary)",
            fontSize: 14,
          }}
        >
          <LoadingSpinner size={16} />
          <span>Claude is analyzing your spending data…</span>
        </div>
      )}

      {insights && !loading && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.8,
            borderTop: "1px solid #bbf7d0",
            paddingTop: "1rem",
          }}
        >
          {insights}
        </p>
      )}
    </div>
  );
}
