import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";
import { Priority, TaskStatus } from "@prisma/client";

export async function GET(request: Request) {
  await requireAuth();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as TaskStatus | null;
  const projectId = searchParams.get("projectId");

  const tasks = await prisma.task.findMany({
    where: {
      parentId: null,
      ...(status && { status }),
      ...(projectId && { projectId }),
    },
    include: { tags: true, project: true, children: { include: { tags: true } } },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  await requireAuth();
  const body = await request.json();
  const { title, description, status = "TODO", priority = "MEDIUM", dueDate, projectId, tags: tagNames = [] } = body;

  const tags = await upsertTags(tagNames);
  const maxPos = await prisma.task.aggregate({ where: { status: status as TaskStatus }, _max: { position: true } });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status as TaskStatus,
      priority: priority as Priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId: projectId || undefined,
      position: (maxPos._max.position ?? 0) + 1,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true, project: true },
  });
  return NextResponse.json(task, { status: 201 });
}
