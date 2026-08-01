import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/tools";

/**
 * ツール紹介カード。公開済みはカード全体がリンク＋ホバー演出（浮上・グロー）、準備中は非活性。
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const isLive = tool.status === "live";

  const card = (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden transition-all duration-300",
        isLive
          ? "group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-indigo-500/10"
          : "opacity-75",
      )}
    >
      {isLive && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full bg-gradient-to-br from-indigo-500/25 to-sky-500/25 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
              isLive
                ? "bg-gradient-to-br from-indigo-500 to-sky-500 shadow-indigo-500/30"
                : "bg-muted-foreground/30",
            )}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <CardTitle className="flex-1 text-base">{tool.shortTitle}</CardTitle>
          {!isLive && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              準備中
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <CardDescription className="flex-1">{tool.description}</CardDescription>
        <div
          className={cn(
            "mt-5 inline-flex items-center gap-1 text-sm font-semibold",
            isLive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {isLive ? (
            <>
              使ってみる
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            "近日公開"
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!isLive) {
    return <div className="h-full">{card}</div>;
  }

  return (
    <Link href={tool.href} className="group block h-full">
      {card}
    </Link>
  );
}
