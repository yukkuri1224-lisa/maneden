"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { NisaResult } from "@/lib/calculators/nisa";
import { formatManYen, formatYen } from "@/lib/format";

export function ResultPanel({ result }: { result: NisaResult }) {
  const value = useCountUp(result.futureValue);

  const gainRate =
    result.totalPrincipal > 0
      ? (result.totalGain / result.totalPrincipal) * 100
      : 0;

  const metrics = [
    { label: "投資元本", value: formatManYen(result.totalPrincipal, 0) },
    {
      label: "運用益",
      value: formatManYen(result.totalGain, 0),
      sub: `+${gainRate.toFixed(0)}%`,
    },
    { label: "NISAの非課税メリット", value: formatYen(result.taxSaved) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          将来の評価額（概算）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {formatYen(value)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          元本{" "}
          <span className="font-semibold text-foreground">
            {formatManYen(result.totalPrincipal, 0)}
          </span>{" "}
          ＋ 運用益{" "}
          <span className="font-semibold text-foreground">
            {formatManYen(result.totalGain, 0)}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {metric.value}
                {metric.sub && (
                  <span className="ml-1 text-xs font-medium text-primary">
                    {metric.sub}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {result.reachedLifetimeCap && result.capReachedYear !== null && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <span className="font-semibold text-foreground">
            {result.capReachedYear}年目
          </span>
          に生涯投資枠（1,800万円）に到達します。それ以降は新規の積立ができないため、この条件では枠の上限で計算しています。
        </div>
      )}
    </div>
  );
}
