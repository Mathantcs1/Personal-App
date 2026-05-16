"use client";

import { useState, useEffect } from "react";
import { Plus, Star, StarOff, Trash2, ExternalLink, BookMarked } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/shared/TagInput";

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  favicon?: string;
  isFavorite: boolean;
  tags: { id: string; name: string }[];
  createdAt: string;
}

export function BookmarksClient() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<{ name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/bookmarks");
    if (res.ok) setBookmarks(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!url.trim()) return;
    setSaving(true);
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url.trim(), tags: tags.map((t) => t.name) }),
    });
    if (res.ok) { toast.success("Bookmark added"); load(); setDialogOpen(false); setUrl(""); setTags([]); }
    else toast.error("Failed to add bookmark");
    setSaving(false);
  }

  async function handleToggleFavorite(b: Bookmark) {
    await fetch(`/api/bookmarks/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !b.isFavorite }),
    });
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    toast.success("Bookmark deleted");
    setBookmarks((p) => p.filter((b) => b.id !== id));
  }

  if (loading) return <div className="animate-pulse text-muted-foreground text-sm">Loading bookmarks...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Bookmarks</h1>
        <Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4" /> Add Bookmark</Button>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState icon={BookMarked} title="No bookmarks" description="Save links with auto-fetched titles, descriptions, and previews."
          action={<Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4" /> Add bookmark</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bookmarks.map((b) => (
            <div key={b.id} className="group rounded-xl border bg-card overflow-hidden hover:border-primary/30 hover:shadow-md transition-all">
              {b.imageUrl && (
                <div className="h-36 overflow-hidden bg-muted">
                  <img src={b.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-1">
                  {b.favicon && <img src={b.favicon} alt="" className="w-4 h-4 mt-0.5 shrink-0" />}
                  <h3 className="font-semibold text-sm leading-tight flex-1 line-clamp-2">{b.title}</h3>
                </div>
                {b.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{b.description}</p>}
                <p className="text-xs text-muted-foreground truncate mb-3">{new URL(b.url).hostname}</p>
                {b.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {b.tags.map((tag) => <span key={tag.id} className="text-xs text-primary/70">#{tag.name}</span>)}
                  </div>
                )}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={b.url} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1 rounded hover:bg-accent transition-colors">
                    <ExternalLink className="w-3 h-3" /> Open
                  </a>
                  <button onClick={() => handleToggleFavorite(b)} className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-yellow-500">
                    {b.isFavorite ? <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Bookmark</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()} autoFocus />
            </div>
            <div>
              <Label>Tags</Label>
              <TagInput tags={tags} onChange={setTags} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!url.trim() || saving}>{saving ? "Fetching..." : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
