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

  const supabase = getSupabase();

  // Increment vote round
  const { data: config } = await supabase
    .from("config")
    .select("value")
    .eq("key", "vote_round")
    .single();

  const currentRound = parseInt(config?.value ?? "1", 10);
  const newRound = currentRound + 1;

  await supabase
    .from("config")
    .upsert({ key: "vote_round", value: String(newRound) });

  // Delete all votes
  await supabase.from("votes").delete().neq("id", 0);

  return NextResponse.json({ ok: true, round: newRound });
}
