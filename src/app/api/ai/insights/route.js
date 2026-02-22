import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/insights
export async function POST(request) {
  try {
    const { expenses, budgets, totalSpent, topCategory, month } = await request.json();

    if (!expenses || expenses.length === 0) {
      return NextResponse.json({ insights: "Add some expenses to get AI insights!" });
    }

    // Summarize spending by category
    const byCat = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});

    const catSummary = Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => `  - ${cat}: R${amt.toFixed(2)}`)
      .join("\n");

    const budgetSummary =
      budgets && budgets.length > 0
        ? budgets
            .map((b) => {
              const spent = byCat[b.category] || 0;
              const pct = Math.round((spent / b.monthly_limit) * 100);
              return `  - ${b.category}: R${spent.toFixed(2)} / R${b.monthly_limit} (${pct}%)`;
            })
            .join("\n")
        : "No budgets set.";

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `You are a friendly personal finance advisor. Analyze this spending data for ${month || "this month"} and provide 3–4 concise, actionable insights in plain text (no markdown, no bullet characters). Focus on patterns, savings opportunities, and budget alerts.

Total spent: R${totalSpent?.toFixed(2) || 0}
Top category: ${topCategory || "N/A"}

Spending by category:
${catSummary}

Budget vs Actual:
${budgetSummary}

Keep your response under 120 words. Be direct, warm, and practical. Do not use asterisks or markdown formatting.`,
        },
      ],
    });

    return NextResponse.json({ insights: message.content[0].text.trim() });
  } catch (err) {
    console.error("AI insights error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}