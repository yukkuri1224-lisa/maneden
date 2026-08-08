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
import { calculateRetirementTax } from "@/lib/calculators/retirement-tax";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/retirement-tax/schema";
import { formatManYen, formatYen } from "@/lib/format";
import { useUrlSyncedInput } from "@/lib/hooks/use-url-synced-input";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

const BreakdownChart = dynamic(() => import("./BreakdownChart"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-lg bg-muted" />
  ),
});

export function RetirementTaxTool() {
  const {
    input,
    setInput,
    patch: update,
  } = useUrlSyncedInput(decodeInputFromParams, encodeInputToParams);

  const result = useMemo(() => calculateRetirementTax(input), [input]);

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
        <ResultPanel result={result} amount={input.amount} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">退職金の内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownChart result={result} />
          </CardContent>
        </Card>
        <ShareBar
          shareText={`退職金${formatManYen(input.amount, 0)}（勤続${
            input.yearsOfService
          }年）の手取りは${formatYen(result.netAmount)}でした！`}
          hashtags={["退職金", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
