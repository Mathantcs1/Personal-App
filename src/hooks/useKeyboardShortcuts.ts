"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      switch (e.key) {
        case "k":
          e.preventDefault();
          document.dispatchEvent(new CustomEvent("open-command-palette"));
          break;
        case "1":
          e.preventDefault();
          router.push("/dashboard");
          break;
        case "2":
          e.preventDefault();
          router.push("/sticky-notes");
          break;
        case "3":
          e.preventDefault();
          router.push("/reminders");
          break;
        case "4":
          e.preventDefault();
          router.push("/tasks");
          break;
        case "n":
          e.preventDefault();
          document.dispatchEvent(new CustomEvent("new-item"));
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);
}
