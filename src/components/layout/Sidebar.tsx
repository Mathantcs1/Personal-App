"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Pin, Bell, CheckSquare, Briefcase,
  Calendar, BookOpen, BookMarked, Code2, Scissors,
  ShoppingCart, Brain, Search, Sun, Moon, LogOut, Cpu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const navSections = [
  {
    label: "QUICK ACCESS",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Pin, label: "Sticky Notes", href: "/sticky-notes" },
      { icon: Bell, label: "Reminders", href: "/reminders" },
      { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { icon: Briefcase, label: "Work Notes", href: "/work-notes" },
      { icon: Calendar, label: "Meetings", href: "/meetings" },
      { icon: BookOpen, label: "Personal Notes", href: "/personal-notes" },
      { icon: BookMarked, label: "Journal", href: "/journal" },
    ],
  },
  {
    label: "REFERENCE",
    items: [
      { icon: BookMarked, label: "Bookmarks", href: "/bookmarks" },
      { icon: Code2, label: "Dev Notes", href: "/dev-notes" },
      { icon: Scissors, label: "Snippets", href: "/snippets" },
      { icon: ShoppingCart, label: "Grocery", href: "/grocery" },
    ],
  },
  {
    label: "AI",
    items: [
      { icon: Brain, label: "AI Memory", href: "/ai-memory" },
      { icon: Search, label: "Search", href: "/search" },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onNavClick?: () => void;
}

export function Sidebar({ className, onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className={cn("w-56 h-full bg-sidebar flex flex-col shrink-0 border-r border-sidebar-border", className)}>
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Cpu className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-sidebar-foreground font-semibold text-sm">Personal OS</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-1 text-xs font-semibold text-sidebar-foreground/40 tracking-wider">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-sidebar-border space-y-0.5">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground w-full transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
