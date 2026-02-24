"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency, getLastNMonths } from "@/lib/utils";
import EmptyState from "../shared/EmptyState";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--text-primary)",
        borderRadius: 8,
        padding: "8px 14px",
      }}
    >
      <p style={{ color: "#d1d5db", fontSize: 12, marginBottom: 2 }}>{label}</p>
      <p style={{ color: "#86efac", fontWeight: 700, fontSize: 14 }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

export default function MonthlyTrend({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        icon="📈"
        title="No trend data"
        description="Add expenses to track monthly spending"
      />
    );
  }

  const months = getLastNMonths(6);
  const data = months.map(({ label, year, month }) => ({
    label,
    total: expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      })
      .reduce((s, e) => s + Number(e.amount), 0),
  }));

  const maxVal = Math.max(...data.map((d) => d.total));

  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart
        data={data}
        barSize={32}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{
            fill: "var(--text-muted)",
            fontSize: 12,
            fontFamily: "Instrument Sans",
          }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) =>
            v >= 1000 ? `R${(v / 1000).toFixed(0)}k` : `R${v}`
          }
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "var(--bg-elevated)", radius: 4 }}
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.total === maxVal
                  ? "var(--accent)"
                  : "var(--border-strong)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
