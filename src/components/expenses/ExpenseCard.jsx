"use client";

import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS["Uncategorized"];
  const icon  = CATEGORY_ICONS[expense.category]  || "📦";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.25rem",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Category dot + icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: color + "20",
          border: `1px solid ${color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Description + category */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 500,
            fontSize: 15,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {expense.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
          <span
            className="badge"
            style={{ background: color + "18", color, fontSize: 11 }}
          >
            {expense.category}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
            {formatDate(expense.date)}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: "var(--text-primary)",
          flexShrink: 0,
        }}
      >
        {formatCurrency(expense.amount)}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <button
          onClick={() => onEdit(expense)}
          style={{
            background: "transparent",
            border: "1px solid var(--border-light)",
            borderRadius: 7,
            color: "var(--text-secondary)",
            padding: "5px 10px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          style={{
            background: "transparent",
            border: "1px solid var(--border-light)",
            borderRadius: 7,
            color: "var(--danger)",
            padding: "5px 10px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Del
        </button>
      </div>
    </div>
  );
}