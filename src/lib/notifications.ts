import webpush from "web-push";
import { prisma } from "@/lib/prisma";

if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || "mailto:admin@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushNotification(title: string, body: string) {
  const subscriptions = await prisma.pushSubscription.findMany();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title, body, url: appUrl + "/reminders" })
      ).catch(async (err) => {
        if (err.statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => {});
        }
      })
    )
  );
}

export async function sendSMS(to: string, body: string) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return;
  const twilio = (await import("twilio")).default;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({ body, from: process.env.TWILIO_FROM_NUMBER!, to });
}

export async function fireReminderNotifications() {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 60 * 1000);
  const windowEnd = new Date(now.getTime() + 60 * 1000);

  const dueReminders = await prisma.reminder.findMany({
    where: {
      isCompleted: false,
      dueAt: { gte: windowStart, lte: windowEnd },
      OR: [{ lastNotifiedAt: null }, { lastNotifiedAt: { lt: windowStart } }],
    },
  });

  const leadTimeReminders = await prisma.reminder.findMany({
    where: { isCompleted: false, leadTimeMinutes: { not: null } },
  });

  const leadTimeDue = leadTimeReminders.filter((r) => {
    if (!r.leadTimeMinutes) return false;
    const warnAt = new Date(r.dueAt.getTime() - r.leadTimeMinutes * 60 * 1000);
    return warnAt >= windowStart && warnAt <= windowEnd &&
      (!r.lastNotifiedAt || r.lastNotifiedAt < windowStart);
  });

  const userProfile = await prisma.userProfile.findFirst();

  for (const r of dueReminders) {
    const title = "⏰ Reminder";
    const body = `Now due: ${r.title}`;
    await sendPushNotification(title, body).catch(() => {});
    if (r.smsEnabled && userProfile?.smsEnabled && userProfile?.phoneNumber) {
      await sendSMS(userProfile.phoneNumber, `Reminder: ${r.title}`).catch(() => {});
    }
    await prisma.reminder.update({ where: { id: r.id }, data: { lastNotifiedAt: now } });
  }

  for (const r of leadTimeDue) {
    const body = `Coming up in ${r.leadTimeMinutes} min: ${r.title}`;
    await sendPushNotification("⏰ Upcoming Reminder", body).catch(() => {});
    if (r.smsEnabled && userProfile?.smsEnabled && userProfile?.phoneNumber) {
      await sendSMS(userProfile.phoneNumber, body).catch(() => {});
    }
    await prisma.reminder.update({ where: { id: r.id }, data: { lastNotifiedAt: now } });
  }
}
