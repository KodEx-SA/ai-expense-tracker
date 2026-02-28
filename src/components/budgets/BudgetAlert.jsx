import { formatCurrency, calcPercentage } from "@/lib/utils";

export default function BudgetAlert({ budget, spent }) {
  const pct    = calcPercentage(spent, budget.monthly_limit);
  const isOver = pct >= 100;
  const isWarn = pct >= budget.alert_threshold && !isOver;
  if (!isOver && !isWarn) return null;

  return (
    <div style={{
      display:"flex", alignItems:"flex-start", gap:10,
      padding:"0.9rem 1.15rem", borderRadius:"var(--radius-sm)",
      background: isOver ? "var(--danger-dim)" : "var(--warning-dim)",
      border:`1px solid ${isOver?"rgba(244,63,94,0.25)":"rgba(245,158,11,0.25)"}`,
      marginBottom:"0.5rem", fontSize:13.5,
    }}>
      <span style={{ fontSize:15, flexShrink:0, marginTop:2 }}>{isOver?"🔴":"🟡"}</span>
      <div>
        <strong style={{ color:isOver?"var(--danger)":"var(--warning)" }}>
          {isOver?"Over budget":"Approaching limit"}
        </strong>
        {" — "}
        <span style={{ color:"var(--text-secondary)" }}>
          <strong>{budget.category}</strong>: {formatCurrency(spent)} of {formatCurrency(budget.monthly_limit)} ({pct}%)
          {isOver ? ` · ${formatCurrency(spent-budget.monthly_limit)} over limit` : ` · alert at ${budget.alert_threshold}%`}
        </span>
      </div>
    </div>
  );
}
