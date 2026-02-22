"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/expenses", label: "Expenses",  icon: "◎" },
  { href: "/budgets",  label: "Budgets",   icon: "◇" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: "0 0 14px var(--accent-glow)",
              }}
            >
              ⬡
            </div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 17,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              Spendly<span style={{ color: "var(--accent)" }}>AI</span>
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  background: active ? "var(--accent-dim)" : "transparent",
                  border: active ? "1px solid var(--accent-glow)" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 12 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}