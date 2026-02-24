"use client";

import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { formatCurrency, calcPercentage } from "@/lib/utils";
import EmptyState from "../shared/EmptyState";

export default function BudgetList({ budgets, spentByCategory, onEdit, onDelete }) {
  if (!budgets || budgets.length === 0) {
    return <EmptyState icon="◇" title="No budgets set" description="Set spending limits for your categories to track progress and get alerts." />;
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {budgets.map((budget) => {
        const spent = spentByCategory[budget.category] || 0;
        const pct = calcPercentage(spent, budget.monthly_limit);
        const color = CATEGORY_COLORS[budget.category] || "var(--accent)";
        const isOver = pct >= 100;
        const isAlert = pct >= budget.alert_threshold && !isOver;
        const barColor = isOver ? "var(--danger)" : isAlert ? "var(--warning)" : color;

        return (
          <div key={budget.id} className="card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {CATEGORY_ICONS[budget.category] || "📦"}
                </div>
                <div>
                  <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 15 }}>{budget.category}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Alert at {budget.alert_threshold}%</p>
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p className="stat-number" style={{ fontSize: 17, color: barColor }}>{pct}%</p>
                <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
                  {formatCurrency(spent)} / {formatCurrency(budget.monthly_limit)}
                </p>
              </div>
            </div>

            <div className="progress-bar" style={{ marginBottom: 10 }}>
              <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: isOver ? "var(--danger)" : "var(--text-muted)" }}>
                {isOver
                  ? `⚠ ${formatCurrency(spent - budget.monthly_limit)} over limit`
                  : `${formatCurrency(budget.monthly_limit - spent)} remaining`}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn-secondary" onClick={() => onEdit(budget)} style={{ padding: "4px 12px", fontSize: 12 }}>Edit</button>
                <button className="btn-danger" onClick={() => onDelete(budget.id)} style={{ padding: "4px 12px" }}>Remove</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}