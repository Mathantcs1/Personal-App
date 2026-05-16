"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, Calendar, GripVertical } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Task, TaskStatus, Priority } from "./KanbanBoard";

const priorityDot: Record<Priority, string> = {
  LOW: "bg-green-400",
  MEDIUM: "bg-yellow-400",
  HIGH: "bg-orange-400",
  URGENT: "bg-red-500",
};

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "DONE", label: "Done" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-background border border-border rounded-lg p-3 shadow-sm transition-shadow",
        isDragging && "shadow-lg opacity-70",
        task.status === "DONE" && "opacity-60"
      )}
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={cn("w-2 h-2 rounded-full shrink-0", priorityDot[task.priority])} />
            <p className={cn("text-sm font-medium leading-tight", task.status === "DONE" && "line-through text-muted-foreground")}>
              {task.title}
            </p>
          </div>

          {task.dueDate && (
            <div className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-red-500" : "text-muted-foreground")}>
              <Calendar className="w-3 h-3" />
              {formatRelativeTime(task.dueDate)}
            </div>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span key={tag.id} className="text-xs text-primary/70">#{tag.name}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground">
          <Pencil className="w-3 h-3" />
        </button>
        <button onClick={onDelete} className="p-1 rounded hover:bg-red-500/10 text-red-500 transition-colors">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
