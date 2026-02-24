import { formatCurrency } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";

function StatCard({ label, value, sub, icon, accentColor, delay, trend }) {
  return (
    <div
      className={`card fade-up fade-up-${delay}`}
      style={{
        padding: "1.4rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accentColor,
          borderRadius: "12px 12px 0 0",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: 6,
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 10,
            }}
          >
            {label}
          </p>
          <p
            className="stat-number"
            style={{
              fontSize: 26,
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{sub}</p>
          )}
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: accentColor + "18",
            border: `1px solid ${accentColor}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
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

  const byCat = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const overBudget = budgets.filter(
    (b) => (byCat[b.category] || 0) > b.monthly_limit,
  ).length;
  const avgPerExpense = count > 0 ? total / count : 0;

  return (
    <div className="grid-stats">
      <StatCard
        delay={1}
        label="Total Spent"
        value={formatCurrency(total)}
        sub={`${count} transaction${count !== 1 ? "s" : ""}`}
        icon="💰"
        accentColor="#059669"
      />
      <StatCard
        delay={2}
        label="Top Category"
        value={topCat ? topCat[0].split(" ")[0] : "—"}
        sub={topCat ? formatCurrency(topCat[1]) : "No data yet"}
        icon={topCat ? CATEGORY_ICONS[topCat[0]] || "📦" : "📦"}
        accentColor="#D97706"
      />
      <StatCard
        delay={3}
        label="Avg Transaction"
        value={formatCurrency(avgPerExpense)}
        sub="per expense"
        icon="📊"
        accentColor="#2563EB"
      />
      <StatCard
        delay={4}
        label="Budget Alerts"
        value={String(overBudget)}
        sub={
          overBudget === 0 ? "All within budget 🎉" : `${overBudget} over limit`
        }
        icon={overBudget > 0 ? "⚠️" : "✅"}
        accentColor={overBudget > 0 ? "#DC2626" : "#059669"}
      />
    </div>
  );
}
