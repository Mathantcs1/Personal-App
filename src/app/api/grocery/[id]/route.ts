import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const list = await prisma.groceryList.findUniqueOrThrow({
    where: { id },
    include: { items: { orderBy: { position: "asc" } } },
  });
  return NextResponse.json(list);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const { name } = await request.json();
  const list = await prisma.groceryList.update({ where: { id }, data: { name }, include: { items: true } });
  return NextResponse.json(list);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  await prisma.groceryList.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
