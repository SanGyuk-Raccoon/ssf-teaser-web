import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const authError = verifyAdmin(body.password ?? "");
  if (authError) return authError;

  const { data } = await getSupabase()
    .from("naming_entries")
    .select("id, title, password, likes, created_at")
    .order("likes", { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function DELETE(req: NextRequest) {
  let body: { password?: string; entryId?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const authError = verifyAdmin(body.password ?? "");
  if (authError) return authError;
  const { entryId } = body;

  await getSupabase().from("naming_entries").delete().eq("id", entryId);
  return NextResponse.json({ ok: true });
}
