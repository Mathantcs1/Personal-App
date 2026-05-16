import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  await requireAuth();
  const { itemId } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.isChecked !== undefined) data.isChecked = body.isChecked;
  if (body.quantity !== undefined) data.quantity = body.quantity;
  const item = await prisma.groceryItem.update({ where: { id: itemId }, data });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  await requireAuth();
  const { itemId } = await params;
  await prisma.groceryItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
