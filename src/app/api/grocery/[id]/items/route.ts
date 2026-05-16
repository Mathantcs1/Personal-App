import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id: listId } = await params;
  const { name, quantity, unit, category } = await request.json();
  const maxPos = await prisma.groceryItem.aggregate({ where: { listId }, _max: { position: true } });
  const item = await prisma.groceryItem.create({
    data: { name, quantity, unit, category, listId, position: (maxPos._max.position ?? 0) + 1 },
  });
  return NextResponse.json(item, { status: 201 });
}
