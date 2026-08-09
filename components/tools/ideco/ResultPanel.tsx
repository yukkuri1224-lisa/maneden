"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { IdecoResult } from "@/lib/calculators/ideco";
import { formatManYen, formatYen } from "@/lib/format";

export function ResultPanel({ result }: { result: IdecoResult }) {
  const annualSaved = useCountUp(result.annualTaxSaved);

  const metrics = [
    { label: "所得税の軽減（年）", value: formatYen(result.incomeTaxSaved) },
    { label: "住民税の軽減（年）", value: formatYen(result.residentTaxSaved) },
    { label: "実質の自己負担（年）", value: formatYen(result.annualNetCost) },
    {
      label: "あなたの所得税率",
      value: `${result.marginalIncomeTaxRate.toFixed(0)}%`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          年間の節税額（概算）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {formatYen(annualSaved)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          年間の掛金{" "}
          <span className="font-semibold text-foreground">
            {formatYen(result.annualContribution)}
          </span>{" "}
          のうち、約{result.savingRate.toFixed(1)}%が節税で戻る計算です
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

      {result.yearsToSixty > 0 && (
        <div className="rounded-xl border bg-muted/40 p-4 sm:flex sm:items-baseline sm:justify-between">
          <p className="text-sm text-muted-foreground">
            60歳まで（あと{result.yearsToSixty}年）積み立てた場合の累計節税額
          </p>
          <p className="mt-1 text-2xl font-bold text-primary tabular-nums sm:mt-0">
            約{formatManYen(result.totalTaxSaved, 0)}
          </p>
        </div>
      )}
    </div>
  );
}
