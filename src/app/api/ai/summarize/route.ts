import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { summarizeJournal } from "@/lib/claude";
import { tiptapToPlaintext } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function POST(request: Request) {
  await requireAuth();
  const { date, content } = await request.json();
  const plaintext = tiptapToPlaintext(content);
  if (!plaintext.trim()) return NextResponse.json({ summary: "" });

  const summary = await summarizeJournal(plaintext, date);

  const d = new Date(date);
  await prisma.journalEntry.updateMany({
    where: { entryDate: { gte: startOfDay(d) } },
    data: { aiSummary: summary },
  });

  return NextResponse.json({ summary });
}
