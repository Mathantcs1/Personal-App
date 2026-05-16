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
  if (body.description !== undefined) data.description = body.description;
  if (body.dueAt !== undefined) data.dueAt = new Date(body.dueAt);
  if (body.isCompleted !== undefined) data.isCompleted = body.isCompleted;
  if (body.priority !== undefined) data.priority = body.priority;
  if (body.leadTimeMinutes !== undefined) data.leadTimeMinutes = body.leadTimeMinutes ?? null;
  if (body.smsEnabled !== undefined) data.smsEnabled = body.smsEnabled;
  if (body.tags !== undefined) {
    const tags = await upsertTags(body.tags);
    data.tags = { set: tags.map((t) => ({ id: t.id })) };
  }
  const reminder = await prisma.reminder.update({ where: { id }, data, include: { tags: true } });
  return NextResponse.json(reminder);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  await prisma.reminder.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
