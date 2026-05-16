import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatRelativeTime } from "@/lib/utils";
import { Code2, Pin, Plus } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default async function DevNotesPage() {
  await requireAuth();
  const notes = await prisma.devNote.findMany({
    include: { tags: true },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Developer Notes</h1>
        <Button asChild><Link href="/dev-notes/new"><Plus className="w-4 h-4" /> New Note</Link></Button>
      </div>
      {notes.length === 0 ? (
        <EmptyState icon={Code2} title="No developer notes" description="Track technical decisions, architecture notes, and dev references."
          action={<Button asChild><Link href="/dev-notes/new"><Plus className="w-4 h-4" /> Create note</Link></Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Link key={note.id} href={`/dev-notes/${note.id}`}
              className="block rounded-xl border bg-card hover:border-primary/30 hover:shadow-md transition-all p-4 group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{note.title}</h3>
                {note.isPinned && <Pin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mb-3">{formatRelativeTime(note.updatedAt)}</p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => <span key={tag.id} className="text-xs text-primary/70">#{tag.name}</span>)}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
