"use client";

import { useEffect, useState } from "react";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import NaturalLanguageInput from "@/components/expenses/NaturalLanguageInput";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prefill, setPrefill] = useState(null);

  async function loadExpenses() {
    setLoading(true);
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { loadExpenses(); }, []);

  function handleParsed(parsed) {
    setPrefill(parsed);
    setEditTarget(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave() {
    await loadExpenses();
    setEditTarget(null);
    setShowForm(false);
    setPrefill(null);
  }

  function handleEdit(expense) {
    setEditTarget(expense);
    setPrefill(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this expense?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div className="page-wrapper" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Transactions</p>
              <h1 style={{ fontSize: 28 }}>Expenses</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 3 }}>
                {expenses.length} expense{expenses.length !== 1 ? "s" : ""} · {formatCurrency(total)} total
              </p>
            </div>
            {!showForm && (
              <button className="btn-primary" onClick={() => { setShowForm(true); setEditTarget(null); setPrefill(null); }}>
                + Add Expense
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        {/* AI input */}
        <NaturalLanguageInput onParsed={handleParsed} />

        {/* Form */}
        {showForm && (
          <div className="card-elevated fade-up" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: 18 }}>{editTarget ? "Edit Expense" : "New Expense"}</h2>
              <button className="btn-ghost" onClick={() => { setShowForm(false); setEditTarget(null); setPrefill(null); }} style={{ fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <ExpenseForm initialData={editTarget || prefill} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTarget(null); setPrefill(null); }} />
          </div>
        )}

        {/* List */}
        {loading ? <LoadingSpinner center text="Loading expenses…" /> : (
          <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}