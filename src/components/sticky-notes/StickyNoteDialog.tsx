"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/shared/TagInput";
import { MicButton } from "@/components/shared/MicButton";
import { cn } from "@/lib/utils";

const COLORS = ["yellow", "orange", "pink", "purple", "blue", "green", "white", "black"] as const;
const colorPreview: Record<string, string> = {
  yellow: "bg-yellow-300", orange: "bg-orange-300", pink: "bg-pink-300", purple: "bg-purple-300",
  blue: "bg-blue-300", green: "bg-green-300", white: "bg-white border border-border", black: "bg-neutral-800",
};

interface StickyNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { content: string; color: string; isPinned: boolean; tags: string[] };
  onSave: (data: { content: string; color: string; isPinned: boolean; tags: string[] }) => Promise<void>;
}

export function StickyNoteDialog({ open, onOpenChange, initialData, onSave }: StickyNoteDialogProps) {
  const [content, setContent] = useState("");
  const [color, setColor] = useState<string>("yellow");
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<{ name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setContent(initialData?.content ?? "");
      setColor(initialData?.color ?? "yellow");
      setIsPinned(initialData?.isPinned ?? false);
      setTags(initialData?.tags.map((n) => ({ name: n })) ?? []);
    }
  }, [open, initialData]);

  async function handleSubmit() {
    if (!content.trim()) return;
    setSaving(true);
    await onSave({ content: content.trim(), color, isPinned, tags: tags.map((t) => t.name) });
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Note" : "New Sticky Note"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Color</p>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn("w-6 h-6 rounded-full transition-transform", colorPreview[c], color === c && "ring-2 ring-offset-2 ring-primary scale-110")}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your note..."
              rows={5}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="absolute right-2 bottom-2">
              <MicButton onTranscript={(t) => setContent((prev) => prev + t)} />
            </div>
          </div>

          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="Add tags..."
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="rounded" />
            <span className="text-sm">Pin note</span>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!content.trim() || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
