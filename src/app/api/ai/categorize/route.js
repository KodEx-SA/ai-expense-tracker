import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/categorize
export async function POST(request) {
  try {
    const { description, amount } = await request.json();

    if (!description) {
      return NextResponse.json({ error: "description is required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `You are an expense categorization assistant. Given an expense description and optional amount, pick the single most appropriate category from this list:

${EXPENSE_CATEGORIES.join(", ")}

Expense: "${description}"${amount ? ` (R${amount})` : ""}

Respond with ONLY the category name, nothing else.`,
        },
      ],
    });

    const category = message.content[0].text.trim();

    // Validate category is in our list
    const matched = EXPENSE_CATEGORIES.find(
      (c) => c.toLowerCase() === category.toLowerCase()
    );

    return NextResponse.json({
      category: matched || "Uncategorized",
    });
  } catch (err) {
    console.error("AI categorize error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}