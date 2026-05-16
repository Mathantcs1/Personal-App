import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const note = await prisma.personalNote.findUniqueOrThrow({ where: { id }, include: { tags: true } });
  return NextResponse.json(note);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.content !== undefined) data.content = body.content;
  if (body.isPinned !== undefined) data.isPinned = body.isPinned;
  if (body.tags !== undefined) {
    const tags = await upsertTags(body.tags);
    data.tags = { set: tags.map((t) => ({ id: t.id })) };
  }
  const note = await prisma.personalNote.update({ where: { id }, data, include: { tags: true } });
  return NextResponse.json(note);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  await prisma.personalNote.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
