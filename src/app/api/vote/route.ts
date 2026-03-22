import { NextRequest, NextResponse } from "next/server";
import { getVoteResults, getVoteStatus, addTierVote } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ ...getVoteResults(), status: getVoteStatus() });
}

export async function POST(req: NextRequest) {
  const { tier, score } = await req.json();

  const validTiers = ["신입", "YB", "OB"];
  if (!validTiers.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }
  if (typeof score !== "number" || score < 1 || score > 5) {
    return NextResponse.json({ error: "Score must be 1-5" }, { status: 400 });
  }

  const status = getVoteStatus();
  if (!status[tier as keyof typeof status]) {
    return NextResponse.json({ error: "Voting is closed for this tier" }, { status: 403 });
  }

  addTierVote(tier, score);
  return NextResponse.json({ ok: true });
}
