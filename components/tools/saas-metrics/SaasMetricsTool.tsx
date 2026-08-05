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
  calculateSaasMetrics,
  type SaasMetricsInput,
} from "@/lib/calculators/saas-metrics";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/saas-metrics/schema";
import { formatYen } from "@/lib/format";

import { InputPanel } from "./InputPanel";
import { MetricsPanel } from "./MetricsPanel";

const CohortChart = dynamic(() => import("./CohortChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
  ),
});

export function SaasMetricsTool() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState<SaasMetricsInput>(() =>
    decodeInputFromParams(new URLSearchParams(searchParams.toString())),
  );

  const update = useCallback((patch: Partial<SaasMetricsInput>) => {
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

  const result = useMemo(() => calculateSaasMetrics(input), [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
      <Card className="lg:sticky lg:top-20 lg:self-start">
        <CardHeader>
          <CardTitle className="text-base">指標を入力</CardTitle>
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
        <MetricsPanel result={result} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              コホートの累積粗利 vs 獲得コスト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CohortChart input={input} />
          </CardContent>
        </Card>

        <ShareBar
          shareText={`SaaSのLTVは${formatYen(result.ltv)}、LTV/CAC比率は${
            Number.isFinite(result.ltvCacRatio)
              ? `${result.ltvCacRatio.toFixed(1)}倍`
              : "—"
          }でした！`}
          hashtags={["SaaS", "スタートアップ", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
