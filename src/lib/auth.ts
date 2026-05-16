import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const session = await prisma.session.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
  });
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export function createSessionCookie(token: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  return {
    name: "session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    expires: expiresAt,
    path: "/",
  };
}
