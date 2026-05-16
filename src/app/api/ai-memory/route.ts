import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";
import { MemoryCategory } from "@prisma/client";

export async function GET() {
  await requireAuth();
  const memories = await prisma.aIMemory.findMany({
    include: { tags: true },
    orderBy: [{ importance: "desc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json(memories);
}

export async function POST(request: Request) {
  await requireAuth();
  const { content, category = "GENERAL", importance = 3, source, tags: tagNames = [] } = await request.json();
  const tags = await upsertTags(tagNames);
  const memory = await prisma.aIMemory.create({
    data: {
      content,
      category: category as MemoryCategory,
      importance,
      source,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true },
  });
  return NextResponse.json(memory, { status: 201 });
}
