"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/shared/TagInput";
import { MicButton } from "@/components/shared/MicButton";
import type { Task, TaskStatus, Priority } from "./KanbanBoard";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Task;
  onSave: (data: {
    title: string; description?: string; status: TaskStatus;
    priority: Priority; dueDate?: string; tags: string[];
  }) => Promise<void>;
}

export function TaskDialog({ open, onOpenChange, initialData, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<{ name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? "");
      setDescription(initialData?.description ?? "");
      setStatus(initialData?.status ?? "TODO");
      setPriority(initialData?.priority ?? "MEDIUM");
      setDueDate(initialData?.dueDate ? initialData.dueDate.split("T")[0] : "");
      setTags(initialData?.tags.map((t) => ({ name: t.name })) ?? []);
    }
  }, [open, initialData]);

  async function handleSubmit() {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      title: title.trim(),
      description: description || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
      tags: tags.map((t) => t.name),
    });
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <MicButton onTranscript={(t) => setTitle((prev) => prev + t)} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
              className="mt-1 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Due Date</Label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <Label>Tags</Label>
            <TagInput tags={tags} onChange={setTags} className="mt-1" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
