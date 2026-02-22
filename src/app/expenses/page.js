"use client";

import { useEffect, useState } from "react";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import NaturalLanguageInput from "@/components/expenses/NaturalLanguageInput";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const PAGE_STYLE = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "2rem 1.5rem",
};

export default function ExpensesPage() {
  const [expenses, setExpenses]     = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [prefill, setPrefill]       = useState(null);

  async function loadExpenses() {
    setLoading(true);
    const res  = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { loadExpenses(); }, []);

  // Called when AI parses a natural language input → pre-fill the form
  function handleParsed(parsed) {
    setPrefill(parsed);
    setEditTarget(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(expense) {
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

  function handleCancel() {
    setEditTarget(null);
    setShowForm(false);
    setPrefill(null);
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 4 }}>Expenses</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {expenses.length} total expense{expenses.length !== 1 ? "s" : ""}
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditTarget(null); setPrefill(null); }}
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
              + Add Expense
            </button>
          )}
        </div>
      </div>

      <div style={PAGE_STYLE}>
        {/* AI Natural Language Input */}
        <NaturalLanguageInput onParsed={handleParsed} />

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
              {editTarget ? "Edit Expense" : "New Expense"}
            </h2>
            <ExpenseForm
              initialData={editTarget || prefill}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Expense list */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
            <LoadingSpinner size={24} text="Loading expenses..." />
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}