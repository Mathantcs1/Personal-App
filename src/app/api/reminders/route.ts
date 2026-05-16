import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";
import { Priority } from "@prisma/client";

export async function GET(request: Request) {
  await requireAuth();
  const { searchParams } = new URL(request.url);
  const upcoming = searchParams.get("upcoming");

  const where = upcoming
    ? { isCompleted: false, dueAt: { gte: new Date() } }
    : {};

  const reminders = await prisma.reminder.findMany({
    where,
    include: { tags: true },
    orderBy: [{ isCompleted: "asc" }, { dueAt: "asc" }],
  });
  return NextResponse.json(reminders);
}

export async function POST(request: Request) {
  await requireAuth();
  const body = await request.json();
  const {
    title, description, dueAt, isRecurring = false, rrule,
    priority = "MEDIUM", leadTimeMinutes, smsEnabled = false, tags: tagNames = [],
  } = body;

  const tags = await upsertTags(tagNames);
  const reminder = await prisma.reminder.create({
    data: {
      title,
      description,
      dueAt: new Date(dueAt),
      isRecurring,
      rrule,
      priority: priority as Priority,
      leadTimeMinutes: leadTimeMinutes ?? null,
      smsEnabled,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true },
  });
  return NextResponse.json(reminder, { status: 201 });
}
