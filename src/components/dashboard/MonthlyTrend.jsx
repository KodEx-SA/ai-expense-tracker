"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency, getLastNMonths } from "@/lib/utils";
import EmptyState from "../shared/EmptyState";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-strong)", borderRadius:10, padding:"10px 14px", boxShadow:"var(--shadow-md)" }}>
      <p style={{ color:"var(--text-muted)", fontSize:11.5, marginBottom:4 }}>{label}</p>
      <p style={{ color:"var(--accent)", fontWeight:700, fontSize:15 }}>{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function MonthlyTrend({ expenses }) {
  if (!expenses || expenses.length === 0) return <EmptyState icon="📈" title="No trend data" description="Add expenses to track monthly spending" />;

  const months = getLastNMonths(6);
  const data = months.map(({ label, year, month }) => ({
    label,
    total: expenses.filter(e => {
      const d = new Date(e.date+"T00:00:00");
      return d.getFullYear()===year && d.getMonth()+1===month;
    }).reduce((s,e)=>s+Number(e.amount),0),
  }));
  const maxVal = Math.max(...data.map(d=>d.total), 1);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={28} margin={{ top:4, right:4, bottom:4, left:4 }}>
        <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill:"var(--text-muted)", fontSize:11.5, fontFamily:"DM Sans" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v=>v>=1000?`R${(v/1000).toFixed(0)}k`:`R${v}`} tick={{ fill:"var(--text-muted)", fontSize:11 }} axisLine={false} tickLine={false} width={46} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(255,255,255,0.03)", radius:6 }} />
        <Bar dataKey="total" radius={[6,6,0,0]}>
          {data.map((entry,i) => (
            <Cell key={i}
              fill={entry.total===maxVal ? "var(--accent)" : "rgba(255,255,255,0.07)"}
              stroke={entry.total===maxVal ? "rgba(0,208,133,0.3)" : "transparent"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
