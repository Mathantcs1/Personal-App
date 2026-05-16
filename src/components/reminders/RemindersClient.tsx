"use client";

import { useState, useEffect } from "react";
import { Plus, Bell, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ReminderDialog } from "./ReminderDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueAt: string;
  priority: string;
  isCompleted: boolean;
  leadTimeMinutes?: number;
  smsEnabled: boolean;
  tags: { id: string; name: string }[];
}

const priorityColor: Record<string, string> = {
  LOW: "text-green-500", MEDIUM: "text-yellow-500", HIGH: "text-orange-500", URGENT: "text-red-500",
};

export function RemindersClient() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editReminder, setEditReminder] = useState<Reminder | null>(null);

  async function load() {
    const res = await fetch("/api/reminders");
    if (res.ok) setReminders(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: object) {
    const url = editReminder ? `/api/reminders/${editReminder.id}` : "/api/reminders";
    const method = editReminder ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { toast.success(editReminder ? "Reminder updated" : "Reminder created"); load(); }
    setDialogOpen(false);
    setEditReminder(null);
  }

  async function handleToggle(reminder: Reminder) {
    const res = await fetch(`/api/reminders/${reminder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !reminder.isCompleted }),
    });
    if (res.ok) load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/reminders/${id}`, { method: "DELETE" });
    toast.success("Reminder deleted");
    setReminders((p) => p.filter((r) => r.id !== id));
  }

  const upcoming = reminders.filter((r) => !r.isCompleted);
  const completed = reminders.filter((r) => r.isCompleted);

  if (loading) return <div className="animate-pulse text-muted-foreground text-sm">Loading reminders...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
        <Button onClick={() => { setEditReminder(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> New Reminder
        </Button>
      </div>

      {reminders.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No reminders"
          description="Stay on top of important dates and tasks."
          action={<Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4" /> Create reminder</Button>}
        />
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-2">
                {upcoming.map((r) => (
                  <ReminderRow
                    key={r.id}
                    reminder={r}
                    onToggle={() => handleToggle(r)}
                    onEdit={() => { setEditReminder(r); setDialogOpen(true); }}
                    onDelete={() => handleDelete(r.id)}
                  />
                ))}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Completed ({completed.length})
              </h2>
              <div className="space-y-2 opacity-60">
                {completed.map((r) => (
                  <ReminderRow
                    key={r.id}
                    reminder={r}
                    onToggle={() => handleToggle(r)}
                    onEdit={() => { setEditReminder(r); setDialogOpen(true); }}
                    onDelete={() => handleDelete(r.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ReminderDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditReminder(null); }}
        initialData={editReminder ?? undefined}
        onSave={handleSave}
      />
    </div>
  );
}

function ReminderRow({
  reminder, onToggle, onEdit, onDelete,
}: {
  reminder: Reminder;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isOverdue = !reminder.isCompleted && new Date(reminder.dueAt) < new Date();

  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-primary/20 transition-colors">
      <button onClick={onToggle} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
        {reminder.isCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", reminder.isCompleted && "line-through text-muted-foreground")}>
          {reminder.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn("text-xs", isOverdue ? "text-red-500 font-medium" : "text-muted-foreground")}>
            {isOverdue ? "Overdue · " : ""}{format(new Date(reminder.dueAt), "MMM d, yyyy 'at' h:mm a")}
          </span>
          {reminder.leadTimeMinutes && (
            <span className="text-xs text-muted-foreground">· {reminder.leadTimeMinutes}min warning</span>
          )}
          {reminder.smsEnabled && <span className="text-xs text-blue-500">· SMS</span>}
          <span className={cn("text-xs font-medium", priorityColor[reminder.priority])}>{reminder.priority}</span>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-accent transition-colors">Edit</button>
        <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
      </div>
    </div>
  );
}
