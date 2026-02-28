"use client";

import { useEffect, useState } from "react";
import { getCurrentMonthRange, formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import SummaryCards from "@/components/dashboard/SummaryCards";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import MonthlyTrend from "@/components/dashboard/MonthlyTrend";
import AIInsights from "@/components/dashboard/AIInsights";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Link from "next/link";

export default function DashboardPage() {
  const [expenses, setExpenses]       = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [budgets, setBudgets]         = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      const { start, end } = getCurrentMonthRange();
      const [e1, e2, b] = await Promise.all([
        fetch(`/api/expenses?start=${start}&end=${end}`).then(r=>r.json()),
        fetch("/api/expenses").then(r=>r.json()),
        fetch("/api/budgets").then(r=>r.json()),
      ]);
      setExpenses(Array.isArray(e1)?e1:[]);
      setAllExpenses(Array.isArray(e2)?e2:[]);
      setBudgets(Array.isArray(b)?b:[]);
      setLoading(false);
    }
    load();
  }, []);

  const month = new Date().toLocaleDateString("en-ZA",{month:"long",year:"numeric"});
  const totalSpent = expenses.reduce((s,e) => s+Number(e.amount), 0);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-wrapper" style={{ paddingTop:"1.75rem", paddingBottom:"1.75rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Overview</span>
                <span style={{ fontSize:11, color:"var(--border-strong)" }}>·</span>
                <span style={{ fontSize:11, color:"var(--text-muted)" }}>{month}</span>
              </div>
              <h1 style={{ fontSize:30, color:"var(--text-primary)", marginBottom:4 }}>Dashboard</h1>
              {!loading && (
                <p style={{ color:"var(--text-muted)", fontSize:13.5 }}>
                  <span className="stat-number-accent" style={{ fontSize:13.5 }}>{formatCurrency(totalSpent)}</span>
                  <span style={{ marginLeft:6 }}>spent this month · {expenses.length} transactions</span>
                </p>
              )}
            </div>
            <Link href="/expenses" style={{ textDecoration:"none" }}>
              <button className="btn-primary">+ Add Expense</button>
            </Link>
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner center text="Loading dashboard…" /> : (
        <div className="page-wrapper">
          {/* Stats */}
          <section style={{ marginBottom:"1.5rem" }}>
            <SummaryCards expenses={expenses} budgets={budgets} />
          </section>

          {/* AI */}
          <section style={{ marginBottom:"1.5rem" }}>
            <AIInsights expenses={expenses} budgets={budgets} />
          </section>

          {/* Charts */}
          <section className="grid-2" style={{ marginBottom:"1.25rem" }}>
            <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"1.5rem" }}>
              <p className="section-title" style={{ marginBottom:"1.1rem" }}>Spending by Category</p>
              <CategoryBreakdown expenses={expenses} />
            </div>
            <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"1.5rem" }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:"1.1rem" }}>
                <p className="section-title">Monthly Trend</p>
                <span style={{ fontSize:11.5, color:"var(--text-muted)" }}>last 6 months</span>
              </div>
              <MonthlyTrend expenses={allExpenses} />
            </div>
          </section>

          {/* Recent */}
          {expenses.length > 0 && (
            <section style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"1.5rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.1rem" }}>
                <p className="section-title">Recent Expenses</p>
                <Link href="/expenses" style={{ textDecoration:"none", fontSize:12.5, color:"var(--accent)", fontWeight:600, letterSpacing:"0.02em" }}>View all →</Link>
              </div>
              {expenses.slice(0,5).map((e,i) => {
                const color = CATEGORY_COLORS[e.category] || "#94a3b8";
                return (
                  <div key={e.id} style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"0.7rem 0",
                    borderBottom: i<4?"1px solid var(--border-light)":"none",
                  }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${color}12`, border:`1px solid ${color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                      {CATEGORY_ICONS[e.category]||"📦"}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:500, fontSize:13.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:2 }}>{e.description}</p>
                      <p style={{ color:"var(--text-muted)", fontSize:11.5 }}>{formatDate(e.date)}</p>
                    </div>
                    <span className="stat-number" style={{ fontSize:14, flexShrink:0 }}>{formatCurrency(e.amount)}</span>
                  </div>
                );
              })}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
