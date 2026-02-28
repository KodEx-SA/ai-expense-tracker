"use client";
import { useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function AIInsights({ expenses, budgets }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  async function fetchInsights() {
    setLoading(true); setError(null);
    const total = expenses.reduce((s,e) => s+Number(e.amount), 0);
    const byCat = expenses.reduce((acc,e) => { acc[e.category]=(acc[e.category]||0)+Number(e.amount); return acc; }, {});
    const topCategory = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0]?.[0];
    const month = new Date().toLocaleDateString("en-ZA",{month:"long",year:"numeric"});
    try {
      const res = await fetch("/api/ai/insights",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({expenses,budgets,totalSpent:total,topCategory,month})});
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsights(data.insights);
    } catch(err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(0,208,133,0.05) 0%, rgba(99,102,241,0.05) 100%)",
      border: "1px solid rgba(0,208,133,0.15)",
      borderRadius: "var(--radius-lg)",
      padding: "1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:99, background:"radial-gradient(circle, rgba(0,208,133,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-30, left:-30, width:120, height:120, borderRadius:99, background:"radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:insights||loading||error?"1.25rem":"0.5rem", gap:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* AI icon */}
          <div style={{
            width:40, height:40, borderRadius:12,
            background:"linear-gradient(135deg,rgba(0,208,133,0.2),rgba(99,102,241,0.2))",
            border:"1px solid rgba(0,208,133,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, flexShrink:0,
          }}>✦</div>
          <div>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text-primary)" }}>AI Spending Insights</p>
            <p style={{ fontSize:11.5, color:"var(--text-muted)", marginTop:1 }}>Powered by Claude · Analyzes your patterns</p>
          </div>
        </div>
        <button onClick={fetchInsights} disabled={loading||expenses.length===0} className="btn-primary" style={{ fontSize:13, padding:"9px 18px" }}>
          {loading ? <LoadingSpinner size={13} /> : <span>✦</span>}
          {insights ? "Refresh" : "Analyze spending"}
        </button>
      </div>

      {error && (
        <div style={{ background:"var(--danger-dim)", border:"1px solid rgba(244,63,94,0.25)", borderRadius:"var(--radius-sm)", padding:"10px 14px", fontSize:13, color:"var(--danger)" }}>
          ⚠ {error}
        </div>
      )}

      {!insights && !loading && !error && (
        <p style={{ color:"var(--text-muted)", fontSize:13.5, lineHeight:1.7 }}>
          Click <strong style={{ color:"var(--accent)", fontWeight:600 }}>Analyze spending</strong> to get personalized insights on your patterns, savings opportunities, and budget health.
        </p>
      )}

      {loading && (
        <div style={{ display:"flex", alignItems:"center", gap:10, color:"var(--text-secondary)", fontSize:13.5 }}>
          <LoadingSpinner size={15} />
          <span>Claude is analyzing your spending data…</span>
        </div>
      )}

      {insights && !loading && (
        <div style={{ borderTop:"1px solid rgba(0,208,133,0.12)", paddingTop:"1.1rem" }}>
          <p style={{ color:"var(--text-secondary)", fontSize:14, lineHeight:1.85 }}>{insights}</p>
        </div>
      )}
    </div>
  );
}
