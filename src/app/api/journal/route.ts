import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAuth();
  const entries = await prisma.journalEntry.findMany({
    select: { id: true, entryDate: true, mood: true, aiSummary: true },
    orderBy: { entryDate: "desc" },
  });
  return NextResponse.json(entries);
}
