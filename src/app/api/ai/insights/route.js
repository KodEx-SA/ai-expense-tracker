import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { expenses, budgets, totalSpent, topCategory, month } = await request.json();
    if (!expenses || expenses.length === 0) return NextResponse.json({ insights: "Add some expenses to get AI insights!" });

    const byCat = expenses.reduce((acc,e) => { acc[e.category]=(acc[e.category]||0)+Number(e.amount); return acc; }, {});
    const catSummary = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>`  - ${cat}: R${amt.toFixed(2)}`).join("\n");
    const budgetSummary = budgets?.length
      ? budgets.map(b => { const s=byCat[b.category]||0; const p=Math.round((s/b.monthly_limit)*100); return `  - ${b.category}: R${s.toFixed(2)} / R${b.monthly_limit} (${p}%)`; }).join("\n")
      : "No budgets set.";

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [{
        role: "user",
        content: `You are a friendly personal finance advisor for a South African user. Analyze this spending data for ${month||"this month"} and provide 3–4 concise, actionable insights in plain text (no markdown, no bullet characters, no asterisks). Focus on patterns, savings opportunities, and budget alerts.\n\nTotal spent: R${(totalSpent||0).toFixed(2)}\nTop category: ${topCategory||"N/A"}\n\nSpending by category:\n${catSummary}\n\nBudget vs Actual:\n${budgetSummary}\n\nKeep response under 130 words. Be direct, warm, and practical.`,
      }],
    });

    return NextResponse.json({ insights: message.content[0].text.trim() });
  } catch (err) {
    console.error("AI insights error:", err);
    return NextResponse.json({ error: err.message }, { status:500 });
  }
}
