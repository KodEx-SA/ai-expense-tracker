"use client";

import { useEffect, useState } from "react";
import { getCurrentMonthRange, groupByCategory } from "@/lib/utils";
import SummaryCards from "@/components/dashboard/SummaryCards";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import MonthlyTrend from "@/components/dashboard/MonthlyTrend";
import AIInsights from "@/components/dashboard/AIInsights";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const SECTION_STYLE = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "2rem 1.5rem",
};

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: 18,
        marginBottom: "1rem",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h2>
  );
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { start, end } = getCurrentMonthRange();
      const [expRes, allExpRes, budRes] = await Promise.all([
        fetch(`/api/expenses?start=${start}&end=${end}`),
        fetch("/api/expenses"),
        fetch("/api/budgets"),
      ]);
      const [exp, allExp, bud] = await Promise.all([
        expRes.json(),
        allExpRes.json(),
        budRes.json(),
      ]);
      setExpenses(Array.isArray(exp) ? exp : []);
      setAllExpenses(Array.isArray(allExp) ? allExp : []);
      setBudgets(Array.isArray(bud) ? bud : []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ ...SECTION_STYLE, display: "flex", justifyContent: "center", paddingTop: "6rem" }}>
        <LoadingSpinner size={28} text="Loading dashboard..." />
      </div>
    );
  }

  const spentByCategory = groupByCategory(expenses);

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "1.5rem 0",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          <h1 style={{ fontSize: 28, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {new Date().toLocaleDateString("en-ZA", { month: "long", year: "numeric" })} overview
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={SECTION_STYLE}>
        <SummaryCards expenses={expenses} budgets={budgets} />
      </div>

      {/* AI Insights */}
      <div style={{ ...SECTION_STYLE, paddingTop: 0 }}>
        <AIInsights expenses={expenses} budgets={budgets} />
      </div>

      {/* Charts row */}
      <div style={{ ...SECTION_STYLE, paddingTop: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <SectionTitle>Spending by Category</SectionTitle>
            <CategoryBreakdown expenses={expenses} />
          </div>
          <div className="card" style={{ padding: "1.5rem" }}>
            <SectionTitle>Monthly Trend (6 months)</SectionTitle>
            <MonthlyTrend expenses={allExpenses} />
          </div>
        </div>
      </div>
    </div>
  );
}