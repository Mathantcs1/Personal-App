import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { keywordSearch } from "@/lib/search";

export async function GET(request: Request) {
  await requireAuth();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json([]);
  const results = await keywordSearch(q);
  return NextResponse.json(results);
}
