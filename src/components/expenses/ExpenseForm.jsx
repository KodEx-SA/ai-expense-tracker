"use client";
import { useState, useEffect } from "react";
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";
import { todayStr } from "@/lib/utils";
import LoadingSpinner from "../shared/LoadingSpinner";

const INITIAL = { description:"", amount:"", category:"Uncategorized", date:todayStr(), notes:"" };

export default function ExpenseForm({ initialData=null, onSave, onCancel }) {
  const [form, setForm]        = useState(initialData || INITIAL);
  const [loading, setLoading]  = useState(false);
  const [categorizing, setCat] = useState(false);
  const [error, setError]      = useState(null);

  useEffect(() => { if (initialData) setForm({...INITIAL, ...initialData}); }, [initialData]);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  async function autoCategory() {
    if (!form.description.trim()) return;
    setCat(true);
    try {
      const res  = await fetch("/api/ai/categorize",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({description:form.description,amount:form.amount})});
      const data = await res.json();
      if (data.category) set("category", data.category);
    } catch {} finally { setCat(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description || !form.amount) { setError("Description and amount are required."); return; }
    setLoading(true); setError(null);
    try {
      const url    = initialData ? `/api/expenses/${initialData.id}` : "/api/expenses";
      const method = initialData ? "PUT" : "POST";
      const res    = await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data   = await res.json();
      if (!res.ok) throw new Error(data.error||"Failed to save");
      onSave(data);
      if (!initialData) setForm({...INITIAL,date:todayStr()});
    } catch(err) { setError(err.message); } finally { setLoading(false); }
  }

  const lbl = (t) => (
    <label style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:7 }}>{t}</label>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:"grid", gap:"1.1rem" }}>
        <div>
          {lbl("Description")}
          <div style={{ display:"flex", gap:8 }}>
            <input className="input-base" value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What did you spend on?" style={{ flex:1 }} />
            <button type="button" onClick={autoCategory} disabled={categorizing||!form.description.trim()}
              style={{
                background:"rgba(0,208,133,0.08)", border:"1px solid rgba(0,208,133,0.2)",
                borderRadius:"var(--radius-sm)", color:"var(--accent)",
                fontSize:12.5, fontWeight:700, padding:"0 16px",
                cursor:categorizing||!form.description.trim()?"not-allowed":"pointer",
                opacity:!form.description.trim()?0.4:1,
                whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6, transition:"all 0.18s", flexShrink:0,
              }}>
              {categorizing ? <LoadingSpinner size={12} /> : "✦"} AI
            </button>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.8rem" }}>
          <div>
            {lbl("Amount (R)")}
            <input className="input-base" type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="0.00" />
          </div>
          <div>
            {lbl("Date")}
            <input className="input-base" type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={{ colorScheme:"dark" }} />
          </div>
        </div>

        <div>
          {lbl("Category")}
          <select className="input-base" value={form.category} onChange={e=>set("category",e.target.value)}>
            {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>)}
          </select>
        </div>

        <div>
          {lbl("Notes (optional)")}
          <textarea className="input-base" value={form.notes||""} onChange={e=>set("notes",e.target.value)} placeholder="Any additional notes..." rows={2} style={{ resize:"vertical" }} />
        </div>

        {error && (
          <div style={{ background:"var(--danger-dim)", border:"1px solid rgba(244,63,94,0.3)", borderRadius:"var(--radius-sm)", padding:"10px 14px", fontSize:13, color:"var(--danger)" }}>⚠ {error}</div>
        )}

        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", paddingTop:4 }}>
          {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <LoadingSpinner size={13} /> : null}
            {initialData ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </div>
    </form>
  );
}
