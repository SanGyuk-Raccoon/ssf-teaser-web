import { NextRequest, NextResponse } from "next/server";
import { likeNamingEntry } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { entryId } = await req.json();

  if (!entryId) {
    return NextResponse.json({ error: "Entry ID required" }, { status: 400 });
  }

  const entry = likeNamingEntry(entryId);
  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}
