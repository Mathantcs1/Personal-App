import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { passphrase } = await request.json();

  const hash = process.env.AUTH_PASSPHRASE_HASH;
  if (!hash) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const valid = await bcrypt.compare(passphrase, hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid passphrase" }, { status: 401 });
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.session.create({ data: { token, expiresAt } });

  const response = NextResponse.json({ ok: true });
  const cookieConfig = createSessionCookie(token);
  response.cookies.set(cookieConfig);
  return response;
}
