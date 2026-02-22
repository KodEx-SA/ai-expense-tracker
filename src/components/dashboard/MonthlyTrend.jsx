"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency, getLastNMonths } from "@/lib/utils";
import EmptyState from "../shared/EmptyState";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-light)",
      borderRadius: 8,
      padding: "8px 14px",
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 600, marginBottom: 2 }}>{label}</p>
      <p style={{ color: "var(--accent)" }}>{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function MonthlyTrend({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <EmptyState icon="◇" title="No data yet" description="Add expenses to see monthly trend" />;
  }

  const months = getLastNMonths(6);

  const data = months.map(({ label, year, month }) => {
    const total = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      })
      .reduce((s, e) => s + Number(e.amount), 0);
    return { label, total };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barSize={28} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `R${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`}
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border)" }} />
        <Bar dataKey="total" fill="var(--accent)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}