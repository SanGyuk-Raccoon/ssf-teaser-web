import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  const { data } = await getSupabase().from("vote_status").select("tier, is_open");
  const status: Record<string, boolean> = {};
  for (const row of data ?? []) {
    status[row.tier] = row.is_open;
  }
  return NextResponse.json(status);
}

export async function POST(req: NextRequest) {
  let body: { password?: string; status?: Record<string, boolean> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const authError = verifyAdmin(body.password ?? "");
  if (authError) return authError;
  const { status } = body;

  if (!status || typeof status !== "object") {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  for (const [tier, isOpen] of Object.entries(status)) {
    await getSupabase()
      .from("vote_status")
      .update({ is_open: isOpen })
      .eq("tier", tier);
  }

  const { data } = await getSupabase().from("vote_status").select("tier, is_open");
  const result: Record<string, boolean> = {};
  for (const row of data ?? []) {
    result[row.tier] = row.is_open;
  }
  return NextResponse.json(result);
}
