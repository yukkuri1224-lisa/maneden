"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type {
  HealthLevel,
  SaasMetricsResult,
} from "@/lib/calculators/saas-metrics";
import { formatManYen, formatYen } from "@/lib/format";
import { cn } from "@/lib/utils";

const healthStyles: Record<HealthLevel, string> = {
  good: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  bad: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const healthLabel: Record<HealthLevel, string> = {
  good: "健全",
  warning: "要改善",
  bad: "危険",
};

function ratioText(value: number): string {
  return Number.isFinite(value) ? `${value.toFixed(1)}倍` : "—";
}

function monthsText(value: number): string {
  return Number.isFinite(value) ? `${value.toFixed(1)}ヶ月` : "—";
}

export function MetricsPanel({ result }: { result: SaasMetricsResult }) {
  const ltv = useCountUp(result.ltv);

  const metrics: { label: string; value: string; health?: HealthLevel }[] = [
    {
      label: "CAC回収期間",
      value: monthsText(result.cacPaybackMonths),
      health: result.paybackHealth,
    },
    { label: "平均継続月数", value: monthsText(result.avgLifetimeMonths) },
    { label: "MRR", value: formatManYen(result.mrr) },
    { label: "ARR", value: formatManYen(result.arr) },
    { label: "年換算 解約率", value: `${result.annualChurnRate.toFixed(1)}%` },
    {
      label: "月間粗利/顧客",
      value: formatYen(result.monthlyGrossProfitPerUser),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          顧客生涯価値 LTV（粗利ベース）
        </p>
        <p className="mt-1 bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent tabular-nums sm:text-6xl">
          {formatYen(ltv)}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span>LTV/CAC 比率</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              healthStyles[result.ltvCacHealth],
            )}
          >
            {ratioText(result.ltvCacRatio)}・{healthLabel[result.ltvCacHealth]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {metric.value}
              </p>
              {metric.health && (
                <span
                  className={cn(
                    "mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    healthStyles[metric.health],
                  )}
                >
                  {healthLabel[metric.health]}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
