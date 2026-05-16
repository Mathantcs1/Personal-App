import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";

export async function GET() {
  await requireAuth();
  const snippets = await prisma.snippet.findMany({
    include: { tags: true },
    orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json(snippets);
}

export async function POST(request: Request) {
  await requireAuth();
  const { title, code, language = "plaintext", description, tags: tagNames = [] } = await request.json();
  const tags = await upsertTags(tagNames);
  const snippet = await prisma.snippet.create({
    data: { title, code, language, description, tags: { connect: tags.map((t) => ({ id: t.id })) } },
    include: { tags: true },
  });
  return NextResponse.json(snippet, { status: 201 });
}
