"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { MortgageResult } from "@/lib/calculators/mortgage";
import { formatManYen, formatYen } from "@/lib/format";

function monthsToYearMonth(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}か月`;
  return m === 0 ? `${y}年` : `${y}年${m}か月`;
}

export function ResultPanel({ result }: { result: MortgageResult }) {
  const monthly = useCountUp(result.monthlyPayment);

  const metrics = [
    { label: "総返済額", value: formatManYen(result.totalPayment, 0) },
    { label: "うち利息", value: formatManYen(result.totalInterest, 0) },
    { label: "返済回数", value: `${result.totalMonths}回` },
    { label: "返済期間", value: monthsToYearMonth(result.totalMonths) },
  ];

  const eff = result.prepaymentEffect;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          毎月の返済額（概算）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {formatYen(monthly)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {eff.applied && (
        <div className="rounded-2xl border bg-accent/40 p-6">
          <p className="font-semibold">繰上返済の効果（期間短縮型）</p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">軽減される利息</p>
              <p className="text-gradient mt-1 text-2xl font-black tabular-nums">
                {formatManYen(eff.interestSaved, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">短縮される期間</p>
              <p className="text-gradient mt-1 text-2xl font-black tabular-nums">
                {monthsToYearMonth(eff.monthsSaved)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            完済まで {monthsToYearMonth(eff.newPayoffMonths)}
            （毎月返済＋繰上額の総支払 約{formatManYen(eff.newTotalPayment, 0)}
            ）
          </p>
        </div>
      )}
    </div>
  );
}
