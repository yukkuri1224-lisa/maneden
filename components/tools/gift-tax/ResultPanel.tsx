"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { GiftTaxResult } from "@/lib/calculators/gift-tax";
import { formatManYen, formatYen } from "@/lib/format";

export function ResultPanel({ result }: { result: GiftTaxResult }) {
  const tax = useCountUp(result.taxAmount);

  const metrics = [
    {
      label: "課税価格（控除後）",
      value: formatManYen(result.taxableAmount, 0),
    },
    { label: "手元に残る額", value: formatManYen(result.netAmount, 0) },
    { label: "実効税率", value: `${result.effectiveRate.toFixed(1)}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          贈与税額（概算）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {formatYen(tax)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.taxableAmount > 0 ? (
            <>
              適用税率{" "}
              <span className="font-semibold text-foreground">
                {result.marginalRate}%
              </span>
            </>
          ) : (
            <>基礎控除（110万円）の範囲内で、贈与税はかかりません</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label} size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {m.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
