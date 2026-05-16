"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagInput } from "@/components/shared/TagInput";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/useAutoSave";

const MOODS = [
  { value: 1, emoji: "😔", label: "Bad" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "🙂", label: "Good" },
  { value: 4, emoji: "😊", label: "Great" },
  { value: 5, emoji: "😄", label: "Amazing" },
];

interface JournalEntryEditorProps { date: string }

export function JournalEntryEditor({ date }: JournalEntryEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [mood, setMood] = useState<number | null>(null);
  const [tags, setTags] = useState<{ name: string }[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/journal/${date}`)
      .then((r) => r.json())
      .then((entry) => {
        if (entry) {
          setContent((entry.content as Record<string, unknown>) ?? {});
          setMood(entry.mood ?? null);
          setTags(entry.tags?.map((t: { name: string }) => ({ name: t.name })) ?? []);
          setAiSummary(entry.aiSummary ?? null);
          setSaved(true);
        }
      });
  }, [date]);

  const save = useCallback(
    async (data: { content: Record<string, unknown> }) => {
      setSaving(true);
      const res = await fetch(`/api/journal/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mood, tags: tags.map((t) => t.name) }),
      });
      if (res.ok) setSaved(true);
      setSaving(false);
    },
    [date, mood, tags]
  );

  useAutoSave({ content }, save, 1500);

  async function handleSummarize() {
    setSummarizing(true);
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, content }),
    });
    if (res.ok) {
      const { summary } = await res.json();
      setAiSummary(summary);
      toast.success("Summary generated");
    }
    setSummarizing(false);
  }

  const displayDate = format(new Date(date + "T12:00:00"), "EEEE, MMMM d, yyyy");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/journal")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground flex-1">{displayDate}</h1>
        <span className="text-xs text-muted-foreground">{saving ? "Saving..." : saved ? "Saved" : ""}</span>
      </div>

      <div className="mb-5">
        <p className="text-sm text-muted-foreground mb-2">How are you feeling?</p>
        <div className="flex gap-3">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value === mood ? null : m.value)}
              title={m.label}
              className={`text-2xl transition-transform hover:scale-110 ${mood === m.value ? "scale-125" : "opacity-50 hover:opacity-100"}`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <TagInput tags={tags} onChange={setTags} placeholder="Add tags..." />
      </div>

      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="What's on your mind today?"
        className="mb-4"
      />

      {aiSummary && (
        <div className="p-4 rounded-xl border bg-muted/30 mb-4">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            AI Summary
          </div>
          <p className="text-sm">{aiSummary}</p>
        </div>
      )}

      <Button variant="outline" onClick={handleSummarize} disabled={summarizing}>
        <Sparkles className="w-4 h-4" />
        {summarizing ? "Summarizing..." : "Summarize with AI"}
      </Button>
    </div>
  );
}
