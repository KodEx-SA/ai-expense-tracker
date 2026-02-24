"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency, groupByCategory } from "@/lib/utils";
import EmptyState from "../shared/EmptyState";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const total = payload[0].payload.total;
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div
      style={{
        background: "var(--text-primary)",
        borderRadius: 8,
        padding: "8px 14px",
      }}
    >
      <p
        style={{
          color: "white",
          fontWeight: 600,
          fontSize: 13,
          marginBottom: 2,
        }}
      >
        {name}
      </p>
      <p style={{ color: "#86efac", fontSize: 13 }}>
        {formatCurrency(value)} · {pct}%
      </p>
    </div>
  );
};

const CustomLegend = ({ data }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      maxHeight: 200,
      overflowY: "auto",
    }}
  >
    {data.map((item) => (
      <div
        key={item.name}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              background: item.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
            {item.name}
          </span>
        </div>
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {formatCurrency(item.value)}
        </span>
      </div>
    ))}
  </div>
);

export default function CategoryBreakdown({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        icon="🍩"
        title="No data yet"
        description="Add expenses to see your breakdown"
      />
    );
  }

  const grouped = groupByCategory(expenses);
  const totalVal = Object.values(grouped).reduce((a, b) => a + b, 0);
  const data = Object.entries(grouped)
    .map(([name, value]) => ({ name, value, total: totalVal }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  const legendData = data.map((d) => ({
    ...d,
    color: CATEGORY_COLORS[d.name] || "#94a3b8",
  }));

  return (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "0 0 180px", minWidth: 160 }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <CustomLegend data={legendData} />
      </div>
    </div>
  );
}
