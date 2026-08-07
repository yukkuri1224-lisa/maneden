"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type {
  HourlyWageInput,
  HourlyWageResult,
} from "@/lib/calculators/hourly-wage";
import { formatManYen, formatYen } from "@/lib/format";

export function ResultPanel({
  result,
  mode,
}: {
  result: HourlyWageResult;
  mode: HourlyWageInput["mode"];
}) {
  const isToAnnual = mode === "hourly-to-annual";
  const primaryValue = isToAnnual ? result.annualIncome : result.hourlyWage;
  const animated = useCountUp(primaryValue);

  const tiles = [
    { key: "hourly", label: "時給", value: formatYen(result.hourlyWage) },
    { key: "daily", label: "日給", value: formatYen(result.dailyWage) },
    { key: "weekly", label: "週給", value: formatYen(result.weeklyWage) },
    { key: "monthly", label: "月収", value: formatYen(result.monthlyWage) },
    {
      key: "annual",
      label: "年収",
      value: formatManYen(result.annualIncome, 0),
    },
  ].filter((t) => (isToAnnual ? t.key !== "annual" : t.key !== "hourly"));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          {isToAnnual ? "年収（額面）" : "時給"}（概算）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {isToAnnual ? formatManYen(animated, 0) : formatYen(animated)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          年間労働時間 約{result.annualHours.toLocaleString("ja-JP")}時間（週
          {result.weeklyHours}時間）
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.key} size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{tile.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {tile.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
