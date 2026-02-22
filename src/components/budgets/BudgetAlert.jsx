import { formatCurrency, calcPercentage } from "@/lib/utils";

export default function BudgetAlert({ budget, spent }) {
  const pct = calcPercentage(spent, budget.monthly_limit);
  const isOver  = pct >= 100;
  const isAlert = pct >= budget.alert_threshold && !isOver;

  if (!isOver && !isAlert) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "0.75rem 1rem",
        borderRadius: 8,
        background: isOver ? "var(--danger)18" : "var(--warning)18",
        border: `1px solid ${isOver ? "var(--danger)" : "var(--warning)"}40`,
        marginBottom: "0.5rem",
        fontSize: 13,
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0 }}>{isOver ? "🔴" : "🟡"}</span>
      <div>
        <strong style={{ color: isOver ? "var(--danger)" : "var(--warning)" }}>
          {isOver ? "Over Budget" : "Alert"}:
        </strong>{" "}
        <span style={{ color: "var(--text-secondary)" }}>
          {budget.category} — {formatCurrency(spent)} of {formatCurrency(budget.monthly_limit)} ({pct}%)
          {isOver ? ` — ${formatCurrency(spent - budget.monthly_limit)} over limit!` : ` — ${budget.alert_threshold}% threshold reached`}
        </span>
      </div>
    </div>
  );
}