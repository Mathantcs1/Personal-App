"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/shared/TagInput";
import { MicButton } from "@/components/shared/MicButton";

const LANGUAGES = ["plaintext","javascript","typescript","python","rust","go","java","css","html","sql","bash","json","yaml","markdown"];

interface SnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id: string; title: string; code: string; language: string; description?: string; tags: { name: string }[] };
  onSave: (data: object) => Promise<void>;
}

export function SnippetDialog({ open, onOpenChange, initialData, onSave }: SnippetDialogProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<{ name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? "");
      setCode(initialData?.code ?? "");
      setLanguage(initialData?.language ?? "plaintext");
      setDescription(initialData?.description ?? "");
      setTags(initialData?.tags ?? []);
    }
  }, [open, initialData]);

  async function handleSubmit() {
    if (!title.trim() || !code.trim()) return;
    setSaving(true);
    await onSave({ title, code, language, description: description || undefined, tags: tags.map((t) => t.name) });
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{initialData ? "Edit Snippet" : "New Snippet"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Title</Label>
              <div className="flex gap-1 mt-1">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Snippet name" />
                <MicButton onTranscript={(t) => setTitle((p) => p + t)} />
              </div>
            </div>
            <div>
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="mt-1" />
          </div>
          <div>
            <Label>Code</Label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste or type your code..."
              rows={12}
              className="mt-1 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <Label>Tags</Label>
            <TagInput tags={tags} onChange={setTags} className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !code.trim() || saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
