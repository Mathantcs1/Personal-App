import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";
import { Priority, TaskStatus } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const { title, description, status, priority, dueDate, projectId, position, tags: tagNames } = body;

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (status !== undefined) data.status = status as TaskStatus;
  if (priority !== undefined) data.priority = priority as Priority;
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
  if (projectId !== undefined) data.projectId = projectId || null;
  if (position !== undefined) data.position = position;
  if (tagNames !== undefined) {
    const tags = await upsertTags(tagNames);
    data.tags = { set: tags.map((t) => ({ id: t.id })) };
  }

  const task = await prisma.task.update({
    where: { id },
    data,
    include: { tags: true, project: true },
  });
  return NextResponse.json(task);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
