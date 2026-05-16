import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";

export async function GET() {
  await requireAuth();
  const notes = await prisma.devNote.findMany({
    include: { tags: true },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  await requireAuth();
  const { title, content = {}, isPinned = false, tags: tagNames = [] } = await request.json();
  const tags = await upsertTags(tagNames);
  const note = await prisma.devNote.create({
    data: { title, content, isPinned, tags: { connect: tags.map((t) => ({ id: t.id })) } },
    include: { tags: true },
  });
  return NextResponse.json(note, { status: 201 });
}
