"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * 子要素を「ビューポート付近に入ってから」マウントする遅延マウント。
 * 重いクライアント描画（Recharts 等）を初期ハイドレーションから外し、
 * 初期の Script Evaluation / TBT を削減する。
 *
 * 可視前は placeholderClassName のプレースホルダ（同じ高さ）を描画するため CLS を起こさない。
 * SSR と初回クライアント描画はともに未マウント（プレースホルダ）で一致する。
 */
export function LazyMount({
  children,
  placeholderClassName,
  rootMargin = "300px",
}: {
  children: ReactNode;
  /** プレースホルダの見た目（チャートのスケルトンと同じ高さにする） */
  placeholderClassName: string;
  /** どれだけ手前で先読みするか */
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref}>
      {visible ? children : <div className={placeholderClassName} />}
    </div>
  );
}
