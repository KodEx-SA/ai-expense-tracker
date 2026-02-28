import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { description, amount, category, date, notes } = await request.json();
    const { data, error } = await supabase.from("expenses")
      .update({ description, amount:parseFloat(amount), category, date, notes })
      .eq("id", id).select().single();
    if (error) throw error;
    if (!data) return NextResponse.json({ error:"Not found" }, { status:404 });
    return NextResponse.json(data);
  } catch (err) { return NextResponse.json({ error:err.message }, { status:500 }); }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success:true });
  } catch (err) { return NextResponse.json({ error:err.message }, { status:500 }); }
}
