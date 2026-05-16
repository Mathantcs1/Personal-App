"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { BookMarked, Plus } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { formatDateSlug } from "@/lib/utils";

interface EntryMeta {
  id: string;
  entryDate: string;
  mood: number | null;
  aiSummary: string | null;
}

const moodEmoji = ["", "😔", "😐", "🙂", "😊", "😄"];

export function JournalClient() {
  const [entries, setEntries] = useState<EntryMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const today = formatDateSlug(new Date());

  useEffect(() => {
    fetch("/api/journal")
      .then((r) => r.json())
      .then((data) => { setEntries(data); setLoading(false); });
  }, []);

  if (loading) return <div className="animate-pulse text-muted-foreground text-sm">Loading journal...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Journal</h1>
        <Button onClick={() => router.push(`/journal/${today}`)}>
          <Plus className="w-4 h-4" /> Today's Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No journal entries"
          description="Start your daily reflection practice."
          action={<Button onClick={() => router.push(`/journal/${today}`)}><Plus className="w-4 h-4" /> Write today</Button>}
        />
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => router.push(`/journal/${formatDateSlug(parseISO(entry.entryDate))}`)}
              className="w-full text-left flex items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="text-center min-w-[52px]">
                <p className="text-xs text-muted-foreground uppercase">{format(parseISO(entry.entryDate), "MMM")}</p>
                <p className="text-2xl font-bold leading-none">{format(parseISO(entry.entryDate), "d")}</p>
                <p className="text-xs text-muted-foreground">{format(parseISO(entry.entryDate), "EEE")}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {entry.mood && <span className="text-lg">{moodEmoji[entry.mood]}</span>}
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {format(parseISO(entry.entryDate), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                {entry.aiSummary && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{entry.aiSummary}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
