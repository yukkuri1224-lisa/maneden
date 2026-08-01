"use client";

import type {
  FreelanceTaxInput,
  FreelanceTaxResult,
} from "@/lib/calculators/freelance-tax";
import { formatManYen, formatPercent, formatYen } from "@/lib/format";

import { useCountUp } from "./useCountUp";

export function ResultHero({
  result,
  input,
}: {
  result: FreelanceTaxResult;
  input: FreelanceTaxInput;
}) {
  const net = useCountUp(result.netIncome);

  return (
    <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
      <p className="text-sm font-medium text-muted-foreground">
        年間手取り額（概算）
      </p>
      <p className="mt-1 bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent tabular-nums sm:text-6xl">
        {formatYen(net)}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>
          手取り率{" "}
          <span className="font-semibold text-foreground">
            {formatPercent(result.netIncomeRate)}
          </span>
        </span>
        <span aria-hidden>/</span>
        <span>
          月あたり約{" "}
          <span className="font-semibold text-foreground">
            {formatManYen(result.netIncome / 12)}
          </span>
        </span>
      </div>

      {input.invoiceStatus === "exempt" && result.invoiceImpact > 0 && (
        <p className="mt-4 inline-block rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
          インボイス登録（2割特例）すると、年 約
          <span className="font-semibold">
            {formatManYen(result.invoiceImpact)}
          </span>
          の負担増（消費税）
        </p>
      )}
    </div>
  );
}
