import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await getSupabase().from("vote_status").select("tier, is_open");
  const status: Record<string, boolean> = {};
  for (const row of data ?? []) {
    status[row.tier] = row.is_open;
  }
  return NextResponse.json(status);
}

export async function POST(req: NextRequest) {
  const { password, status } = await req.json();

  if (password !== (process.env.ADMIN_PASSWORD || "ssf2026")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Update each tier
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
