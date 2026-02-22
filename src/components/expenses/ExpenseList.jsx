"use client";

import { useState } from "react";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import ExpenseCard from "./ExpenseCard";
import EmptyState from "../shared/EmptyState";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [search, setSearch]   = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = expenses.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "all" || e.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
        <input
          className="input-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expenses..."
          style={{ flex: 1, minWidth: 160 }}
        />
        <select
          className="input-base"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          style={{ width: "auto", minWidth: 160 }}
        >
          <option value="all">All categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="card" style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="◎"
            title="No expenses found"
            description={
              search || catFilter !== "all"
                ? "Try adjusting your filters."
                : "Add your first expense above!"
            }
          />
        ) : (
          filtered.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <p style={{ textAlign: "right", color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
          {filtered.length} expense{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}