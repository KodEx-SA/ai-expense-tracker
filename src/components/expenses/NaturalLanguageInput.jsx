"use client";
import { useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";

const EXAMPLES = [
  "Spent R85 on coffee this morning",
  "Groceries R620 at Pick n Pay",
  "Netflix R199 last Friday",
  "Petrol R450 yesterday",
];

export default function NaturalLanguageInput({ onParsed }) {
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function handleParse(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/ai/parse",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});
      if (!res.ok) throw new Error("Failed to parse");
      const parsed = await res.json();
      if (parsed.error) throw new Error(parsed.error);
      onParsed(parsed); setText("");
    } catch(err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div style={{
      background:"linear-gradient(135deg,rgba(0,208,133,0.05) 0%,rgba(99,102,241,0.05) 100%)",
      border:"1px solid rgba(0,208,133,0.15)",
      borderRadius:"var(--radius-lg)",
      padding:"1.25rem 1.5rem",
      marginBottom:"1.5rem",
      position:"relative", overflow:"hidden",
    }}>
      {/* Glow */}
      <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:99, background:"radial-gradient(circle,rgba(0,208,133,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />

      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:"1rem" }}>
        <span className="ai-pill">✦ AI</span>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"var(--text-primary)" }}>Natural Language Input</span>
        <span style={{ fontSize:12.5, color:"var(--text-muted)" }}>— just describe your expense</span>
      </div>

      <form onSubmit={handleParse} style={{ display:"flex", gap:8 }}>
        <input
          className="input-base"
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder={`e.g. "${EXAMPLES[0]}"`}
          disabled={loading}
          style={{ flex:1, background:"rgba(0,0,0,0.2)", border:"1px solid rgba(0,208,133,0.2)" }}
        />
        <button type="submit" disabled={loading||!text.trim()} className="btn-primary" style={{ flexShrink:0 }}>
          {loading ? <LoadingSpinner size={13} /> : "✦"} Parse
        </button>
      </form>

      {error && <p style={{ color:"var(--danger)", fontSize:13, marginTop:8 }}>⚠ {error}</p>}

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:"0.85rem" }}>
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={()=>setText(ex)} style={{
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,208,133,0.15)",
            borderRadius:99, color:"var(--text-secondary)", fontSize:12, padding:"4px 12px",
            cursor:"pointer", transition:"all 0.15s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)";e.currentTarget.style.background="rgba(0,208,133,0.08)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,208,133,0.15)";e.currentTarget.style.color="var(--text-secondary)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
