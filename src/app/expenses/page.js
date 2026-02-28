"use client";

import { useEffect, useState } from "react";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import NaturalLanguageInput from "@/components/expenses/NaturalLanguageInput";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";

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
    setExpenses(Array.isArray(data)?data:[]);
    setLoading(false);
  }

  useEffect(() => { loadExpenses(); }, []);

  function handleParsed(parsed) {
    setPrefill(parsed); setEditTarget(null); setShowForm(true);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  async function handleSave() {
    await loadExpenses(); setEditTarget(null); setShowForm(false); setPrefill(null);
  }

  function handleEdit(expense) {
    setEditTarget(expense); setPrefill(null); setShowForm(true);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  async function handleDelete(id) {
    if (!confirm("Delete this expense?")) return;
    await fetch(`/api/expenses/${id}`,{method:"DELETE"});
    setExpenses(prev => prev.filter(e => e.id!==id));
  }

  const total = expenses.reduce((s,e) => s+Number(e.amount), 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-wrapper" style={{ paddingTop:"1.75rem", paddingBottom:"1.75rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
            <div>
              <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Transactions</span>
              <h1 style={{ fontSize:30, color:"var(--text-primary)", marginTop:8, marginBottom:4 }}>Expenses</h1>
              <p style={{ color:"var(--text-muted)", fontSize:13.5 }}>
                {expenses.length} expense{expenses.length!==1?"s":""}&nbsp;·&nbsp;
                <span className="stat-number-accent" style={{ fontSize:13.5 }}>{formatCurrency(total)}</span> total
              </p>
            </div>
            {!showForm && (
              <button className="btn-primary" onClick={()=>{setShowForm(true);setEditTarget(null);setPrefill(null);}}>
                + Add Expense
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        <NaturalLanguageInput onParsed={handleParsed} />

        {showForm && (
          <div className="card-elevated fade-up" style={{ padding:"1.75rem", marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
              <div>
                <h2 style={{ fontSize:18, marginBottom:2 }}>{editTarget?"Edit Expense":"New Expense"}</h2>
                <p style={{ fontSize:12.5, color:"var(--text-muted)" }}>{editTarget?"Update the details below":"Fill in the details below"}</p>
              </div>
              <button className="btn-ghost" onClick={()=>{setShowForm(false);setEditTarget(null);setPrefill(null);}}>×</button>
            </div>
            <ExpenseForm initialData={editTarget||prefill} onSave={handleSave} onCancel={()=>{setShowForm(false);setEditTarget(null);setPrefill(null);}} />
          </div>
        )}

        {loading ? <LoadingSpinner center text="Loading expenses…" /> : (
          <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
