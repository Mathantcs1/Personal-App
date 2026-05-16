import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAuth();
  const profile = await prisma.userProfile.findFirst();
  return NextResponse.json(profile ?? { phoneNumber: null, smsEnabled: false, timezone: "UTC" });
}

export async function PUT(request: Request) {
  await requireAuth();
  const { phoneNumber, smsEnabled, timezone } = await request.json();
  const existing = await prisma.userProfile.findFirst();
  const profile = existing
    ? await prisma.userProfile.update({ where: { id: existing.id }, data: { phoneNumber: phoneNumber || null, smsEnabled, ...(timezone && { timezone }) } })
    : await prisma.userProfile.create({ data: { phoneNumber: phoneNumber || null, smsEnabled } });
  return NextResponse.json(profile);
}
