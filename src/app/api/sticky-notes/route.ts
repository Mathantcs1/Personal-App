import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";

export async function GET() {
  await requireAuth();
  const notes = await prisma.stickyNote.findMany({
    include: { tags: true },
    orderBy: [{ isPinned: "desc" }, { position: "asc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  await requireAuth();
  const body = await request.json();
  const { content, color = "yellow", isPinned = false, tags: tagNames = [] } = body;

  const tags = await upsertTags(tagNames);
  const maxPos = await prisma.stickyNote.aggregate({ _max: { position: true } });

  const note = await prisma.stickyNote.create({
    data: {
      content,
      color,
      isPinned,
      position: (maxPos._max.position ?? 0) + 1,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true },
  });
  return NextResponse.json(note, { status: 201 });
}
