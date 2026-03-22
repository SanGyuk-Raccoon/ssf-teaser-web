import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function DELETE(req: NextRequest) {
  const { entryId, password } = await req.json();

  if (!entryId || !password) {
    return NextResponse.json({ error: "Entry ID and password required" }, { status: 400 });
  }

  // Verify password
  const { data: entry } = await getSupabase()
    .from("naming_entries")
    .select("id, password")
    .eq("id", entryId)
    .single();

  if (!entry) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
  }
  if (entry.password !== password) {
    return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 });
  }

  await getSupabase().from("naming_entries").delete().eq("id", entryId);
  return NextResponse.json({ ok: true });
}
