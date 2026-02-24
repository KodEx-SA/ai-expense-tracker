import { formatCurrency, calcPercentage } from "@/lib/utils";

export default function BudgetAlert({ budget, spent }) {
  const pct = calcPercentage(spent, budget.monthly_limit);
  const isOver = pct >= 100;
  const isAlert = pct >= budget.alert_threshold && !isOver;

  if (!isOver && !isAlert) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "0.85rem 1.1rem",
        borderRadius: "var(--radius-sm)",
        background: isOver ? "var(--danger-light)" : "var(--warning-light)",
        border: `1px solid ${isOver ? "#fca5a5" : "#fcd34d"}`,
        marginBottom: "0.5rem",
        fontSize: 13.5,
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{isOver ? "🔴" : "🟡"}</span>
      <div>
        <strong style={{ color: isOver ? "var(--danger)" : "var(--warning)" }}>
          {isOver ? "Over budget" : "Approaching limit"}
        </strong>
        {" — "}
        <span style={{ color: "var(--text-secondary)" }}>
          <strong>{budget.category}</strong>: {formatCurrency(spent)} of {formatCurrency(budget.monthly_limit)} ({pct}%)
          {isOver ? ` · ${formatCurrency(spent - budget.monthly_limit)} over limit` : ` · alert at ${budget.alert_threshold}%`}
        </span>
      </div>
    </div>
  );
}