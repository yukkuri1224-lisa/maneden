"use client";

import { useCallback, useMemo } from "react";
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
import {
  IDECO_MONTHLY_CAPS,
  calculateIdeco,
  type IdecoInput,
} from "@/lib/calculators/ideco";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/ideco/schema";
import { formatYen } from "@/lib/format";
import { useUrlSyncedInput } from "@/lib/hooks/use-url-synced-input";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

const BreakdownChart = dynamic(() => import("./BreakdownChart"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-lg bg-muted" />
  ),
});

export function IdecoTool() {
  const { input, setInput } = useUrlSyncedInput(
    decodeInputFromParams,
    encodeInputToParams,
  );

  const update = useCallback(
    (patch: Partial<IdecoInput>) => {
      setInput((prev) => {
        const next = { ...prev, ...patch };
        // 加入区分を変えたら掛金を新しい上限に収める
        const cap = IDECO_MONTHLY_CAPS[next.category];
        if (next.monthlyContribution > cap) {
          next.monthlyContribution = cap;
        }
        return next;
      });
    },
    [setInput],
  );

  const result = useMemo(() => calculateIdeco(input), [input]);

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
            <CardTitle className="text-base">年間掛金の内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <LazyMount placeholderClassName="h-72 w-full animate-pulse rounded-lg bg-muted">
              <BreakdownChart result={result} />
            </LazyMount>
          </CardContent>
        </Card>
        <ShareBar
          shareText={`iDeCoに毎月${formatYen(
            input.monthlyContribution,
          )}積み立てると、年間${formatYen(
            result.annualTaxSaved,
          )}の節税に！（掛金の約${result.savingRate.toFixed(1)}%）`}
          hashtags={["iDeCo", "節税", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
