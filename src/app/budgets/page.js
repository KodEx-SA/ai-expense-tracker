"use client";

import { useEffect, useState } from "react";
import { getCurrentMonthRange, groupByCategory, formatCurrency } from "@/lib/utils";
import BudgetList from "@/components/budgets/BudgetList";
import BudgetForm from "@/components/budgets/BudgetForm";
import BudgetAlert from "@/components/budgets/BudgetAlert";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

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
  const alerts = budgets.filter((b) => {
    const spent = spentByCategory[b.category] || 0;
    return spent >= (b.monthly_limit * b.alert_threshold) / 100;
  });

  const totalBudgeted = budgets.reduce((s, b) => s + Number(b.monthly_limit), 0);
  const totalSpent = Object.values(spentByCategory).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div className="page-wrapper" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Limits</p>
              <h1 style={{ fontSize: 28 }}>Budgets</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 3 }}>
                {budgets.length} budget{budgets.length !== 1 ? "s" : ""} · {formatCurrency(totalSpent)} spent of {formatCurrency(totalBudgeted)} budgeted
              </p>
            </div>
            {!showForm && (
              <button className="btn-primary" onClick={() => { setShowForm(true); setEditTarget(null); }}>
                + Set Budget
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 15, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚠</span> Active Alerts ({alerts.length})
            </p>
            {alerts.map((b) => <BudgetAlert key={b.id} budget={b} spent={spentByCategory[b.category] || 0} />)}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="card-elevated fade-up" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: 18 }}>{editTarget ? "Edit Budget" : "New Budget"}</h2>
              <button className="btn-ghost" onClick={() => { setShowForm(false); setEditTarget(null); }} style={{ fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <BudgetForm initialData={editTarget} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTarget(null); }} />
          </div>
        )}

        {/* List */}
        {loading ? <LoadingSpinner center text="Loading budgets…" /> : (
          <BudgetList budgets={budgets} spentByCategory={spentByCategory} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}