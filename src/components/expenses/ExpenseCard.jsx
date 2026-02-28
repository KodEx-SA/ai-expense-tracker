"use client";
import { useState } from "react";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const color  = CATEGORY_COLORS[expense.category] || "#94a3b8";
  const icon   = CATEGORY_ICONS[expense.category]  || "📦";

  return (
    <div className="table-row" style={{
      display:"flex", alignItems:"center", gap:"0.9rem",
      padding:"0.9rem 1.25rem",
      borderBottom:"1px solid var(--border-light)",
      position:"relative",
    }}>
      {/* Category icon */}
      <div style={{
        width:40, height:40, borderRadius:11,
        background:`${color}12`,
        border:`1px solid ${color}22`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:18, flexShrink:0,
      }}>
        {icon}
      </div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:500, fontSize:14, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:4, color:"var(--text-primary)" }}>
          {expense.description}
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{
            background:`${color}12`, color, border:`1px solid ${color}22`,
            fontSize:10.5, fontWeight:600, padding:"2px 8px", borderRadius:6,
          }}>{expense.category}</span>
          <span style={{ color:"var(--text-muted)", fontSize:11.5 }}>{formatDate(expense.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign:"right", flexShrink:0 }}>
        <span className="stat-number" style={{ fontSize:15 }}>{formatCurrency(expense.amount)}</span>
      </div>

      {/* Desktop actions */}
      <div className="hide-mobile expense-actions" style={{ display:"flex", gap:5, flexShrink:0 }}>
        <button className="btn-secondary" onClick={()=>onEdit(expense)} style={{ padding:"5px 12px", fontSize:12 }}>Edit</button>
        <button className="btn-danger" onClick={()=>onDelete(expense.id)} style={{ padding:"5px 12px" }}>Delete</button>
      </div>

      {/* Mobile ⋯ */}
      <div style={{ display:"none" }} className="expense-actions-menu">
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:18, color:"var(--text-muted)", padding:"4px 6px" }}>⋯</button>
        {menuOpen && (
          <div className="card-elevated fade-in" style={{ position:"absolute", right:12, top:"calc(100% - 4px)", zIndex:20, minWidth:130, padding:"0.4rem" }}
            onMouseLeave={()=>setMenuOpen(false)}>
            <button onClick={()=>{onEdit(expense);setMenuOpen(false);}} style={{ display:"block", width:"100%", padding:"8px 14px", textAlign:"left", background:"transparent", border:"none", cursor:"pointer", fontSize:13.5, color:"var(--text-primary)", borderRadius:6 }}>✏ Edit</button>
            <button onClick={()=>{onDelete(expense.id);setMenuOpen(false);}} style={{ display:"block", width:"100%", padding:"8px 14px", textAlign:"left", background:"transparent", border:"none", cursor:"pointer", fontSize:13.5, color:"var(--danger)", borderRadius:6 }}>🗑 Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
