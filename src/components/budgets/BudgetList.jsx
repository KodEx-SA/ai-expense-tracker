"use client";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { formatCurrency, calcPercentage } from "@/lib/utils";
import EmptyState from "../shared/EmptyState";

export default function BudgetList({ budgets, spentByCategory, onEdit, onDelete }) {
  if (!budgets || budgets.length === 0) {
    return <EmptyState icon="◫" title="No budgets set" description="Set spending limits for your categories to track progress and get alerts." />;
  }

  return (
    <div style={{ display:"grid", gap:"0.85rem" }}>
      {budgets.map(budget => {
        const spent    = spentByCategory[budget.category] || 0;
        const pct      = calcPercentage(spent, budget.monthly_limit);
        const color    = CATEGORY_COLORS[budget.category] || "#00D085";
        const isOver   = pct >= 100;
        const isAlert  = pct >= budget.alert_threshold && !isOver;
        const barColor = isOver ? "#F43F5E" : isAlert ? "#F59E0B" : color;
        const cappedPct = Math.min(pct, 100);

        return (
          <div key={budget.id} style={{
            background:"var(--bg-card)",
            border:`1px solid ${barColor}18`,
            borderRadius:"var(--radius-lg)",
            padding:"1.25rem 1.5rem",
            transition:"transform 0.18s, box-shadow 0.18s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 6px 24px ${barColor}12`;}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:`${color}12`, border:`1px solid ${color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  {CATEGORY_ICONS[budget.category]||"📦"}
                </div>
                <div>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14.5, color:"var(--text-primary)" }}>{budget.category}</p>
                  <p style={{ color:"var(--text-muted)", fontSize:11.5, marginTop:1 }}>Alert at {budget.alert_threshold}%</p>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <p className="stat-number" style={{ fontSize:18, color:barColor, WebkitTextFillColor:barColor }}>{cappedPct}%</p>
                <p style={{ color:"var(--text-muted)", fontSize:11.5 }}>{formatCurrency(spent)} / {formatCurrency(budget.monthly_limit)}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="progress-bar" style={{ marginBottom:"0.9rem" }}>
              <div className="progress-fill" style={{ width:`${cappedPct}%`, background:`linear-gradient(90deg, ${barColor}cc, ${barColor})` }} />
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
              <span style={{ fontSize:12.5, color:isOver?"var(--danger)":"var(--text-muted)" }}>
                {isOver ? `⚠ ${formatCurrency(spent-budget.monthly_limit)} over limit` : `${formatCurrency(budget.monthly_limit-spent)} remaining`}
              </span>
              <div style={{ display:"flex", gap:6 }}>
                <button className="btn-secondary" onClick={()=>onEdit(budget)} style={{ padding:"4px 12px", fontSize:12 }}>Edit</button>
                <button className="btn-danger" onClick={()=>onDelete(budget.id)} style={{ padding:"4px 12px" }}>Remove</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
