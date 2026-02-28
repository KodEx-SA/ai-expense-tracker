"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency, groupByCategory } from "@/lib/utils";
import EmptyState from "../shared/EmptyState";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const total = payload[0].payload.total;
  const pct = total ? Math.round((value/total)*100) : 0;
  return (
    <div style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-strong)", borderRadius:10, padding:"10px 14px", boxShadow:"var(--shadow-md)" }}>
      <p style={{ color:"var(--text-primary)", fontWeight:600, fontSize:13, marginBottom:4 }}>{name}</p>
      <p style={{ color:"var(--accent)", fontSize:13, fontWeight:700 }}>{formatCurrency(value)}</p>
      <p style={{ color:"var(--text-muted)", fontSize:11.5 }}>{pct}% of total</p>
    </div>
  );
};

export default function CategoryBreakdown({ expenses }) {
  if (!expenses || expenses.length === 0) return <EmptyState icon="🍩" title="No data yet" description="Add expenses to see spending breakdown" />;

  const grouped = groupByCategory(expenses);
  const totalVal = Object.values(grouped).reduce((a,b) => a+b, 0);
  const data = Object.entries(grouped).map(([name,value])=>({name,value,total:totalVal})).sort((a,b)=>b.value-a.value).slice(0,7);
  const legendData = data.map(d => ({...d, color: CATEGORY_COLORS[d.name]||"#94a3b8", pct: Math.round((d.value/totalVal)*100)}));

  return (
    <div style={{ display:"flex", gap:"1.5rem", alignItems:"center", flexWrap:"wrap" }}>
      <div style={{ flex:"0 0 170px", minWidth:150, position:"relative" }}>
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {data.map(entry => <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]||"#94a3b8"} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
          <p className="stat-number-accent" style={{ fontSize:15 }}>{formatCurrency(totalVal)}</p>
          <p style={{ fontSize:10, color:"var(--text-muted)", marginTop:1 }}>total</p>
        </div>
      </div>
      <div style={{ flex:1, minWidth:130 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:9, maxHeight:200, overflowY:"auto" }}>
          {legendData.map(item => (
            <div key={item.name} style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:8, height:8, borderRadius:3, background:item.color, flexShrink:0 }} />
              <span style={{ fontSize:12.5, color:"var(--text-secondary)", flex:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.name}</span>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <span style={{ fontSize:12.5, fontWeight:600, color:"var(--text-primary)" }}>{formatCurrency(item.value)}</span>
                <span style={{ fontSize:10.5, color:"var(--text-muted)", marginLeft:5 }}>{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
