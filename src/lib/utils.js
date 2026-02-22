import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY } from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format a number as currency (ZAR by default)
export function formatCurrency(amount) {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date to a readable string
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Get current month bounds (YYYY-MM-DD)
export function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

// Get the last N months as labels
export function getLastNMonths(n = 6) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" }),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
    });
  }
  return months;
}

// Calculate percentage
export function calcPercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Group expenses by category
export function groupByCategory(expenses) {
  return expenses.reduce((acc, exp) => {
    const cat = exp.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + Number(exp.amount);
    return acc;
  }, {});
}

// Today as YYYY-MM-DD
export function todayStr() {
  return new Date().toISOString().split("T")[0];
}