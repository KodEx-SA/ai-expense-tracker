"use client";

import { useEffect, useState } from "react";
import { getCurrentMonthRange, groupByCategory } from "@/lib/utils";
import BudgetList from "@/components/budgets/BudgetList";
import BudgetForm from "@/components/budgets/BudgetForm";
import BudgetAlert from "@/components/budgets/BudgetAlert";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const PAGE_STYLE = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "2rem 1.5rem",
};

export default function BudgetsPage() {
  const [budgets, setBudgets]       = useState([]);
  const [expenses, setExpenses]     = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(true);

  async function load() {
    setLoading(true);
    const { start, end } = getCurrentMonthRange();
    const [budRes, expRes] = await Promise.all([
      fetch("/api/budgets"),
      fetch(`/api/expenses?start=${start}&end=${end}`),
    ]);
    const [bud, exp] = await Promise.all([budRes.json(), expRes.json()]);
    setBudgets(Array.isArray(bud) ? bud : []);
    setExpenses(Array.isArray(exp) ? exp : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    await load();
    setEditTarget(null);
    setShowForm(false);
  }

  function handleEdit(budget) {
    setEditTarget(budget);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Remove this budget?")) return;
    await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }

  const spentByCategory = groupByCategory(expenses);

  // Collect budgets that triggered alerts
  const alerts = budgets.filter((b) => {
    const spent = spentByCategory[b.category] || 0;
    return spent >= (b.monthly_limit * b.alert_threshold) / 100;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 4 }}>Budgets</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {budgets.length} budget{budgets.length !== 1 ? "s" : ""} this month
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditTarget(null); }}
              style={{
                background: "var(--accent)",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                padding: "10px 20px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              + Set Budget
            </button>
          )}
        </div>
      </div>

      <div style={PAGE_STYLE}>
        {/* Alerts section */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: "0.75rem" }}>
              ⚠ Active Alerts
            </h2>
            {alerts.map((b) => (
              <BudgetAlert
                key={b.id}
                budget={b}
                spent={spentByCategory[b.category] || 0}
              />
            ))}
          </div>
        )}

        {/* Form panel */}
        {showForm && (
          <div
            className="card fade-up"
            style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
          >
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: "1.25rem",
              }}
            >
              {editTarget ? "Edit Budget" : "New Budget"}
            </h2>
            <BudgetForm
              initialData={editTarget}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditTarget(null); }}
            />
          </div>
        )}

        {/* Budget list */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
            <LoadingSpinner size={24} text="Loading budgets..." />
          </div>
        ) : (
          <BudgetList
            budgets={budgets}
            spentByCategory={spentByCategory}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}