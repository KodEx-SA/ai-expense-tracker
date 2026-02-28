import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { todayStr } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) return NextResponse.json({ error:"text is required" }, { status:400 });

    const today = todayStr();
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `Parse this expense into JSON. Today is ${today}. Currency is ZAR (R).\nCategories: ${EXPENSE_CATEGORIES.join(", ")}\n\nInput: "${text}"\n\nReturn ONLY valid JSON:\n{\n  "description": "short description",\n  "amount": 0.00,\n  "category": "one category from the list",\n  "date": "YYYY-MM-DD"\n}\n\nIf amount unknown use 0. If date unknown use today (${today}). No explanation, just JSON.`,
      }],
    });

    let raw = message.content[0].text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(raw);

    if (!parsed.description) parsed.description = text;
    if (!parsed.amount || isNaN(parsed.amount)) parsed.amount = 0;
    if (!EXPENSE_CATEGORIES.includes(parsed.category)) parsed.category = "Uncategorized";
    if (!parsed.date || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) parsed.date = today;

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI parse error:", err);
    return NextResponse.json({ error: err.message }, { status:500 });
  }
}
