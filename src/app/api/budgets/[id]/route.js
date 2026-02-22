import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PUT /api/budgets/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { category, monthly_limit, alert_threshold } = body;

    const { data, error } = await supabase
      .from("budgets")
      .update({ category, monthly_limit: parseFloat(monthly_limit), alert_threshold })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/budgets/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}