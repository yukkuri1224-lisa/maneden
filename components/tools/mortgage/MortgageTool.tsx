"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  calculateMortgage,
  type MortgageInput,
} from "@/lib/calculators/mortgage";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/mortgage/schema";
import { formatManYen, formatYen } from "@/lib/format";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

export function MortgageTool() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState<MortgageInput>(() =>
    decodeInputFromParams(new URLSearchParams(searchParams.toString())),
  );

  const update = useCallback((patch: Partial<MortgageInput>) => {
    setInput((prev) => {
      const next = { ...prev, ...patch };
      // 繰上返済の時期が返済期間を超えないようにする
      if (next.prepaymentAfterYears > next.years) {
        next.prepaymentAfterYears = next.years;
      }
      return next;
    });
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

  const result = useMemo(() => calculateMortgage(input), [input]);

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
        <ShareBar
          shareText={`借入${formatManYen(input.principal, 0)}・金利${
            input.annualRatePercent
          }%・${input.years}年なら、毎月の返済は${formatYen(
            result.monthlyPayment,
          )}でした！`}
          hashtags={["住宅ローン", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
