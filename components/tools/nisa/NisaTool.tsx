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
import { calculateNisa } from "@/lib/calculators/nisa";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/nisa/schema";
import { formatManYen, formatYen } from "@/lib/format";
import { useUrlSyncedInput } from "@/lib/hooks/use-url-synced-input";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

const GrowthChart = dynamic(() => import("./GrowthChart"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-lg bg-muted" />
  ),
});

export function NisaTool() {
  const {
    input,
    setInput,
    patch: update,
  } = useUrlSyncedInput(decodeInputFromParams, encodeInputToParams);

  const result = useMemo(() => calculateNisa(input), [input]);

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
            <CardTitle className="text-base">
              資産の推移（元本＋運用益）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart result={result} />
          </CardContent>
        </Card>
        <ShareBar
          shareText={`新NISAで毎月${formatYen(
            input.monthlyContribution,
          )}を年利${input.annualReturnPercent}%・${
            input.years
          }年積み立てると、将来${formatManYen(
            result.futureValue,
            0,
          )}に！（運用益${formatManYen(result.totalGain, 0)}）`}
          hashtags={["新NISA", "資産形成", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
