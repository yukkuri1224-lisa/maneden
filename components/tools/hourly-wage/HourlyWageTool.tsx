"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Building2 } from "lucide-react";

import { ShareBar } from "@/components/common/ShareBar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateHourlyWage,
  type HourlyWageInput,
} from "@/lib/calculators/hourly-wage";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/hourly-wage/schema";
import { formatManYen, formatYen } from "@/lib/format";
import { cn } from "@/lib/utils";

import { InputPanel } from "./InputPanel";
import { ResultPanel } from "./ResultPanel";

export function HourlyWageTool() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState<HourlyWageInput>(() =>
    decodeInputFromParams(new URLSearchParams(searchParams.toString())),
  );

  const update = useCallback((patch: Partial<HourlyWageInput>) => {
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

  const result = useMemo(() => calculateHourlyWage(input), [input]);

  const shareText =
    input.mode === "hourly-to-annual"
      ? `時給${formatYen(input.hourlyWage)}は年収${formatManYen(
          result.annualIncome,
          0,
        )}でした！`
      : `年収${formatManYen(input.annualIncome, 0)}は時給${formatYen(
          result.hourlyWage,
        )}でした！`;

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
        <ResultPanel result={result} mode={input.mode} />

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/tools/salary-take-home?inc=${result.annualIncome}`}
            className={cn(buttonVariants())}
          >
            この年収の手取りを計算
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/companies"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Building2 className="size-4" />
            近い年収の企業を見る
          </Link>
        </div>

        <ShareBar
          shareText={shareText}
          hashtags={["時給", "年収", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
