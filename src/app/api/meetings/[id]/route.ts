import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const meeting = await prisma.meeting.findUniqueOrThrow({
    where: { id },
    include: { tags: true, project: true, attendees: true, actionItems: true },
  });
  return NextResponse.json(meeting);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.meetingDate !== undefined) data.meetingDate = new Date(body.meetingDate);
  if (body.tags !== undefined) {
    const tags = await upsertTags(body.tags);
    data.tags = { set: tags.map((t) => ({ id: t.id })) };
  }
  const meeting = await prisma.meeting.update({
    where: { id },
    data,
    include: { tags: true, project: true, attendees: true, actionItems: true },
  });
  return NextResponse.json(meeting);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  await prisma.meeting.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
