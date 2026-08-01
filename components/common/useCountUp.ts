import { useEffect, useRef, useState } from "react";

/**
 * target が変わるたびに前の値から滑らかにカウントアップ（easeOutCubic）する共有フック。
 * モーション削減設定時は duration=0 として即座に確定値へ。
 */
export function useCountUp(target: number, duration = 450): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveDuration = reduced ? 0 : duration;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t =
        effectiveDuration <= 0
          ? 1
          : Math.min(1, (now - start) / effectiveDuration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
