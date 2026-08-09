"use client";

import { SliderField } from "@/components/common/SliderField";
import type { NisaInput } from "@/lib/calculators/nisa";
import {
  INITIAL_MAX,
  INITIAL_MIN,
  INITIAL_STEP,
  MONTHLY_MAX,
  MONTHLY_MIN,
  MONTHLY_STEP,
  RATE_MAX,
  RATE_MIN,
  RATE_STEP,
  YEARS_MAX,
  YEARS_MIN,
} from "@/lib/calculators/nisa/schema";
import { formatManYen } from "@/lib/format";

interface InputPanelProps {
  value: NisaInput;
  onChange: (patch: Partial<NisaInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SliderField
        id="monthly"
        label="毎月の積立額"
        value={value.monthlyContribution}
        min={MONTHLY_MIN}
        max={MONTHLY_MAX}
        step={MONTHLY_STEP}
        unit="円"
        format={(v) => `${v.toLocaleString()}円`}
        hint="年間の投資枠は360万円（月30万円）まで"
        onChange={(v) => onChange({ monthlyContribution: v })}
      />
      <SliderField
        id="initial"
        label="初期投資額（一括）"
        value={value.initialLumpSum}
        min={INITIAL_MIN}
        max={INITIAL_MAX}
        step={INITIAL_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        hint="最初にまとめて投資する額（不要なら0）"
        onChange={(v) => onChange({ initialLumpSum: v })}
      />
      <SliderField
        id="rate"
        label="想定年利"
        value={value.annualReturnPercent}
        min={RATE_MIN}
        max={RATE_MAX}
        step={RATE_STEP}
        unit="%"
        format={(v) => `${v}%`}
        hint="オルカン・S&P500の長期実績は年5〜7%が目安（保証ではありません）"
        onChange={(v) => onChange({ annualReturnPercent: v })}
      />
      <SliderField
        id="years"
        label="積立年数"
        value={value.years}
        min={YEARS_MIN}
        max={YEARS_MAX}
        step={1}
        unit="年"
        format={(v) => `${v}年`}
        onChange={(v) => onChange({ years: v })}
      />
    </div>
  );
}
