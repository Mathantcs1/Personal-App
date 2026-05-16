"use client";

import { useState, useEffect } from "react";
import { Plus, Pin } from "lucide-react";
import { toast } from "sonner";
import Masonry from "react-masonry-css";
import { StickyNoteCard } from "./StickyNoteCard";
import { StickyNoteDialog } from "./StickyNoteDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

interface StickyNote {
  id: string;
  content: string;
  color: string;
  isPinned: boolean;
  tags: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

const breakpointCols = { default: 4, 1400: 3, 1100: 2, 700: 1 };

export function StickyNotesClient() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<StickyNote | null>(null);

  async function load() {
    const res = await fetch("/api/sticky-notes");
    if (res.ok) setNotes(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: { content: string; color: string; isPinned: boolean; tags: string[] }) {
    if (editNote) {
      const res = await fetch(`/api/sticky-notes/${editNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { toast.success("Note updated"); load(); }
    } else {
      const res = await fetch("/api/sticky-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { toast.success("Note created"); load(); }
    }
    setDialogOpen(false);
    setEditNote(null);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/sticky-notes/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Note deleted"); setNotes((prev) => prev.filter((n) => n.id !== id)); }
  }

  async function handlePin(note: StickyNote) {
    const res = await fetch(`/api/sticky-notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !note.isPinned }),
    });
    if (res.ok) load();
  }

  function openEdit(note: StickyNote) {
    setEditNote(note);
    setDialogOpen(true);
  }

  if (loading) return <div className="animate-pulse text-muted-foreground text-sm">Loading notes...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Sticky Notes</h1>
        <Button onClick={() => { setEditNote(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> New Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon={Pin}
          title="No sticky notes yet"
          description="Capture quick thoughts, ideas, and reminders."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4" /> Create your first note
            </Button>
          }
        />
      ) : (
        <Masonry breakpointCols={breakpointCols} className="flex -ml-4 w-auto" columnClassName="pl-4 bg-clip-padding">
          {notes.map((note) => (
            <div key={note.id} className="mb-4">
              <StickyNoteCard
                note={note}
                onEdit={() => openEdit(note)}
                onDelete={() => handleDelete(note.id)}
                onPin={() => handlePin(note)}
              />
            </div>
          ))}
        </Masonry>
      )}

      <StickyNoteDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditNote(null); }}
        initialData={editNote ? { content: editNote.content, color: editNote.color, isPinned: editNote.isPinned, tags: editNote.tags.map((t) => t.name) } : undefined}
        onSave={handleSave}
      />
    </div>
  );
}
