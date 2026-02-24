"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/expenses", label: "Expenses", icon: "◎" },
  { href: "/budgets", label: "Budgets", icon: "◇" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      {/* ──────────────  Desktop header ────────────── */}
      <header
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/dashboard"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                color: "white",
                fontWeight: 900,
                boxShadow: "0 2px 8px rgba(5,150,105,0.35)",
              }}
            >
              ₴
            </div>
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: 18,
                color: "var(--text-primary)",
                letterSpacing: "-0.04em",
              }}
            >
              Spend<span style={{ color: "var(--accent)" }}>ly</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: "flex", gap: 2 }}>
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
                    borderRadius: "var(--radius-sm)",
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    background: active ? "var(--accent-dim)" : "transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "var(--bg-elevated)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <span style={{ fontSize: 13 }}>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Mobile bottom nav ──────────────────────── */}
      <nav className="mobile-nav-bar">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "6px 20px",
                borderRadius: "var(--radius-sm)",
                color: active ? "var(--accent)" : "var(--text-muted)",
                transition: "color 0.15s",
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
