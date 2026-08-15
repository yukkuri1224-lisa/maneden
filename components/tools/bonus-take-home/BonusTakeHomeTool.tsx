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
import { calculateBonusTakeHome } from "@/lib/calculators/bonus-take-home";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/bonus-take-home/schema";
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

export function BonusTakeHomeTool() {
  const {
    input,
    setInput,
    patch: update,
  } = useUrlSyncedInput(decodeInputFromParams, encodeInputToParams);

  const result = useMemo(() => calculateBonusTakeHome(input), [input]);

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
            <CardTitle className="text-base">賞与の内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <LazyMount placeholderClassName="h-72 w-full animate-pulse rounded-lg bg-muted">
              <BreakdownChart result={result} />
            </LazyMount>
          </CardContent>
        </Card>
        <ShareBar
          shareText={`賞与${formatManYen(input.bonus, 0)}の手取りは${formatYen(
            result.netBonus,
          )}（手取り率${result.netRate.toFixed(1)}%）でした！`}
          hashtags={["ボーナス", "手取り", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
