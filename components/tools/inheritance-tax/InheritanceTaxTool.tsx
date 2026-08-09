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
import { calculateInheritanceTax } from "@/lib/calculators/inheritance-tax";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/inheritance-tax/schema";
import { formatOkuMan } from "@/lib/format";
import { useUrlSyncedInput } from "@/lib/hooks/use-url-synced-input";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

const BreakdownChart = dynamic(() => import("./BreakdownChart"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-lg bg-muted" />
  ),
});

export function InheritanceTaxTool() {
  const {
    input,
    setInput,
    patch: update,
  } = useUrlSyncedInput(decodeInputFromParams, encodeInputToParams);

  const result = useMemo(() => calculateInheritanceTax(input), [input]);

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
            <CardTitle className="text-base">遺産と相続税の内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownChart result={result} />
          </CardContent>
        </Card>
        <ShareBar
          shareText={`遺産${formatOkuMan(input.estate)}（配偶者${
            input.hasSpouse ? "あり" : "なし"
          }・子${input.children}人）にかかる相続税は総額${formatOkuMan(
            result.totalTax,
          )}でした`}
          hashtags={["相続税", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
