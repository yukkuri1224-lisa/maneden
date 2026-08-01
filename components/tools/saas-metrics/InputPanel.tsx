"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { SaasMetricsInput } from "@/lib/calculators/saas-metrics";
import {
  ARPU_MAX,
  ARPU_MIN,
  ARPU_STEP,
  CAC_MAX,
  CAC_MIN,
  CAC_STEP,
  CHURN_MAX,
  CHURN_MIN,
  CHURN_STEP,
  CUSTOMERS_MAX,
  CUSTOMERS_MIN,
  CUSTOMERS_STEP,
  MARGIN_MAX,
  MARGIN_MIN,
  MARGIN_STEP,
} from "@/lib/calculators/saas-metrics/schema";
import { formatYen } from "@/lib/format";

interface InputPanelProps {
  value: SaasMetricsInput;
  onChange: (patch: Partial<SaasMetricsInput>) => void;
}

function clampNum(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  format,
  hint,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  format: (value: number) => string;
  hint?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm font-semibold tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        onValueChange={(v) =>
          onChange(
            clampNum(typeof v === "number" ? v : (v[0] ?? min), min, max),
          )
        }
      />
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(clampNum(Number(e.target.value), min, max))}
          className="tabular-nums"
        />
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <NumberField
        id="churn"
        label="月次解約率"
        value={value.monthlyChurnRate}
        min={CHURN_MIN}
        max={CHURN_MAX}
        step={CHURN_STEP}
        unit="%"
        format={(v) => `${v}%`}
        hint="毎月どれくらいの顧客が解約するか"
        onChange={(v) => onChange({ monthlyChurnRate: v })}
      />
      <NumberField
        id="arpu"
        label="ARPU（顧客あたり月間売上）"
        value={value.arpu}
        min={ARPU_MIN}
        max={ARPU_MAX}
        step={ARPU_STEP}
        unit="円"
        format={formatYen}
        onChange={(v) => onChange({ arpu: v })}
      />
      <NumberField
        id="gm"
        label="粗利率"
        value={value.grossMarginRate}
        min={MARGIN_MIN}
        max={MARGIN_MAX}
        step={MARGIN_STEP}
        unit="%"
        format={(v) => `${v}%`}
        onChange={(v) => onChange({ grossMarginRate: v })}
      />
      <NumberField
        id="cac"
        label="CAC（顧客獲得コスト）"
        value={value.cac}
        min={CAC_MIN}
        max={CAC_MAX}
        step={CAC_STEP}
        unit="円"
        format={formatYen}
        onChange={(v) => onChange({ cac: v })}
      />
      <NumberField
        id="customers"
        label="現在の顧客数"
        value={value.customers}
        min={CUSTOMERS_MIN}
        max={CUSTOMERS_MAX}
        step={CUSTOMERS_STEP}
        unit="人"
        format={(v) => `${v.toLocaleString("ja-JP")}人`}
        onChange={(v) => onChange({ customers: v })}
      />
    </div>
  );
}
