import { formatCurrency } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";

function StatCard({ label, value, sub, icon, accent, delay }) {
  return (
    <div
      className={`card fade-up fade-up-${delay}`}
      style={{ padding: "1.25rem 1.5rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            {label}
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: accent || "var(--text-primary)" }}>
            {value}
          </p>
          {sub && (
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{sub}</p>
          )}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: (accent || "var(--accent)") + "20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards({ expenses, budgets }) {
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const count = expenses.length;

  // Top category
  const byCat = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});
  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

  // Over-budget count
  const overBudget = budgets.filter((b) => {
    const spent = byCat[b.category] || 0;
    return spent > b.monthly_limit;
  }).length;

  const avgPerExpense = count > 0 ? total / count : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1rem" }}>
      <StatCard
        delay={1}
        label="Total Spent"
        value={formatCurrency(total)}
        sub={`${count} expense${count !== 1 ? "s" : ""} this month`}
        icon="◈"
        accent="var(--accent)"
      />
      <StatCard
        delay={2}
        label="Top Category"
        value={topCat ? topCat[0] : "—"}
        sub={topCat ? formatCurrency(topCat[1]) : "No data yet"}
        icon={topCat ? CATEGORY_ICONS[topCat[0]] || "📦" : "📦"}
        accent="var(--warning)"
      />
      <StatCard
        delay={3}
        label="Avg per Expense"
        value={formatCurrency(avgPerExpense)}
        sub="average transaction"
        icon="◇"
        accent="var(--success)"
      />
      <StatCard
        delay={4}
        label="Budget Alerts"
        value={overBudget}
        sub={overBudget === 0 ? "All within budget 🎉" : `${overBudget} categor${overBudget === 1 ? "y" : "ies"} over`}
        icon="⚠"
        accent={overBudget > 0 ? "var(--danger)" : "var(--success)"}
      />
    </div>
  );
}