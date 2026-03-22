import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== (process.env.ADMIN_PASSWORD || "ssf2026")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await getSupabase()
    .from("naming_entries")
    .select("id, title, password, likes, created_at")
    .order("likes", { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function DELETE(req: NextRequest) {
  const { password, entryId } = await req.json();

  if (password !== (process.env.ADMIN_PASSWORD || "ssf2026")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await getSupabase().from("naming_entries").delete().eq("id", entryId);
  return NextResponse.json({ ok: true });
}
