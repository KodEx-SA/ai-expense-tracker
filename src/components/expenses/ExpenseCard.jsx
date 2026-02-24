"use client";

import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const color = CATEGORY_COLORS[expense.category] || "#94a3b8";
  const icon = CATEGORY_ICONS[expense.category] || "📦";

  return (
    <div
      className="table-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.9rem 1.25rem",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: color + "18",
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Description */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 500, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3 }}>
          {expense.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="badge" style={{ background: color + "15", color, border: `1px solid ${color}25`, fontSize: 11 }}>
            {expense.category}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{formatDate(expense.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <span className="stat-number" style={{ fontSize: 15, flexShrink: 0 }}>
        {formatCurrency(expense.amount)}
      </span>

      {/* Actions */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <button className="btn-secondary" onClick={() => onEdit(expense)} style={{ padding: "5px 10px", fontSize: 12 }}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(expense.id)} style={{ padding: "5px 10px" }}>Delete</button>
      </div>
    </div>
  );
}