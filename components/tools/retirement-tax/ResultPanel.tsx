"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { RetirementTaxResult } from "@/lib/calculators/retirement-tax";
import { formatManYen, formatYen } from "@/lib/format";

export function ResultPanel({
  result,
  amount,
}: {
  result: RetirementTaxResult;
  amount: number;
}) {
  const net = useCountUp(result.netAmount);

  const metrics = [
    { label: "退職所得控除", value: formatManYen(result.deduction, 0) },
    { label: "課税退職所得", value: formatManYen(result.taxableIncome, 0) },
    { label: "所得税", value: formatYen(result.incomeTax) },
    { label: "住民税", value: formatYen(result.residentTax) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          退職金の手取り額（概算）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {formatYen(net)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          税額合計{" "}
          <span className="font-semibold text-foreground">
            {formatYen(result.totalTax)}
          </span>
          {amount > 0 && (
            <>（退職金の{((result.totalTax / amount) * 100).toFixed(1)}%）</>
          )}
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
