import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id: meetingId } = await params;
  const { text } = await request.json();
  const item = await prisma.actionItem.create({ data: { text, meetingId } });
  return NextResponse.json(item, { status: 201 });
}
