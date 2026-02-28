import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY } from "./constants";

export function cn(...inputs) { return twMerge(clsx(inputs)); }

export function formatCurrency(amount) {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency", currency: CURRENCY.code, minimumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-ZA", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: start.toISOString().split("T")[0], end: end.toISOString().split("T")[0] };
}

export function getLastNMonths(n = 6) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" }),
      year: d.getFullYear(), month: d.getMonth() + 1,
    });
  }
  return months;
}

export function calcPercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function groupByCategory(expenses) {
  return (expenses || []).reduce((acc, exp) => {
    const cat = exp.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + Number(exp.amount);
    return acc;
  }, {});
}

export function todayStr() { return new Date().toISOString().split("T")[0]; }
