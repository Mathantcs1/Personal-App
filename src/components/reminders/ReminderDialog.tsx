"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TagInput } from "@/components/shared/TagInput";
import { MicButton } from "@/components/shared/MicButton";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id: string; title: string; description?: string; dueAt: string; priority: string;
    leadTimeMinutes?: number; smsEnabled: boolean; tags: { name: string }[];
  };
  onSave: (data: object) => Promise<void>;
}

export function ReminderDialog({ open, onOpenChange, initialData, onSave }: ReminderDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [leadTime, setLeadTime] = useState<string>("none");
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [tags, setTags] = useState<{ name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? "");
      setDescription(initialData?.description ?? "");
      setDueAt(initialData?.dueAt ? format(new Date(initialData.dueAt), "yyyy-MM-dd'T'HH:mm") : "");
      setPriority(initialData?.priority ?? "MEDIUM");
      setLeadTime(initialData?.leadTimeMinutes?.toString() ?? "none");
      setSmsEnabled(initialData?.smsEnabled ?? false);
      setTags(initialData?.tags ?? []);
    }
  }, [open, initialData]);

  async function handleSubmit() {
    if (!title.trim() || !dueAt) return;
    setSaving(true);
    await onSave({
      title: title.trim(),
      description: description || undefined,
      dueAt,
      priority,
      leadTimeMinutes: leadTime !== "none" ? parseInt(leadTime) : null,
      smsEnabled,
      tags: tags.map((t) => t.name),
    });
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Reminder" : "New Reminder"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <div className="flex gap-2 mt-1">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reminder title" />
              <MicButton onTranscript={(t) => setTitle((p) => p + t)} />
            </div>
          </div>

          <div>
            <Label>Due</Label>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Early Warning</Label>
              <Select value={leadTime} onValueChange={setLeadTime}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>SMS notification</Label>
              <p className="text-xs text-muted-foreground">Send SMS when reminder fires</p>
            </div>
            <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
          </div>

          <div>
            <Label>Tags</Label>
            <TagInput tags={tags} onChange={setTags} className="mt-1" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !dueAt || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
