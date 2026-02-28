export default function LoadingSpinner({ size = 20, text = null, center = false }) {
  const spinner = (
    <div style={{ display:"flex", alignItems:"center", gap:10, color:"var(--text-muted)" }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="var(--accent)" strokeWidth={2} strokeLinecap="round"
        style={{ animation:"spin 0.8s linear infinite", flexShrink:0 }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      {text && <span style={{ fontSize:14, color:"var(--text-secondary)" }}>{text}</span>}
    </div>
  );
  if (center) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"5rem 2rem", gap:16 }}>
        {spinner}
        {text && <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:-8 }}>Please wait…</p>}
      </div>
    );
  }
  return spinner;
}
