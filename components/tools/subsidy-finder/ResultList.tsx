"use client";

import { ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubsidyMatch } from "@/lib/calculators/subsidy-finder";
import { formatManYen } from "@/lib/format";
import { cn } from "@/lib/utils";

import { DIFFICULTY_LABEL, DIFFICULTY_STYLE } from "./options";

export function ResultList({ matches }: { matches: SubsidyMatch[] }) {
  if (matches.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        条件に合う候補が見つかりませんでした。事業目的を追加してお試しください。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {matches.length}件
        </span>{" "}
        の候補が見つかりました（概算受給額の大きい順）
      </p>

      {matches.map((match) => (
        <Card key={match.program.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base">{match.program.name}</CardTitle>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  DIFFICULTY_STYLE[match.program.difficulty],
                )}
              >
                難易度: {DIFFICULTY_LABEL[match.program.difficulty]}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <div>
                <span className="text-xs text-muted-foreground">
                  概算受給額
                </span>
                <p className="text-xl font-bold text-primary tabular-nums">
                  {formatManYen(match.estimatedMin)}〜
                  {formatManYen(match.estimatedAmount)}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                補助率 {Math.round(match.program.subsidyRateMin * 100)}〜
                {Math.round(match.program.subsidyRateMax * 100)}% / 上限{" "}
                {formatManYen(match.program.maxAmount, 0)}
              </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {match.program.summary}
            </p>

            <a
              href={match.program.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3",
              )}
            >
              公式サイトで確認
              <ExternalLink className="size-3.5" />
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
