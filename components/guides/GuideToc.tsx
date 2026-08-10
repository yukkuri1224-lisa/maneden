"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

/**
 * 記事の目次。デスクトップは追従（sticky）＋スクロールで現在地をハイライト、
 * モバイルは折りたたみ（details）で表示する。
 */
export function GuideToc({
  items,
  variant = "sticky",
}: {
  items: TocItem[];
  variant?: "sticky" | "inline";
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (variant === "inline") {
    return (
      <details className="mb-10 rounded-xl border bg-muted/30 p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold">目次</summary>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    );
  }

  return (
    <nav className="sticky top-24">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        目次
      </p>
      <ul className="mt-3 space-y-1 border-l text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-3 transition-colors",
                active === item.id
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
