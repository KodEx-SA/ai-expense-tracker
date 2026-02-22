import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { todayStr } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/parse
// Converts natural language like "spent R120 on lunch yesterday" into a structured expense
export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const today = todayStr();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Parse this natural language expense entry into JSON. Today's date is ${today}.

Categories available: ${EXPENSE_CATEGORIES.join(", ")}

Input: "${text}"

Return ONLY valid JSON with this exact shape:
{
  "description": "short description of the expense",
  "amount": 0.00,
  "category": "one of the categories above",
  "date": "YYYY-MM-DD"
}

If amount cannot be determined, use 0. If date cannot be determined, use today (${today}). No explanation, just JSON.`,
        },
      ],
    });

    let raw = message.content[0].text.trim();

    // Strip markdown code block if present
    raw = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();

    const parsed = JSON.parse(raw);

    // Validate fields
    if (!parsed.description) parsed.description = text;
    if (!parsed.amount || isNaN(parsed.amount)) parsed.amount = 0;
    if (!EXPENSE_CATEGORIES.includes(parsed.category)) parsed.category = "Uncategorized";
    if (!parsed.date || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) parsed.date = today;

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI parse error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}