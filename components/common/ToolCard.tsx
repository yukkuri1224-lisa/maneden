import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Tool } from "@/types/tools";

/**
 * ツールの目次行（design-system/maneden/MASTER.md「6. 部品 ツール一覧」）。
 * アイコン・名前・説明・矢印を 1 行にまとめ、罫線で区切る。親は `ToolIndex` などの
 * `grid` に入れ、上下の罫線は親の `divide-y` / `border-t` で表現する。
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const isLive = tool.status === "live";

  const body = (
    <>
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border",
          isLive
            ? "border-primary/25 text-primary"
            : "border-border text-muted-foreground",
        )}
      >
        <Icon className="size-[18px]" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "font-medium",
              isLive && "transition-colors group-hover:text-primary",
            )}
          >
            {tool.shortTitle}
          </span>
          {!isLive && (
            <span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              準備中
            </span>
          )}
        </span>
        <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tool.description}
        </span>
      </span>
      {isLive && (
        <ChevronRight
          className="mt-2 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
          aria-hidden
        />
      )}
    </>
  );

  const className = "flex min-h-11 items-start gap-4 border-b py-4";

  if (!isLive) {
    return <div className={cn(className, "opacity-70")}>{body}</div>;
  }

  return (
    <Link
      href={tool.href}
      className={cn(
        className,
        "group rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
      )}
    >
      {body}
    </Link>
  );
}

/** ツール行を並べる格子。上端に罫線を 1 本引き、各行の下罫線で区切る。 */
export function ToolIndex({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid border-t sm:grid-cols-2 sm:gap-x-10">{children}</div>
  );
}
