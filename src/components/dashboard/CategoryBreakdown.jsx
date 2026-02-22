"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency, groupByCategory } from "@/lib/utils";
import EmptyState from "../shared/EmptyState";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-light)",
      borderRadius: 8,
      padding: "8px 14px",
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 600, marginBottom: 2 }}>{name}</p>
      <p style={{ color: "var(--accent)" }}>{formatCurrency(value)}</p>
    </div>
  );
};

export default function CategoryBreakdown({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <EmptyState icon="◎" title="No data yet" description="Add expenses to see breakdown" />;
  }

  const grouped = groupByCategory(expenses);
  const data = Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 categories

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || "#94a3b8"}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}