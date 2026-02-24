"use client";

import { useEffect, useState } from "react";
import { getCurrentMonthRange, groupByCategory } from "@/lib/utils";
import SummaryCards from "@/components/dashboard/SummaryCards";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import MonthlyTrend from "@/components/dashboard/MonthlyTrend";
import AIInsights from "@/components/dashboard/AIInsights";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Link from "next/link";

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
      const [exp, allExp, bud] = await Promise.all([expRes.json(), allExpRes.json(), budRes.json()]);
      setExpenses(Array.isArray(exp) ? exp : []);
      setAllExpenses(Array.isArray(allExp) ? allExp : []);
      setBudgets(Array.isArray(bud) ? bud : []);
      setLoading(false);
    }
    load();
  }, []);

  const month = new Date().toLocaleDateString("en-ZA", { month: "long", year: "numeric" });

  return (
    <div>
      {/* Page header */}
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div className="page-wrapper" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
                Overview
              </p>
              <h1 style={{ fontSize: 28 }}>Dashboard</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 3 }}>{month}</p>
            </div>
            <Link href="/expenses" style={{ textDecoration: "none" }}>
              <button className="btn-primary">+ Add Expense</button>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner center text="Loading dashboard…" />
      ) : (
        <div className="page-wrapper">
          {/* Stats */}
          <div style={{ marginBottom: "1.5rem" }}>
            <SummaryCards expenses={expenses} budgets={budgets} />
          </div>

          {/* AI Insights */}
          <div style={{ marginBottom: "1.5rem" }}>
            <AIInsights expenses={expenses} budgets={budgets} />
          </div>

          {/* Charts */}
          <div className="grid-2">
            <div className="card" style={{ padding: "1.5rem" }}>
              <p className="section-title" style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: "1rem" }}>
                Spending by Category
              </p>
              <CategoryBreakdown expenses={expenses} />
            </div>
            <div className="card" style={{ padding: "1.5rem" }}>
              <p className="section-title" style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: "1rem" }}>
                Monthly Trend
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'Instrument Sans', sans-serif", fontWeight: 400, marginLeft: 8 }}>last 6 months</span>
              </p>
              <MonthlyTrend expenses={allExpenses} />
            </div>
          </div>

          {/* Recent expenses teaser */}
          {expenses.length > 0 && (
            <div className="card" style={{ padding: "1.5rem", marginTop: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 16 }}>Recent Expenses</p>
                <Link href="/expenses" style={{ textDecoration: "none", fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
                  View all →
                </Link>
              </div>
              {expenses.slice(0, 5).map((e) => {
                const { CATEGORY_COLORS, CATEGORY_ICONS } = require("@/lib/constants");
                const { formatCurrency, formatDate } = require("@/lib/utils");
                const color = CATEGORY_COLORS[e.category] || "#94a3b8";
                return (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.65rem 0", borderBottom: "1px solid var(--border-light)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                      {CATEGORY_ICONS[e.category] || "📦"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.description}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: 12 }}>{formatDate(e.date)}</p>
                    </div>
                    <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{formatCurrency(e.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}