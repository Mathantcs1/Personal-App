"use client";

import { useEffect, useRef } from "react";

export function useAIAutoTag(
  content: string,
  onTags: (tags: string[]) => void,
  delay = 2000
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevContent = useRef("");

  useEffect(() => {
    if (content === prevContent.current || content.length < 50) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      prevContent.current = content;
      try {
        const res = await fetch("/api/ai/auto-tag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (res.ok) {
          const { tags } = await res.json();
          if (tags?.length) onTags(tags);
        }
      } catch { /* ignore */ }
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [content, delay]); // eslint-disable-line react-hooks/exhaustive-deps
}
