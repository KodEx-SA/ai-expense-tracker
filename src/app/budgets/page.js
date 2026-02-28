"use client";

import { useEffect, useState } from "react";
import { getCurrentMonthRange, groupByCategory, formatCurrency } from "@/lib/utils";
import BudgetList from "@/components/budgets/BudgetList";
import BudgetForm from "@/components/budgets/BudgetForm";
import BudgetAlert from "@/components/budgets/BudgetAlert";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function BudgetsPage() {
  const [budgets, setBudgets]   = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editTarget, setEdit]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);

  async function load() {
    setLoading(true);
    const { start, end } = getCurrentMonthRange();
    const [bud, exp] = await Promise.all([
      fetch("/api/budgets").then(r=>r.json()),
      fetch(`/api/expenses?start=${start}&end=${end}`).then(r=>r.json()),
    ]);
    setBudgets(Array.isArray(bud)?bud:[]);
    setExpenses(Array.isArray(exp)?exp:[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() { await load(); setEdit(null); setShowForm(false); }
  function handleEdit(b) { setEdit(b); setShowForm(true); window.scrollTo({top:0,behavior:"smooth"}); }
  async function handleDelete(id) {
    if (!confirm("Remove this budget?")) return;
    await fetch(`/api/budgets/${id}`,{method:"DELETE"});
    setBudgets(prev => prev.filter(b=>b.id!==id));
  }

  const spentByCategory = groupByCategory(expenses);
  const alerts = budgets.filter(b => {
    const spent = spentByCategory[b.category]||0;
    return spent >= (b.monthly_limit*b.alert_threshold)/100;
  });
  const totalBudgeted = budgets.reduce((s,b) => s+Number(b.monthly_limit), 0);
  const totalSpent    = Object.values(spentByCategory).reduce((a,b) => a+b, 0);
  const overallPct    = totalBudgeted > 0 ? Math.round((totalSpent/totalBudgeted)*100) : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-wrapper" style={{ paddingTop:"1.75rem", paddingBottom:"1.75rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
            <div>
              <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Limits</span>
              <h1 style={{ fontSize:30, color:"var(--text-primary)", marginTop:8, marginBottom:4 }}>Budgets</h1>
              <p style={{ color:"var(--text-muted)", fontSize:13.5 }}>
                {budgets.length} budget{budgets.length!==1?"s":""}
                &nbsp;·&nbsp;
                <span className="stat-number-accent" style={{ fontSize:13.5 }}>{formatCurrency(totalSpent)}</span>
                <span> of {formatCurrency(totalBudgeted)} ({overallPct}%)</span>
              </p>
            </div>
            {!showForm && (
              <button className="btn-primary" onClick={()=>{setShowForm(true);setEdit(null);}}>
                + Set Budget
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        {alerts.length > 0 && (
          <section style={{ marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"0.85rem" }}>
              <span style={{ fontSize:13, color:"var(--warning)" }}>⚠</span>
              <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"var(--text-secondary)" }}>Active Alerts ({alerts.length})</p>
            </div>
            {alerts.map(b => <BudgetAlert key={b.id} budget={b} spent={spentByCategory[b.category]||0} />)}
          </section>
        )}

        {showForm && (
          <div className="card-elevated fade-up" style={{ padding:"1.75rem", marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
              <div>
                <h2 style={{ fontSize:18, marginBottom:2 }}>{editTarget?"Edit Budget":"New Budget"}</h2>
                <p style={{ fontSize:12.5, color:"var(--text-muted)" }}>Set a monthly spending limit</p>
              </div>
              <button className="btn-ghost" onClick={()=>{setShowForm(false);setEdit(null);}}>×</button>
            </div>
            <BudgetForm initialData={editTarget} onSave={handleSave} onCancel={()=>{setShowForm(false);setEdit(null);}} />
          </div>
        )}

        {loading ? <LoadingSpinner center text="Loading budgets…" /> : (
          <BudgetList budgets={budgets} spentByCategory={spentByCategory} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
