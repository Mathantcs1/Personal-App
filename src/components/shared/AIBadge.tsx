"use client";

import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIBadgeProps {
  tags: string[];
  onAccept: (tag: string) => void;
  onDismiss: () => void;
  className?: string;
}

export function AIBadge({ tags, onAccept, onDismiss, className }: AIBadgeProps) {
  if (!tags.length) return null;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3 text-primary" /> AI suggests:
      </span>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onAccept(tag)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          +#{tag}
        </button>
      ))}
      <button type="button" onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
