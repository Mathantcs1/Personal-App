import { NextResponse } from "next/server";
import { fireReminderNotifications } from "@/lib/notifications";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("Authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  await fireReminderNotifications();
  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  return POST(request);
}
