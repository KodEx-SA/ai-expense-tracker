export default function EmptyState({ icon = "◎", title, description, action }) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 2rem",
          textAlign: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          {icon}
        </div>
        <div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
            {title}
          </p>
          {description && (
            <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 300 }}>
              {description}
            </p>
          )}
        </div>
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
    );
  }