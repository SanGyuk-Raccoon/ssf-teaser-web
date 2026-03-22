import { NextResponse } from "next/server";

export function verifyAdmin(password: string): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD || "ssf2026";
  if (password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
