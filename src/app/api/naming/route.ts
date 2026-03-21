import { NextRequest, NextResponse } from "next/server";
import { getNamingEntries, addNamingEntry } from "@/lib/store";

export async function GET() {
  const entries = getNamingEntries();
  const sorted = [...entries].sort((a, b) => b.likes - a.likes);
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  const { title, authorName } = await req.json();

  if (!title?.trim() || !authorName?.trim()) {
    return NextResponse.json({ error: "Title and author required" }, { status: 400 });
  }
  if (title.length > 30) {
    return NextResponse.json({ error: "Title too long (max 30)" }, { status: 400 });
  }

  const entry = addNamingEntry(title.trim(), authorName.trim());
  return NextResponse.json(entry);
}
