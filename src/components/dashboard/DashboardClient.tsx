"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Sparkles, RefreshCw, Bell, Clock, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MicButton } from "@/components/shared/MicButton";
import { cn } from "@/lib/utils";

interface Reminder { id: string; title: string; dueAt: string; priority: string }
interface StickyNote { id: string; content: string; color: string; isPinned: boolean }
interface Task { id: string; title: string; status: string; priority: string }

const priorityColor: Record<string, string> = {
  LOW: "text-green-500", MEDIUM: "text-yellow-500", HIGH: "text-orange-500", URGENT: "text-red-500",
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export function DashboardClient() {
  const [plan, setPlan] = useState("");
  const [planLoading, setPlanLoading] = useState(false);
  const [morningNote, setMorningNote] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [pinnedNotes, setPinnedNotes] = useState<StickyNote[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/reminders?upcoming=true").then((r) => r.ok ? r.json() : []),
      fetch("/api/sticky-notes").then((r) => r.ok ? r.json() : []),
      fetch("/api/tasks").then((r) => r.ok ? r.json() : []),
    ]).then(([rem, notes, tsk]) => {
      setReminders(rem.slice(0, 5));
      setPinnedNotes(notes.filter((n: StickyNote) => n.isPinned).slice(0, 4));
      setTasks(tsk.filter((t: Task) => t.status !== "DONE" && t.status !== "CANCELLED").slice(0, 5));
    });
  }, []);

  async function generatePlan() {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setPlan("");
    setPlanLoading(true);

    const res = await fetch("/api/ai/daily-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ morningNote }),
      signal: abortRef.current.signal,
    }).catch(() => null);

    if (!res?.ok || !res.body) { setPlanLoading(false); return; }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try { const { text } = JSON.parse(data); setPlan((p) => p + text); } catch { /* skip */ }
        }
      }
    }
    setPlanLoading(false);
  }

  const noteColorMap: Record<string, string> = {
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    white: "bg-white dark:bg-muted border-border",
    black: "bg-neutral-900 text-neutral-100 border-neutral-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting()}! {format(new Date(), "EEEE, MMMM d")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here&apos;s your day at a glance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Plan */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-primary" /> AI Daily Plan
            </div>
            <Button variant="ghost" size="sm" onClick={generatePlan} disabled={planLoading}>
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1", planLoading && "animate-spin")} />
              {planLoading ? "Generating..." : plan ? "Regenerate" : "Generate Plan"}
            </Button>
          </div>
          {!plan && !planLoading && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <textarea
                  value={morningNote}
                  onChange={(e) => setMorningNote(e.target.value)}
                  placeholder="Any morning thoughts or intentions for today?"
                  rows={2}
                  className="flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <MicButton onTranscript={(t) => setMorningNote((p) => p + t)} />
              </div>
              <Button onClick={generatePlan} className="w-full">
                <Sparkles className="w-4 h-4" /> Generate Today&apos;s Plan
              </Button>
            </div>
          )}
          {plan && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
              {plan}
            </div>
          )}
          {planLoading && !plan && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
            </div>
          )}
        </div>

        {/* Pinned Notes */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 font-semibold text-sm mb-3">
            <Pin className="w-4 h-4 text-primary" /> Pinned Notes
          </div>
          {pinnedNotes.length === 0 ? (
            <p className="text-xs text-muted-foreground">No pinned sticky notes.</p>
          ) : (
            <div className="space-y-2">
              {pinnedNotes.map((note) => (
                <Link key={note.id} href="/sticky-notes"
                  className={cn("block rounded-lg border p-2.5 text-xs leading-snug hover:shadow-sm transition-shadow", noteColorMap[note.color] ?? noteColorMap.yellow)}>
                  {note.content.slice(0, 100)}{note.content.length > 100 ? "..." : ""}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Reminders */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 font-semibold text-sm mb-3">
            <Bell className="w-4 h-4 text-primary" /> Upcoming Reminders
          </div>
          {reminders.length === 0 ? (
            <p className="text-xs text-muted-foreground">No upcoming reminders.</p>
          ) : (
            <div className="space-y-2">
              {reminders.map((r) => (
                <Link key={r.id} href="/reminders"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", priorityColor[r.priority].replace("text-", "bg-"))} />
                  <span className="flex-1 truncate">{r.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{format(new Date(r.dueAt), "MMM d")}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Active Tasks */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 font-semibold text-sm mb-3">
            <Clock className="w-4 h-4 text-primary" /> Active Tasks
          </div>
          {tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground">No active tasks.</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <Link key={t.id} href="/tasks"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", priorityColor[t.priority].replace("text-", "bg-"))} />
                  <span className="flex-1 truncate">{t.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{t.status.replace("_", " ")}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
