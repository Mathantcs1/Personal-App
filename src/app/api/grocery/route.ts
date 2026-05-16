import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAuth();
  const lists = await prisma.groceryList.findMany({
    include: { items: { orderBy: { position: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(lists);
}

export async function POST(request: Request) {
  await requireAuth();
  const { name } = await request.json();
  const list = await prisma.groceryList.create({
    data: { name },
    include: { items: true },
  });
  return NextResponse.json(list, { status: 201 });
}
