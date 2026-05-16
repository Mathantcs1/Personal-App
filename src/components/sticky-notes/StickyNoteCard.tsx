"use client";

import { Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
  orange: "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800",
  pink: "bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800",
  purple: "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
  blue: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  green: "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
  white: "bg-white dark:bg-neutral-800 border-border",
  black: "bg-neutral-900 dark:bg-neutral-950 border-neutral-700 text-neutral-100",
};

interface StickyNote {
  id: string;
  content: string;
  color: string;
  isPinned: boolean;
  tags: { id: string; name: string }[];
}

interface StickyNoteCardProps {
  note: StickyNote;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
}

export function StickyNoteCard({ note, onEdit, onDelete, onPin }: StickyNoteCardProps) {
  return (
    <div className={cn("group relative rounded-xl border p-4 transition-shadow hover:shadow-md", colorMap[note.color] ?? colorMap.yellow)}>
      {note.isPinned && (
        <div className="absolute -top-1.5 left-3 text-xs font-medium text-muted-foreground bg-background border border-border rounded-full px-2 py-0.5">
          📌 pinned
        </div>
      )}

      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed mt-2">{note.content}</p>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.map((tag) => (
            <span key={tag.id} className="text-xs opacity-60">#{tag.name}</span>
          ))}
        </div>
      )}

      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={onPin} className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          {note.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-red-500/20 text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
