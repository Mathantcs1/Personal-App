import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { MeetingEditor } from "@/components/meetings/MeetingEditor";

interface Props { params: Promise<{ id: string }> }

export default async function MeetingDetailPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { tags: true, attendees: true, actionItems: true, project: true },
  });
  if (!meeting) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <MeetingEditor meeting={meeting as any} />;
}
