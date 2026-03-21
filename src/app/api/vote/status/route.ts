import { NextRequest, NextResponse } from "next/server";
import { getVoteStatus, setVoteStatus } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getVoteStatus());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, status } = body;

  if (password !== (process.env.ADMIN_PASSWORD || "ssf2026")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setVoteStatus(status);
  return NextResponse.json(getVoteStatus());
}
