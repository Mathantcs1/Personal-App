"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Brain, Star } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MicButton } from "@/components/shared/MicButton";
import { cn } from "@/lib/utils";

interface AIMemory {
  id: string;
  content: string;
  category: string;
  importance: number;
  source?: string;
  tags: { id: string; name: string }[];
}

interface ChatMessage { role: "user" | "assistant"; content: string }

const CATEGORIES = ["PERSONAL","WORK","HEALTH","LEARNING","RELATIONSHIPS","GENERAL"];
const categoryColor: Record<string, string> = {
  PERSONAL: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  WORK: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  HEALTH: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  LEARNING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  RELATIONSHIPS: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  GENERAL: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
};

export function AIMemoryClient() {
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMemory, setEditMemory] = useState<AIMemory | null>(null);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [importance, setImportance] = useState("3");
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/ai-memory");
    if (res.ok) setMemories(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function openEdit(m: AIMemory) {
    setEditMemory(m); setContent(m.content); setCategory(m.category); setImportance(String(m.importance));
    setDialogOpen(true);
  }

  function openNew() {
    setEditMemory(null); setContent(""); setCategory("GENERAL"); setImportance("3");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    const url = editMemory ? `/api/ai-memory/${editMemory.id}` : "/api/ai-memory";
    const method = editMemory ? "PATCH" : "POST";
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, category, importance: parseInt(importance) }),
    });
    if (res.ok) { toast.success(editMemory ? "Memory updated" : "Memory added"); load(); }
    setSaving(false); setDialogOpen(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/ai-memory/${id}`, { method: "DELETE" });
    toast.success("Memory deleted");
    setMemories((p) => p.filter((m) => m.id !== id));
  }

  async function sendChat() {
    if (!chatInput.trim() || streaming) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((p) => [...p, { role: "user", content: userMsg }]);
    setStreaming(true);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg, history: messages }),
    });

    if (!res.ok || !res.body) { setStreaming(false); return; }

    setMessages((p) => [...p, { role: "assistant", content: "" }]);
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
          try {
            const { text } = JSON.parse(data);
            setMessages((p) => {
              const last = p[p.length - 1];
              return [...p.slice(0, -1), { ...last, content: last.content + text }];
            });
          } catch { /* skip */ }
        }
      }
    }
    setStreaming(false);
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = memories.filter((m) => m.category === cat);
    return acc;
  }, {} as Record<string, AIMemory[]>);

  if (loading) return <div className="animate-pulse text-muted-foreground text-sm">Loading memories...</div>;

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">AI Memory</h1>
          <Button onClick={openNew}><Plus className="w-4 h-4" /> Add Memory</Button>
        </div>

        {memories.length === 0 ? (
          <EmptyState icon={Brain} title="No memories yet" description="Add facts about yourself that Claude should remember."
            action={<Button onClick={openNew}><Plus className="w-4 h-4" /> Add memory</Button>} />
        ) : (
          <div className="space-y-6">
            {CATEGORIES.filter((c) => grouped[c].length > 0).map((cat) => (
              <div key={cat}>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</h2>
                <div className="space-y-2">
                  {grouped[cat].map((m) => (
                    <div key={m.id} className="group flex items-start gap-3 p-3 rounded-lg border bg-card hover:border-primary/20 transition-colors">
                      <span className={cn("text-xs font-medium px-2 py-1 rounded-full shrink-0", categoryColor[m.category])}>{m.category}</span>
                      <p className="flex-1 text-sm">{m.content}</p>
                      <div className="flex items-center gap-1 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < m.importance ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
                        ))}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => openEdit(m)} className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-1 rounded hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-80 shrink-0 flex flex-col rounded-xl border bg-card">
        <div className="px-4 py-3 border-b font-medium text-sm flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" /> Ask Claude
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-xs text-muted-foreground text-center pt-4">Claude knows your memories. Ask anything.</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={cn("text-sm rounded-lg px-3 py-2 max-w-full", msg.role === "user" ? "bg-primary text-primary-foreground ml-4" : "bg-muted mr-4")}>
              {msg.content}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t flex gap-2">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
            placeholder="Ask anything..."
            disabled={streaming}
          />
          <MicButton onTranscript={(t) => setChatInput((p) => p + t)} />
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editMemory ? "Edit Memory" : "Add Memory"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Memory</Label>
              <div className="flex gap-2 mt-1">
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="e.g. Prefers dark mode, lactose intolerant..." rows={3}
                  className="flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                <MicButton onTranscript={(t) => setContent((p) => p + t)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Importance (1–5)</Label>
                <Select value={importance} onValueChange={setImportance}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{[1,2,3,4,5].map((n) => <SelectItem key={n} value={String(n)}>{n} star{n !== 1 ? "s" : ""}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!content.trim() || saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
