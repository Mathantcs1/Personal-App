"use client";

import { useEffect } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  LayoutDashboard, Pin, Bell, CheckSquare, Briefcase,
  Calendar, BookOpen, BookMarked, Code2, Scissors,
  ShoppingCart, Brain, Search, Plus,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", shortcut: "⌘1" },
  { icon: Pin, label: "Sticky Notes", href: "/sticky-notes", shortcut: "⌘2" },
  { icon: Bell, label: "Reminders", href: "/reminders", shortcut: "⌘3" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks", shortcut: "⌘4" },
  { icon: Briefcase, label: "Work Notes", href: "/work-notes" },
  { icon: Calendar, label: "Meetings", href: "/meetings" },
  { icon: BookOpen, label: "Personal Notes", href: "/personal-notes" },
  { icon: BookMarked, label: "Journal", href: "/journal" },
  { icon: BookMarked, label: "Bookmarks", href: "/bookmarks" },
  { icon: Code2, label: "Developer Notes", href: "/dev-notes" },
  { icon: Scissors, label: "Snippets", href: "/snippets" },
  { icon: ShoppingCart, label: "Grocery Lists", href: "/grocery" },
  { icon: Brain, label: "AI Memory", href: "/ai-memory" },
  { icon: Search, label: "Search", href: "/search" },
];

function getTodaySlug() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const quickCreateItems = [
  { icon: Pin, label: "New Sticky Note", href: "/sticky-notes?new=1" },
  { icon: CheckSquare, label: "New Task", href: "/tasks?new=1" },
  { icon: Bell, label: "New Reminder", href: "/reminders?new=1" },
  { icon: BookMarked, label: "New Journal Entry", href: () => `/journal/${getTodaySlug()}` },
  { icon: BookMarked, label: "New Bookmark", href: "/bookmarks?new=1" },
  { icon: Scissors, label: "New Snippet", href: "/snippets?new=1" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  function navigate(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-1">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation">
              {navItems.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="ml-auto text-xs tracking-widest text-muted-foreground">
                      {item.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="mx-1 my-1 h-px bg-border" />

            <Command.Group heading="Quick Create">
              {quickCreateItems.map((item) => {
                const href = typeof item.href === "function" ? item.href() : item.href;
                return (
                  <Command.Item
                    key={item.label}
                    value={item.label}
                    onSelect={() => navigate(href)}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
