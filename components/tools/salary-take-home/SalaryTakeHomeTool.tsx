"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import { ShareBar } from "@/components/common/ShareBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/salary-take-home/schema";
import { formatManYen } from "@/lib/format";
import { useUrlSyncedInput } from "@/lib/hooks/use-url-synced-input";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

const BreakdownChart = dynamic(() => import("./BreakdownChart"), {
  ssr: false,
  loading: () => (
    <div className="h-56 w-full animate-pulse rounded-lg bg-muted" />
  ),
});

export function SalaryTakeHomeTool() {
  const {
    input,
    setInput,
    patch: update,
  } = useUrlSyncedInput(decodeInputFromParams, encodeInputToParams);

  const result = useMemo(() => calculateSalaryTakeHome(input), [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
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
        <ResultPanel result={result} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">年収の内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownChart result={result} />
          </CardContent>
        </Card>
        <ShareBar
          shareText={`年収${formatManYen(input.income, 0)}の手取りは${formatManYen(
            result.netIncome,
          )}（手取り率${result.netIncomeRate.toFixed(1)}%）でした！`}
          hashtags={["手取り", "年収", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
