"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useKeyboardShortcuts();

  useEffect(() => {
    function handleOpen() {
      setPaletteOpen(true);
    }
    document.addEventListener("open-command-palette", handleOpen);
    return () => document.removeEventListener("open-command-palette", handleOpen);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar className="hidden md:flex" />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 h-full">
            <Sidebar onNavClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
