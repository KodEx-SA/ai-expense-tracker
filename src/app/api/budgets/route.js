import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/budgets
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .order("category");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/budgets
export async function POST(request) {
  try {
    const body = await request.json();
    const { category, monthly_limit, alert_threshold = 80 } = body;

    if (!category || !monthly_limit) {
      return NextResponse.json(
        { error: "category and monthly_limit are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("budgets")
      .upsert([{ category, monthly_limit: parseFloat(monthly_limit), alert_threshold }], {
        onConflict: "category",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}