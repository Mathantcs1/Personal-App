"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

const FIRED_KEY = "reminder_fired_ids";

function getFiredIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(FIRED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function addFiredId(id: string) {
  try {
    const ids = getFiredIds();
    ids.add(id);
    sessionStorage.setItem(FIRED_KEY, JSON.stringify([...ids]));
  } catch { /* ignore */ }
}

export function useReminderPoller() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function poll() {
    try {
      const res = await fetch("/api/reminders/due");
      if (!res.ok) return;
      const { due, leadTime } = await res.json() as {
        due: { id: string; title: string }[];
        leadTime: { id: string; title: string; leadTimeMinutes: number }[];
      };

      const fired = getFiredIds();

      for (const r of due) {
        const key = `due_${r.id}`;
        if (!fired.has(key)) {
          toast(`⏰ Now due: ${r.title}`, { duration: 8000 });
          addFiredId(key);
        }
      }

      for (const r of leadTime) {
        const key = `lead_${r.id}`;
        if (!fired.has(key)) {
          toast(`⏰ Coming up in ${r.leadTimeMinutes} min: ${r.title}`, { duration: 8000 });
          addFiredId(key);
        }
      }
    } catch { /* network error, skip */ }
  }

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
