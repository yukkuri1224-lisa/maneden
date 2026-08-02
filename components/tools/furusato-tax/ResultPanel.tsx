"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { FurusatoResult } from "@/lib/calculators/furusato-tax";
import { formatYen } from "@/lib/format";

export function ResultPanel({ result }: { result: FurusatoResult }) {
  const limit = useCountUp(result.donationLimit);

  const metrics = [
    {
      label: "課税所得（所得税）",
      value: formatYen(result.taxableIncomeIncomeTax),
    },
    { label: "住民税 所得割", value: formatYen(result.residentTaxIncomeLevy) },
    { label: "所得税率", value: `${Math.round(result.incomeTaxRate * 100)}%` },
    {
      label: "実質負担",
      value: result.donationLimit > 0 ? "2,000円" : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          控除上限額の目安（自己負担2,000円）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-5xl">
          {formatYen(limit)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          この額までの寄付なら、実質負担は{" "}
          <span className="font-semibold text-foreground">2,000円</span>{" "}
          で済む目安です
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
    </div>
  );
}
