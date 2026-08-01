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
 * ツール紹介カード。公開済みはカード全体がリンク＋ホバー演出、準備中は非活性。
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const isLive = tool.status === "live";

  const card = (
    <Card
      className={cn(
        "flex h-full flex-col transition-all",
        isLive
          ? "group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md"
          : "opacity-70",
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
            "mt-4 inline-flex items-center gap-1 text-sm font-medium",
            isLive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {isLive ? (
            <>
              使ってみる
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          ) : (
            "近日公開"
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!isLive) {
    return card;
  }

  return (
    <Link href={tool.href} className="group block h-full">
      {card}
    </Link>
  );
}
