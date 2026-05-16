"use client";

import { useState, useEffect } from "react";
import { Plus, Copy, Star, Trash2, Pencil, Scissors } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { SnippetDialog } from "./SnippetDialog";
import { cn } from "@/lib/utils";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  isFavorite: boolean;
  tags: { id: string; name: string }[];
}

export function SnippetsClient() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSnippet, setEditSnippet] = useState<Snippet | null>(null);

  async function load() {
    const res = await fetch("/api/snippets");
    if (res.ok) setSnippets(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: object) {
    const url = editSnippet ? `/api/snippets/${editSnippet.id}` : "/api/snippets";
    const method = editSnippet ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { toast.success(editSnippet ? "Snippet updated" : "Snippet saved"); load(); }
    setDialogOpen(false); setEditSnippet(null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    toast.success("Snippet deleted");
    setSnippets((p) => p.filter((s) => s.id !== id));
  }

  async function handleToggleFavorite(s: Snippet) {
    await fetch(`/api/snippets/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isFavorite: !s.isFavorite }) });
    load();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  }

  if (loading) return <div className="animate-pulse text-muted-foreground text-sm">Loading snippets...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Snippets</h1>
        <Button onClick={() => { setEditSnippet(null); setDialogOpen(true); }}><Plus className="w-4 h-4" /> New Snippet</Button>
      </div>

      {snippets.length === 0 ? (
        <EmptyState icon={Scissors} title="No snippets" description="Store reusable code snippets with syntax highlighting."
          action={<Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4" /> Add snippet</Button>} />
      ) : (
        <div className="space-y-4">
          {snippets.map((s) => (
            <div key={s.id} className="group rounded-xl border bg-card overflow-hidden hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground bg-background border rounded px-1.5 py-0.5">{s.language}</span>
                  <span className="font-medium text-sm">{s.title}</span>
                  {s.isFavorite && <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => copyCode(s.code)} className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground" title="Copy">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleToggleFavorite(s)} className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-yellow-500">
                    {s.isFavorite ? <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> : <Star className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => { setEditSnippet(s); setDialogOpen(true); }} className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {s.description && <p className="px-4 py-2 text-xs text-muted-foreground border-b">{s.description}</p>}
              <pre className="px-4 py-3 text-xs overflow-x-auto font-mono leading-relaxed max-h-64">
                <code>{s.code}</code>
              </pre>
              {s.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 px-4 py-2 border-t">
                  {s.tags.map((tag) => <span key={tag.id} className="text-xs text-primary/70">#{tag.name}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <SnippetDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditSnippet(null); }}
        initialData={editSnippet ?? undefined}
        onSave={handleSave}
      />
    </div>
  );
}
