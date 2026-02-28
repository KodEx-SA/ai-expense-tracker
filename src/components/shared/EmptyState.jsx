export default function EmptyState({ icon = "◎", title, description, action }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"4rem 2rem", textAlign:"center", gap:16 }}>
      <div style={{
        width:64, height:64, borderRadius:18,
        background:"rgba(255,255,255,0.03)",
        border:"1px dashed rgba(255,255,255,0.1)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:6, color:"var(--text-secondary)" }}>{title}</p>
        {description && <p style={{ color:"var(--text-muted)", fontSize:13.5, maxWidth:260, lineHeight:1.6 }}>{description}</p>}
      </div>
      {action && <div style={{ marginTop:4 }}>{action}</div>}
    </div>
  );
}
