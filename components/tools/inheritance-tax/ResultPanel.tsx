"use client";

import { useCountUp } from "@/components/common/useCountUp";
import { Card, CardContent } from "@/components/ui/card";
import type { InheritanceTaxResult } from "@/lib/calculators/inheritance-tax";
import { formatOkuMan } from "@/lib/format";

export function ResultPanel({ result }: { result: InheritanceTaxResult }) {
  const total = useCountUp(result.totalTax);

  const metrics = [
    { label: "基礎控除", value: formatOkuMan(result.basicDeduction) },
    { label: "課税遺産総額", value: formatOkuMan(result.taxableEstate) },
    { label: "法定相続人", value: `${result.heirCount}人` },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          相続税の総額（概算）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {formatOkuMan(total)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.taxableEstate > 0 ? (
            <>相続人{result.heirCount}人が納める相続税の合計です</>
          ) : (
            <>基礎控除の範囲内で、相続税はかかりません</>
          )}
        </p>
      </div>

      {result.hasSpouseRelief && result.totalTax > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          配偶者が法定相続分を相続する場合、配偶者の税額軽減により実際の負担は{" "}
          <span className="font-semibold text-foreground">
            約{formatOkuMan(result.taxAfterSpouseRelief)}
          </span>
          になります（配偶者が取得した分は非課税）。
        </div>
      )}

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
