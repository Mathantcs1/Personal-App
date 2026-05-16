"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MicButton } from "@/components/shared/MicButton";
import { cn } from "@/lib/utils";

interface GroceryItem { id: string; name: string; quantity?: string; isChecked: boolean; position: number }
interface GroceryList { id: string; name: string; items: GroceryItem[]; shareToken?: string }

export function GroceryClient() {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<GroceryList | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [addingList, setAddingList] = useState(false);

  async function load() {
    const res = await fetch("/api/grocery");
    if (res.ok) {
      const data = await res.json();
      setLists(data);
      if (data.length > 0 && !selectedList) setSelectedList(data[0]);
      else if (selectedList) setSelectedList(data.find((l: GroceryList) => l.id === selectedList.id) ?? data[0]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function createList() {
    if (!newListName.trim()) return;
    const res = await fetch("/api/grocery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newListName.trim() }),
    });
    if (res.ok) { setNewListName(""); setAddingList(false); load(); }
  }

  async function addItem() {
    if (!newItemName.trim() || !selectedList) return;
    const res = await fetch(`/api/grocery/${selectedList.id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItemName.trim() }),
    });
    if (res.ok) { setNewItemName(""); load(); }
  }

  async function toggleItem(item: GroceryItem) {
    if (!selectedList) return;
    await fetch(`/api/grocery/${selectedList.id}/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isChecked: !item.isChecked }),
    });
    load();
  }

  async function deleteItem(itemId: string) {
    if (!selectedList) return;
    await fetch(`/api/grocery/${selectedList.id}/items/${itemId}`, { method: "DELETE" });
    load();
  }

  async function deleteList(listId: string) {
    await fetch(`/api/grocery/${listId}`, { method: "DELETE" });
    toast.success("List deleted");
    setSelectedList(null);
    load();
  }

  if (loading) return <div className="animate-pulse text-muted-foreground text-sm">Loading grocery lists...</div>;

  const unchecked = selectedList?.items.filter((i) => !i.isChecked) ?? [];
  const checked = selectedList?.items.filter((i) => i.isChecked) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Grocery Lists</h1>
        <Button onClick={() => setAddingList(true)}><Plus className="w-4 h-4" /> New List</Button>
      </div>

      {addingList && (
        <div className="flex gap-2 mb-4">
          <Input value={newListName} onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createList()} placeholder="List name" autoFocus />
          <Button onClick={createList}>Create</Button>
          <Button variant="outline" onClick={() => setAddingList(false)}>Cancel</Button>
        </div>
      )}

      {lists.length === 0 && !addingList ? (
        <EmptyState icon={ShoppingCart} title="No grocery lists" description="Create lists and check off items as you shop."
          action={<Button onClick={() => setAddingList(true)}><Plus className="w-4 h-4" /> Create list</Button>} />
      ) : (
        <div className="flex gap-6">
          <div className="w-48 shrink-0 space-y-1">
            {lists.map((list) => (
              <button key={list.id} onClick={() => setSelectedList(list)}
                className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  selectedList?.id === list.id ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground")}>
                {list.name}
                <span className="ml-1 text-xs opacity-60">({list.items.length})</span>
              </button>
            ))}
          </div>

          {selectedList && (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{selectedList.name}</h2>
                <div className="flex gap-2">
                  {selectedList.shareToken && (
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/grocery/share/${selectedList.shareToken}`); toast.success("Share link copied"); }}>
                      Share Link
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteList(selectedList.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()} placeholder="Add item..." />
                <MicButton onTranscript={(t) => { setNewItemName(t.trim()); }} />
                <Button onClick={addItem}><Plus className="w-4 h-4" /></Button>
              </div>

              <div className="space-y-1">
                {unchecked.map((item) => (
                  <div key={item.id} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <button onClick={() => toggleItem(item)} className="w-5 h-5 rounded border-2 border-muted-foreground flex items-center justify-center hover:border-primary transition-colors shrink-0" />
                    <span className="flex-1 text-sm">{item.name}</span>
                    <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-red-500 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {checked.length > 0 && (
                  <>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider px-2 py-2 mt-2">Checked off</p>
                    {checked.map((item) => (
                      <div key={item.id} className="group flex items-center gap-3 p-2 rounded-lg opacity-50 hover:opacity-70 transition-opacity">
                        <button onClick={() => toggleItem(item)} className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </button>
                        <span className="flex-1 text-sm line-through">{item.name}</span>
                        <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-red-500 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
