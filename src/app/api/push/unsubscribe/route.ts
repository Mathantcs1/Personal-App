import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireAuth();
  const { endpoint } = await request.json();
  await prisma.pushSubscription.delete({ where: { endpoint } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
