"use client";
import { useState, useEffect } from "react";
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";
import LoadingSpinner from "../shared/LoadingSpinner";

const INITIAL = { category:"Food & Dining", monthly_limit:"", alert_threshold:80 };

export default function BudgetForm({ initialData=null, onSave, onCancel }) {
  const [form, setForm]       = useState(initialData||INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => { if (initialData) setForm(initialData); }, [initialData]);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.monthly_limit) { setError("Monthly limit is required."); return; }
    setLoading(true); setError(null);
    try {
      const url    = initialData ? `/api/budgets/${initialData.id}` : "/api/budgets";
      const method = initialData ? "PUT" : "POST";
      const res    = await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data   = await res.json();
      if (!res.ok) throw new Error(data.error||"Failed to save");
      onSave(data);
      if (!initialData) setForm(INITIAL);
    } catch(err) { setError(err.message); } finally { setLoading(false); }
  }

  const lbl = (t) => <label style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:7 }}>{t}</label>;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:"grid", gap:"1rem" }}>
        <div>
          {lbl("Category")}
          <select className="input-base" value={form.category} onChange={e=>set("category",e.target.value)} disabled={!!initialData} style={{ cursor:initialData?"not-allowed":"pointer", opacity:initialData?0.6:1 }}>
            {EXPENSE_CATEGORIES.filter(c=>c!=="Uncategorized").map(cat=><option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>)}
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.8rem" }}>
          <div>
            {lbl("Monthly Limit (R)")}
            <input className="input-base" type="number" min="1" step="0.01" value={form.monthly_limit} onChange={e=>set("monthly_limit",e.target.value)} placeholder="0.00" />
          </div>
          <div>
            {lbl("Alert Threshold (%)")}
            <input className="input-base" type="number" min="1" max="99" value={form.alert_threshold} onChange={e=>set("alert_threshold",parseInt(e.target.value)||80)} placeholder="80" />
          </div>
        </div>
        {error && <div style={{ background:"var(--danger-dim)", border:"1px solid rgba(244,63,94,0.3)", borderRadius:"var(--radius-sm)", padding:"10px 14px", fontSize:13, color:"var(--danger)" }}>⚠ {error}</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <LoadingSpinner size={13} /> : null}
            {initialData ? "Update Budget" : "Set Budget"}
          </button>
        </div>
      </div>
    </form>
  );
}
