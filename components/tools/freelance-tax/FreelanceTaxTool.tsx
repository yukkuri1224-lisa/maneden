"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import { LazyMount } from "@/components/common/LazyMount";
import { ShareBar } from "@/components/common/ShareBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateFreelanceTax } from "@/lib/calculators/freelance-tax";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/freelance-tax/schema";
import { formatManYen } from "@/lib/format";
import { useUrlSyncedInput } from "@/lib/hooks/use-url-synced-input";

import { BreakdownDetails } from "./BreakdownDetails";
import { InputPanel } from "./InputPanel";
import { ResultHero } from "./ResultHero";

function ChartSkeleton() {
  return <div className="h-56 w-full animate-pulse rounded-lg bg-muted" />;
}

const TaxBreakdownChart = dynamic(() => import("./TaxBreakdownChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

const RevenueSimulationChart = dynamic(
  () => import("./RevenueSimulationChart"),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

export function FreelanceTaxTool() {
  const {
    input,
    setInput,
    patch: update,
  } = useUrlSyncedInput(decodeInputFromParams, encodeInputToParams);

  const result = useMemo(() => calculateFreelanceTax(input), [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <Card className="lg:sticky lg:top-20 lg:self-start">
        <CardHeader>
          <CardTitle className="text-base">条件を入力</CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput(DEFAULT_INPUT)}
            >
              リセット
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <InputPanel value={input} onChange={update} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <ResultHero result={result} input={input} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">税金・社会保険の内訳</CardTitle>
            </CardHeader>
            <CardContent>
              <LazyMount placeholderClassName="h-56 w-full animate-pulse rounded-lg bg-muted">
                <TaxBreakdownChart result={result} />
              </LazyMount>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">売上別の手取り推移</CardTitle>
            </CardHeader>
            <CardContent>
              <LazyMount placeholderClassName="h-56 w-full animate-pulse rounded-lg bg-muted">
                <RevenueSimulationChart input={input} />
              </LazyMount>
            </CardContent>
          </Card>
        </div>

        <BreakdownDetails result={result} input={input} />

        <ShareBar
          shareText={`売上${formatManYen(input.revenue, 0)}のフリーランスの手取りは${formatManYen(
            result.netIncome,
          )}（手取り率${result.netIncomeRate.toFixed(1)}%）でした！`}
          hashtags={["フリーランス", "確定申告", "まねでん"]}
          note="入力内容はURLに保存され、その条件のままシェアできます。"
        />
      </div>
    </div>
  );
}
