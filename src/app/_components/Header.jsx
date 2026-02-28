"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/expenses",  label: "Expenses",  icon: "≡" },
  { href: "/budgets",   label: "Budgets",   icon: "◫" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop header ───────────────────────────── */}
      <header style={{
        background: "rgba(13,15,20,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", padding: "0 1.5rem",
          height: 62, display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 33, height: 33, borderRadius: 10,
              background: "linear-gradient(135deg, #00D085 0%, #00A369 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "#000", fontWeight: 900,
              boxShadow: "0 0 16px rgba(0,208,133,0.4)",
              fontFamily: "'Syne', sans-serif",
              flexShrink: 0,
            }}>₴</div>
            <div>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 17, color: "#F0F2F8", letterSpacing: "-0.03em",
              }}>
                Spend<span style={{ color: "var(--accent)" }}>ly</span>
              </span>
              <span style={{
                display: "block", fontSize: 9.5, color: "var(--text-muted)",
                fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                lineHeight: 1, marginTop: 1,
              }}>AI Finance</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: "flex", gap: 2 }}>
            {NAV.map(({ href, label, icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href} style={{
                  textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  background: active ? "rgba(0,208,133,0.08)" : "transparent",
                  border: active ? "1px solid rgba(0,208,133,0.15)" : "1px solid transparent",
                  transition: "all 0.18s",
                  fontFamily: active ? "'Syne', sans-serif" : "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="var(--text-primary)"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text-secondary)"; }}}
                >
                  <span style={{ fontSize: 12 }}>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Status badge */}
          <div className="hide-mobile" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 11px", borderRadius: 99,
            background: "rgba(0,208,133,0.07)",
            border: "1px solid rgba(0,208,133,0.15)",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: 99,
              background: "var(--accent)",
              boxShadow: "0 0 6px rgba(0,208,133,0.8)",
              animation: "pulse 2.5s infinite",
            }} />
            <span style={{ fontSize: 11.5, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.04em" }}>Live</span>
          </div>
        </div>
      </header>

      {/* ── Mobile floating pill nav ─────────────────── */}
      <nav className="mobile-nav-bar">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              textDecoration: "none",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3,
              padding: "7px 18px",
              borderRadius: 99,
              background: active ? "rgba(0,208,133,0.12)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-muted)",
              transition: "all 0.18s",
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, letterSpacing: "0.03em" }}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
