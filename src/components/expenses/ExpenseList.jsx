"use client";

import { useState } from "react";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import ExpenseCard from "./ExpenseCard";
import EmptyState from "../shared/EmptyState";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = expenses.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || e.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
          <input className="input-base" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." style={{ paddingLeft: 36 }} />
        </div>
        <select className="input-base" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ width: "auto", minWidth: 165, cursor: "pointer" }}>
          <option value="all">All categories</option>
          {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="card" style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <EmptyState icon="🔍" title="No expenses found" description={search || catFilter !== "all" ? "Try adjusting your search or filter." : "Add your first expense above!"} />
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "0.6rem 1.25rem", borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Expense</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount</span>
            </div>
            {filtered.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </>
        )}
      </div>

      {filtered.length > 0 && (
        <p style={{ textAlign: "right", color: "var(--text-muted)", fontSize: 12.5, marginTop: 8 }}>
          Showing {filtered.length} of {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}