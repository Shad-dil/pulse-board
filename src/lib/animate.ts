// src/lib/animate.tsx
import { useEffect, useRef, useState } from "react";

export function useAnimatedNumber(target: number, duration = 600) {
  const [value, setValue] = useState<number>(target);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isNaN(target)) {
      setValue(0);
      return;
    }
    cancelAnimationFrame(rafRef.current ?? 0);
    fromRef.current = value;
    startRef.current = null;

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const next =
        fromRef.current + (target - fromRef.current) * easeOutCubic(progress);
      setValue(Number(next.toFixed(2)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
