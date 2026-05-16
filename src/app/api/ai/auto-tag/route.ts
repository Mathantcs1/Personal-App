import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { generateTags } from "@/lib/claude";

export async function POST(request: Request) {
  await requireAuth();
  const { content } = await request.json();
  if (!content?.trim()) return NextResponse.json({ tags: [] });
  const tags = await generateTags(content);
  return NextResponse.json({ tags });
}
