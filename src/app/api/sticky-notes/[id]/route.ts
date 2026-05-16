import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const { content, color, isPinned, tags: tagNames } = body;

  const data: Record<string, unknown> = {};
  if (content !== undefined) data.content = content;
  if (color !== undefined) data.color = color;
  if (isPinned !== undefined) data.isPinned = isPinned;

  if (tagNames !== undefined) {
    const tags = await upsertTags(tagNames);
    data.tags = { set: tags.map((t) => ({ id: t.id })) };
  }

  const note = await prisma.stickyNote.update({
    where: { id },
    data,
    include: { tags: true },
  });
  return NextResponse.json(note);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  await prisma.stickyNote.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
