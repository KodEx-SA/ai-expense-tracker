"use client";
import { useState } from "react";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import ExpenseCard from "./ExpenseCard";
import EmptyState from "../shared/EmptyState";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [cat, setCat]       = useState("all");

  const filtered = expenses.filter(e => {
    const ms = e.description.toLowerCase().includes(search.toLowerCase());
    const mc = cat==="all" || e.category===cat;
    return ms && mc;
  });

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:"1rem", flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:180 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)", fontSize:14, pointerEvents:"none" }}>🔍</span>
          <input className="input-base" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search expenses..." style={{ paddingLeft:36 }} />
        </div>
        <select className="input-base" value={cat} onChange={e=>setCat(e.target.value)} style={{ width:"auto", minWidth:165 }}>
          <option value="all">All categories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", overflow:"hidden" }}>
        {filtered.length===0 ? (
          <EmptyState icon="🔍" title="No expenses found" description={search||cat!=="all"?"Try adjusting your search or filter.":"Add your first expense above!"} />
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"0.7rem 1.25rem", borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize:10.5, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Expense</span>
              <span style={{ fontSize:10.5, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Amount</span>
            </div>
            {filtered.map(expense => <ExpenseCard key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />)}
          </>
        )}
      </div>

      {filtered.length>0 && (
        <p style={{ textAlign:"right", color:"var(--text-muted)", fontSize:12, marginTop:8 }}>
          Showing {filtered.length} of {expenses.length} expense{expenses.length!==1?"s":""}
        </p>
      )}
    </div>
  );
}
