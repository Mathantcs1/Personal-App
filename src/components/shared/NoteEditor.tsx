"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Pin, PinOff, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagInput } from "@/components/shared/TagInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/useAutoSave";
import { MicButton } from "@/components/shared/MicButton";

type NoteMode = "personal" | "work" | "dev";

const apiPath: Record<NoteMode, string> = {
  personal: "/api/personal-notes",
  work: "/api/work-notes",
  dev: "/api/dev-notes",
};

const backPath: Record<NoteMode, string> = {
  personal: "/personal-notes",
  work: "/work-notes",
  dev: "/dev-notes",
};

interface NoteData {
  id: string;
  title: string;
  content: Record<string, unknown>;
  isPinned: boolean;
  tags: { id: string; name: string }[];
}

interface NoteEditorProps {
  mode: NoteMode;
  note?: NoteData;
}

export function NoteEditor({ mode, note }: NoteEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState<Record<string, unknown>>(
    (note?.content as Record<string, unknown>) ?? {}
  );
  const [isPinned, setIsPinned] = useState(note?.isPinned ?? false);
  const [tags, setTags] = useState<{ name: string }[]>(
    note?.tags.map((t) => ({ name: t.name })) ?? []
  );
  const [noteId, setNoteId] = useState(note?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!note);

  const save = useCallback(
    async (data: { title: string; content: Record<string, unknown> }) => {
      if (!data.title.trim()) return;
      setSaving(true);
      const url = noteId ? `${apiPath[mode]}/${noteId}` : apiPath[mode];
      const method = noteId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, isPinned, tags: tags.map((t) => t.name) }),
      });
      if (res.ok) {
        const saved = await res.json();
        if (!noteId) {
          setNoteId(saved.id);
          router.replace(`${backPath[mode]}/${saved.id}`);
        }
        setSaved(true);
      }
      setSaving(false);
    },
    [noteId, mode, isPinned, tags, router]
  );

  useAutoSave({ title, content }, save, 1500);

  async function handleDelete() {
    if (!noteId) return;
    if (!confirm("Delete this note?")) return;
    await fetch(`${apiPath[mode]}/${noteId}`, { method: "DELETE" });
    toast.success("Note deleted");
    router.push(backPath[mode]);
  }

  async function handlePinToggle() {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    if (noteId) {
      await fetch(`${apiPath[mode]}/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: newPinned }),
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push(backPath[mode])}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">{saving ? "Saving..." : saved ? "Saved" : ""}</span>
          <Button variant="ghost" size="icon" onClick={handlePinToggle} title={isPinned ? "Unpin" : "Pin"}>
            {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          </Button>
          {noteId && (
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-2xl font-bold border-0 shadow-none px-0 focus-visible:ring-0 h-auto text-foreground placeholder:text-muted-foreground/50"
        />
        <MicButton onTranscript={(t) => setTitle((prev) => prev + t)} />
      </div>

      <div className="mb-4">
        <TagInput tags={tags} onChange={setTags} placeholder="Add tags..." />
      </div>

      <RichTextEditor content={content} onChange={setContent} placeholder="Start writing..." />
    </div>
  );
}
