"use client";

import { useState, useEffect } from "react";
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";
import { todayStr } from "@/lib/utils";
import LoadingSpinner from "../shared/LoadingSpinner";

const INITIAL = {
  description: "",
  amount: "",
  category: "Uncategorized",
  date: todayStr(),
  notes: "",
};

export default function ExpenseForm({ initialData = null, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || INITIAL);
  const [loading, setLoading] = useState(false);
  const [categorizing, setCategorizing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function autoCategory() {
    if (!form.description.trim()) return;
    setCategorizing(true);
    try {
      const res = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: form.description, amount: form.amount }),
      });
      const data = await res.json();
      if (data.category) setField("category", data.category);
    } catch {
      // silent fail
    } finally {
      setCategorizing(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description || !form.amount) {
      setError("Description and amount are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/expenses/${initialData.id}` : "/api/expenses";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

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
        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input-base"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="What did you spend on?"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={autoCategory}
              disabled={categorizing || !form.description.trim()}
              title="Auto-categorize with AI"
              style={{
                background: "var(--accent-dim)",
                border: "1px solid var(--accent-glow)",
                borderRadius: 8,
                color: "var(--accent)",
                fontSize: 13,
                fontWeight: 600,
                padding: "0 14px",
                cursor: categorizing || !form.description.trim() ? "not-allowed" : "pointer",
                opacity: !form.description.trim() ? 0.5 : 1,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {categorizing ? <LoadingSpinner size={12} /> : "✦ AI"}
            </button>
          </div>
        </div>

        {/* Amount + Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={labelStyle}>Amount (R)</label>
            <input
              className="input-base"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => setField("amount", e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input
              className="input-base"
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>Category</label>
          <select
            className="input-base"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            style={{ cursor: "pointer" }}
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat]} {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>Notes (optional)</label>
          <textarea
            className="input-base"
            value={form.notes || ""}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Any additional notes..."
            rows={2}
            style={{ resize: "vertical" }}
          />
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: 13 }}>⚠ {error}</p>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
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
            {initialData ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </div>
    </form>
  );
}