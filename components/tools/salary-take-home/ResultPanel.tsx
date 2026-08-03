"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { SalaryTakeHomeResult } from "@/lib/calculators/salary-take-home";
import { formatManYen, formatPercent, formatYen } from "@/lib/format";

export function ResultPanel({ result }: { result: SalaryTakeHomeResult }) {
  const net = useCountUp(result.netIncome);

  const metrics = [
    { label: "社会保険料", value: formatYen(result.socialInsurance) },
    { label: "所得税", value: formatYen(result.incomeTax) },
    { label: "住民税", value: formatYen(result.residentTax) },
    { label: "給与所得", value: formatYen(result.salaryIncome) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          年間手取り額（概算）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {formatYen(net)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          手取り率{" "}
          <span className="font-semibold text-foreground">
            {formatPercent(result.netIncomeRate)}
          </span>{" "}
          ・ 月あたり約{" "}
          <span className="font-semibold text-foreground">
            {formatManYen(result.netIncome / 12)}
          </span>
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
