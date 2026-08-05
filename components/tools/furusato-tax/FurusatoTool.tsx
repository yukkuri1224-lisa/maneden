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
  calculateFurusato,
  type FurusatoInput,
} from "@/lib/calculators/furusato-tax";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/furusato-tax/schema";
import { formatYen } from "@/lib/format";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

const DonationChart = dynamic(() => import("./DonationChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
  ),
});

export function FurusatoTool() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState<FurusatoInput>(() =>
    decodeInputFromParams(new URLSearchParams(searchParams.toString())),
  );

  const update = useCallback((patch: Partial<FurusatoInput>) => {
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

  const result = useMemo(() => calculateFurusato(input), [input]);

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
              寄付額と実質自己負担の関係
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonationChart result={result} />
          </CardContent>
        </Card>
        <ShareBar
          shareText={`ふるさと納税の控除上限額は${formatYen(
            result.donationLimit,
          )}（実質負担2,000円）でした！`}
          hashtags={["ふるさと納税", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
