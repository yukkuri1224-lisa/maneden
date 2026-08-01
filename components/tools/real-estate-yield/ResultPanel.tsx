"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { RealEstateResult } from "@/lib/calculators/real-estate-yield";
import { formatManYen, formatPercent, formatYen } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ResultPanel({ result }: { result: RealEstateResult }) {
  const netYield = useCountUp(result.netYield);

  const metrics: { label: string; value: string; negative?: boolean }[] = [
    { label: "表面利回り", value: formatPercent(result.grossYield) },
    { label: "年間NOI（純収益）", value: formatManYen(result.noi) },
    { label: "月々返済額", value: formatYen(result.monthlyPayment) },
    {
      label: "年間 税引前CF",
      value: formatYen(result.beforeTaxCashFlow),
      negative: result.beforeTaxCashFlow < 0,
    },
    { label: "総返済額", value: formatManYen(result.totalRepayment) },
    { label: "減価償却費 / 年", value: formatYen(result.annualDepreciation) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          実質利回り（概算）
        </p>
        <p className="mt-1 bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent tabular-nums sm:text-6xl">
          {formatPercent(netYield)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          表面利回り{" "}
          <span className="font-semibold text-foreground">
            {formatPercent(result.grossYield)}
          </span>
        </p>
      </div>

      <div
        className={cn(
          "rounded-xl border p-4",
          result.deadCrossYear !== null &&
            "border-amber-300 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30",
        )}
      >
        <p className="text-sm text-muted-foreground">
          デッドクロス（元金返済額 &gt; 減価償却費）
        </p>
        <p className="mt-1 text-lg font-semibold">
          {result.deadCrossYear !== null
            ? `${result.deadCrossYear}年目に発生する見込み`
            : "借入期間内では発生しません"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          発生後は、帳簿上は黒字でも手元資金が不足しやすくなります。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p
                className={cn(
                  "mt-1 text-lg font-semibold tabular-nums",
                  metric.negative && "text-red-600 dark:text-red-400",
                )}
              >
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
