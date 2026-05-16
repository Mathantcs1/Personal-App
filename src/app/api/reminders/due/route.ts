import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAuth();
  const now = new Date();
  const windowStart = new Date(now.getTime() - 5 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 5 * 60 * 1000);

  const reminders = await prisma.reminder.findMany({
    where: {
      isCompleted: false,
      dueAt: { gte: windowStart, lte: windowEnd },
    },
  });

  const leadTimeReminders = await prisma.reminder.findMany({
    where: {
      isCompleted: false,
      leadTimeMinutes: { not: null },
    },
  });

  const leadTimeDue = leadTimeReminders.filter((r) => {
    if (!r.leadTimeMinutes) return false;
    const warnAt = new Date(r.dueAt.getTime() - r.leadTimeMinutes * 60 * 1000);
    return warnAt >= windowStart && warnAt <= windowEnd;
  });

  return NextResponse.json({ due: reminders, leadTime: leadTimeDue });
}
