export default function EmptyState({ icon = "◎", title, description, action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", gap: 14 }}>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: "var(--bg-elevated)",
          border: "1.5px dashed var(--border-strong)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 5 }}>{title}</p>
        {description && <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 280 }}>{description}</p>}
      </div>
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
  );
}