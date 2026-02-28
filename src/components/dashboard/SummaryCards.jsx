import { formatCurrency } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";

const CARDS = (total, count, topCat, overBudget, avg) => [
  {
    label: "Total Spent",
    value: formatCurrency(total),
    sub: `${count} transaction${count!==1?"s":""}`,
    icon: "💰",
    color: "#00D085",
    accent: true,
  },
  {
    label: "Top Category",
    value: topCat ? topCat[0].split(" ")[0] : "—",
    sub: topCat ? formatCurrency(topCat[1]) : "No data yet",
    icon: topCat ? (CATEGORY_ICONS[topCat[0]] || "📦") : "📦",
    color: "#F59E0B",
  },
  {
    label: "Avg Transaction",
    value: formatCurrency(avg),
    sub: "per expense",
    icon: "📊",
    color: "#6366F1",
  },
  {
    label: "Budget Alerts",
    value: String(overBudget),
    sub: overBudget===0 ? "All within budget ✓" : `${overBudget} over limit`,
    icon: overBudget>0 ? "⚠️" : "✅",
    color: overBudget>0 ? "#F43F5E" : "#00D085",
  },
];

function StatCard({ label, value, sub, icon, color, accent, delay }) {
  return (
    <div
      className={`fade-up fade-up-${delay}`}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${color}22`,
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: accent ? `0 0 24px ${color}18` : "none",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 30px ${color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=accent?`0 0 24px ${color}18`:"none"; }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: 99,
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Accent line */}
      <div className="accent-line" style={{ background: color }} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>
            {label}
          </p>
          <p
            className={accent ? "stat-number-accent" : "stat-number"}
            style={{ fontSize:26, marginBottom:5 }}
          >
            {value}
          </p>
          <p style={{ fontSize:12.5, color:"var(--text-muted)" }}>{sub}</p>
        </div>
        <div style={{
          width:44, height:44, borderRadius:12,
          background: `${color}12`,
          border: `1px solid ${color}22`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:20, flexShrink:0, marginLeft:8,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards({ expenses, budgets }) {
  const total = expenses.reduce((s,e) => s + Number(e.amount), 0);
  const count = expenses.length;
  const byCat = expenses.reduce((acc,e) => { acc[e.category]=(acc[e.category]||0)+Number(e.amount); return acc; }, {});
  const topCat = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  const overBudget = budgets.filter(b => (byCat[b.category]||0) > b.monthly_limit).length;
  const avg = count > 0 ? total/count : 0;
  const cards = CARDS(total, count, topCat, overBudget, avg);

  return (
    <div className="grid-stats">
      {cards.map((c,i) => <StatCard key={c.label} delay={i+1} {...c} />)}
    </div>
  );
}
