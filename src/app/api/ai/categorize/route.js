import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { description, amount } = await request.json();
    if (!description) return NextResponse.json({ error:"description is required" }, { status:400 });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 50,
      messages: [{
        role: "user",
        content: `Categorize this expense into exactly one of these categories: ${EXPENSE_CATEGORIES.join(", ")}\n\nExpense: "${description}"${amount ? ` (R${amount})` : ""}\n\nRespond with ONLY the category name, nothing else.`,
      }],
    });

    const raw     = message.content[0].text.trim();
    const matched = EXPENSE_CATEGORIES.find(c => c.toLowerCase() === raw.toLowerCase());
    return NextResponse.json({ category: matched || "Uncategorized" });
  } catch (err) {
    console.error("AI categorize error:", err);
    return NextResponse.json({ error: err.message }, { status:500 });
  }
}
