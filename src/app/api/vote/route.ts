import { NextRequest, NextResponse } from "next/server";
import { addVote, getVotes, getVoteStatus } from "@/lib/store";
import { teams } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ votes: getVotes(), status: getVoteStatus() });
}

export async function POST(req: NextRequest) {
  const { teamId } = await req.json();
  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    return NextResponse.json({ error: "Invalid team" }, { status: 400 });
  }

  const status = getVoteStatus();
  if (!status[team.tier]) {
    return NextResponse.json({ error: "Voting is closed for this category" }, { status: 403 });
  }

  const votes = addVote(teamId);
  return NextResponse.json({ votes });
}
