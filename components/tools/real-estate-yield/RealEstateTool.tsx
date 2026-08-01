"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { ShareBar } from "@/components/common/ShareBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateRealEstate,
  type RealEstateInput,
} from "@/lib/calculators/real-estate-yield";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/real-estate-yield/schema";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

const CashFlowChart = dynamic(() => import("./CashFlowChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
  ),
});

export function RealEstateTool() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState<RealEstateInput>(() =>
    decodeInputFromParams(new URLSearchParams(searchParams.toString())),
  );

  const update = useCallback((patch: Partial<RealEstateInput>) => {
    setInput((prev) => ({ ...prev, ...patch }));
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.history.replaceState(
      null,
      "",
      `?${encodeInputToParams(input).toString()}`,
    );
  }, [input]);

  const result = useMemo(() => calculateRealEstate(input), [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
      <Card className="lg:sticky lg:top-20 lg:self-start">
        <CardHeader>
          <CardTitle className="text-base">物件・ローンを入力</CardTitle>
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
              元金返済額 vs 減価償却費（年次）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart
              schedule={result.schedule}
              deadCrossYear={result.deadCrossYear}
            />
          </CardContent>
        </Card>

        <ShareBar
          shareText={`実質利回り${result.netYield.toFixed(1)}%、デッドクロスは${
            result.deadCrossYear !== null
              ? `${result.deadCrossYear}年目`
              : "発生せず"
          }でした！`}
          hashtags={["不動産投資", "マネ電"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
