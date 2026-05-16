"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopBar() {
  const router = useRouter();

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur flex items-center px-6 gap-4 shrink-0">
      <button
        onClick={() => router.push("/search")}
        className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 rounded-lg border border-input bg-muted/50 text-muted-foreground text-sm hover:bg-muted transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search everything...</span>
        <kbd className="ml-auto text-xs bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
      </button>
    </header>
  );
}
