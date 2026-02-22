"use client";

import { useState, useEffect } from "react";
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";
import LoadingSpinner from "../shared/LoadingSpinner";

const INITIAL = {
  category: "Food & Dining",
  monthly_limit: "",
  alert_threshold: 80,
};

export default function BudgetForm({ initialData = null, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.monthly_limit) {
      setError("Monthly limit is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/budgets/${initialData.id}` : "/api/budgets";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save budget");

      onSave(data);
      if (!initialData) setForm(INITIAL);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Category</label>
          <select
            className="input-base"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            disabled={!!initialData}
            style={{ cursor: initialData ? "not-allowed" : "pointer", opacity: initialData ? 0.7 : 1 }}
          >
            {EXPENSE_CATEGORIES.filter((c) => c !== "Uncategorized").map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat]} {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={labelStyle}>Monthly Limit (R)</label>
            <input
              className="input-base"
              type="number"
              min="1"
              step="0.01"
              value={form.monthly_limit}
              onChange={(e) => setField("monthly_limit", e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={labelStyle}>Alert At (%)</label>
            <input
              className="input-base"
              type="number"
              min="1"
              max="99"
              value={form.alert_threshold}
              onChange={(e) => setField("alert_threshold", parseInt(e.target.value))}
              placeholder="80"
            />
          </div>
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>⚠ {error}</p>}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "transparent",
                border: "1px solid var(--border-light)",
                borderRadius: 8,
                color: "var(--text-secondary)",
                padding: "10px 18px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              padding: "10px 22px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {loading ? <LoadingSpinner size={14} /> : null}
            {initialData ? "Update Budget" : "Set Budget"}
          </button>
        </div>
      </div>
    </form>
  );
}