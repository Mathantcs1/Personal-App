import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  await requireAuth();
  const { itemId } = await params;
  const { isCompleted } = await request.json();
  const item = await prisma.actionItem.update({ where: { id: itemId }, data: { isCompleted } });
  return NextResponse.json(item);
}
