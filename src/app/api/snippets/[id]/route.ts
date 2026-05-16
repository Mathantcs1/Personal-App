import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.code !== undefined) data.code = body.code;
  if (body.language !== undefined) data.language = body.language;
  if (body.description !== undefined) data.description = body.description;
  if (body.isFavorite !== undefined) data.isFavorite = body.isFavorite;
  if (body.tags !== undefined) {
    const tags = await upsertTags(body.tags);
    data.tags = { set: tags.map((t) => ({ id: t.id })) };
  }
  const snippet = await prisma.snippet.update({ where: { id }, data, include: { tags: true } });
  return NextResponse.json(snippet);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  await prisma.snippet.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
