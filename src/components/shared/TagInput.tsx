"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tag {
  id?: string;
  name: string;
  color?: string;
}

interface TagInputProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
  suggestions?: Tag[];
  placeholder?: string;
  className?: string;
}

export function TagInput({ tags, onChange, suggestions = [], placeholder = "Add tag...", className }: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = suggestions.filter(
    (s) =>
      s.name.toLowerCase().includes(input.toLowerCase()) &&
      !tags.some((t) => t.name === s.name)
  );

  function addTag(tag: Tag) {
    if (!tags.some((t) => t.name === tag.name)) {
      onChange([...tags, tag]);
    }
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function removeTag(name: string) {
    onChange(tags.filter((t) => t.name !== name));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const name = input.trim().toLowerCase().replace(/,/g, "");
      addTag({ name });
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1].name);
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="flex flex-wrap gap-1.5 min-h-9 px-3 py-1.5 rounded-md border border-input bg-transparent cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag.name}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            #{tag.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag.name); }}
              className="hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-40 overflow-y-auto rounded-md border bg-popover shadow-md">
          {filtered.map((s) => (
            <button
              key={s.name}
              type="button"
              onMouseDown={() => addTag(s)}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors"
            >
              #{s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
