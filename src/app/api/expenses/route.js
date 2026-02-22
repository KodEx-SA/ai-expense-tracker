import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/expenses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");
    const limit = searchParams.get("limit");

    let query = supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (category && category !== "all") query = query.eq("category", category);
    if (startDate) query = query.gte("date", startDate);
    if (endDate)   query = query.lte("date", endDate);
    if (limit)     query = query.limit(parseInt(limit));

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/expenses
export async function POST(request) {
  try {
    const body = await request.json();
    const { description, amount, category, date, notes } = body;

    if (!description || !amount) {
      return NextResponse.json(
        { error: "description and amount are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert([{ description, amount: parseFloat(amount), category, date, notes }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}