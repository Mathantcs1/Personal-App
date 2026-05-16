import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(_: Request, { params }: { params: Promise<{ date: string }> }) {
  await requireAuth();
  const { date } = await params;
  const d = new Date(date);
  const entry = await prisma.journalEntry.findFirst({
    where: { entryDate: { gte: startOfDay(d), lte: endOfDay(d) } },
    include: { tags: true },
  });
  return NextResponse.json(entry);
}

export async function PUT(request: Request, { params }: { params: Promise<{ date: string }> }) {
  await requireAuth();
  const { date } = await params;
  const { content, mood, tags: tagNames = [] } = await request.json();
  const d = new Date(date);
  const tags = await upsertTags(tagNames);

  const entry = await prisma.journalEntry.upsert({
    where: { entryDate: startOfDay(d) },
    update: {
      content,
      ...(mood !== undefined && { mood }),
      tags: { set: tags.map((t) => ({ id: t.id })) },
    },
    create: {
      entryDate: startOfDay(d),
      content,
      mood,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true },
  });
  return NextResponse.json(entry);
}
