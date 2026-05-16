import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";
import { MemoryCategory } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.content !== undefined) data.content = body.content;
  if (body.category !== undefined) data.category = body.category as MemoryCategory;
  if (body.importance !== undefined) data.importance = body.importance;
  if (body.tags !== undefined) {
    const tags = await upsertTags(body.tags);
    data.tags = { set: tags.map((t) => ({ id: t.id })) };
  }
  const memory = await prisma.aIMemory.update({ where: { id }, data, include: { tags: true } });
  return NextResponse.json(memory);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  await prisma.aIMemory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
