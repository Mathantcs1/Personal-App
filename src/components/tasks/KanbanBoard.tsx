"use client";

import { useState, useEffect } from "react";
import { Plus, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { TaskDialog } from "./TaskDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  position: number;
  tags: { id: string; name: string }[];
  project?: { id: string; name: string; color: string } | null;
}

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO", label: "To Do", color: "text-slate-500" },
  { status: "IN_PROGRESS", label: "In Progress", color: "text-blue-500" },
  { status: "BLOCKED", label: "Blocked", color: "text-red-500" },
  { status: "DONE", label: "Done", color: "text-green-500" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("TODO");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  async function load() {
    const res = await fetch("/api/tasks");
    if (res.ok) setTasks(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: {
    title: string; description?: string; status: TaskStatus; priority: Priority;
    dueDate?: string; tags: string[];
  }) {
    const url = editTask ? `/api/tasks/${editTask.id}` : "/api/tasks";
    const method = editTask ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTask ? data : { ...data, status: defaultStatus }),
    });
    if (res.ok) {
      toast.success(editTask ? "Task updated" : "Task created");
      load();
    }
    setDialogOpen(false);
    setEditTask(null);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Task deleted"); setTasks((p) => p.filter((t) => t.id !== id)); }
  }

  async function handleStatusChange(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const targetStatus = over.id as TaskStatus;
    if (COLUMNS.some((c) => c.status === targetStatus)) {
      await handleStatusChange(active.id as string, targetStatus);
    }
  }

  const totalTasks = tasks.filter((t) => t.status !== "CANCELLED").length;

  if (loading) return <div className="animate-pulse text-muted-foreground text-sm">Loading tasks...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground">{totalTasks} active task{totalTasks !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { setEditTask(null); setDefaultStatus("TODO"); setDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      {totalTasks === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Track your work with a Kanban board."
          action={<Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4" /> Create task</Button>}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.status}
                status={col.status}
                label={col.label}
                color={col.color}
                tasks={tasks.filter((t) => t.status === col.status)}
                onEdit={(task) => { setEditTask(task); setDialogOpen(true); }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onAddTask={() => { setEditTask(null); setDefaultStatus(col.status); setDialogOpen(true); }}
              />
            ))}
          </div>
        </DndContext>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditTask(null); }}
        initialData={editTask ?? undefined}
        onSave={handleSave}
      />
    </div>
  );
}
