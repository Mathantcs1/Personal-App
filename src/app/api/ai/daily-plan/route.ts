import { requireAuth } from "@/lib/auth";
import { generateDailyPlan } from "@/lib/claude";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(request: Request) {
  await requireAuth();
  const { morningNote, focusArea } = await request.json().catch(() => ({}));

  const today = new Date();
  const [tasks, reminders, meetings, memories, yesterdayPlan] = await Promise.all([
    prisma.task.findMany({ where: { status: { in: ["TODO", "IN_PROGRESS", "BLOCKED"] } }, orderBy: [{ priority: "desc" }, { dueDate: "asc" }], take: 10 }),
    prisma.reminder.findMany({ where: { isCompleted: false, dueAt: { gte: startOfDay(today), lte: endOfDay(today) } }, orderBy: { dueAt: "asc" } }),
    prisma.meeting.findMany({ where: { meetingDate: { gte: startOfDay(today), lte: endOfDay(today) } }, orderBy: { meetingDate: "asc" } }),
    prisma.aIMemory.findMany({ orderBy: { importance: "desc" }, take: 10 }),
    prisma.journalEntry.findFirst({ where: { entryDate: { gte: startOfDay(new Date(today.getTime() - 86400000)) } }, orderBy: { entryDate: "desc" } }),
  ]);

  const stream = await generateDailyPlan({
    tasks: tasks.map((t) => ({ title: t.title, priority: t.priority, dueDate: t.dueDate?.toISOString().split("T")[0] })),
    reminders: reminders.map((r) => ({ title: r.title, dueAt: r.dueAt.toISOString() })),
    meetings: meetings.map((m) => ({ title: m.title, meetingDate: m.meetingDate.toISOString() })),
    memories: memories.map((m) => ({ content: m.content, importance: m.importance })),
    yesterdayJournal: yesterdayPlan?.aiSummary ?? undefined,
    morningNote,
    focusArea,
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
