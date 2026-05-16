import { useEffect, useRef } from "react";

export function useAutoSave<T>(
  value: T,
  onSave: (value: T) => Promise<void>,
  delay = 1000
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { onSave(value); }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [value, delay]); // eslint-disable-line react-hooks/exhaustive-deps
}
