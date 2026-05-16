import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";

export async function GET() {
  await requireAuth();
  const meetings = await prisma.meeting.findMany({
    include: { tags: true, project: true, attendees: true, actionItems: true },
    orderBy: { meetingDate: "desc" },
  });
  return NextResponse.json(meetings);
}

export async function POST(request: Request) {
  await requireAuth();
  const { title, meetingDate, notes = {}, projectId, attendees = [], tags: tagNames = [] } = await request.json();
  const tags = await upsertTags(tagNames);
  const meeting = await prisma.meeting.create({
    data: {
      title,
      meetingDate: new Date(meetingDate),
      notes,
      projectId: projectId || undefined,
      attendees: { create: attendees.map((name: string) => ({ name })) },
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true, project: true, attendees: true, actionItems: true },
  });
  return NextResponse.json(meeting, { status: 201 });
}
