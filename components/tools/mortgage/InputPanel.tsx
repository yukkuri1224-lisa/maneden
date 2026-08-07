"use client";

import { SliderField } from "@/components/common/SliderField";
import type { MortgageInput } from "@/lib/calculators/mortgage";
import {
  PREPAYMENT_MAX,
  PREPAYMENT_MIN,
  PREPAYMENT_STEP,
  PRINCIPAL_MAX,
  PRINCIPAL_MIN,
  PRINCIPAL_STEP,
  RATE_MAX,
  RATE_MIN,
  RATE_STEP,
  YEARS_MAX,
  YEARS_MIN,
} from "@/lib/calculators/mortgage/schema";
import { formatManYen } from "@/lib/format";

interface InputPanelProps {
  value: MortgageInput;
  onChange: (patch: Partial<MortgageInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SliderField
        id="principal"
        label="借入額"
        value={value.principal}
        min={PRINCIPAL_MIN}
        max={PRINCIPAL_MAX}
        step={PRINCIPAL_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ principal: v })}
      />
      <SliderField
        id="rate"
        label="年利（金利）"
        value={value.annualRatePercent}
        min={RATE_MIN}
        max={RATE_MAX}
        step={RATE_STEP}
        unit="%"
        format={(v) => `${v.toFixed(2)}%`}
        onChange={(v) => onChange({ annualRatePercent: v })}
      />
      <SliderField
        id="years"
        label="返済期間"
        value={value.years}
        min={YEARS_MIN}
        max={YEARS_MAX}
        step={1}
        unit="年"
        format={(v) => `${v}年`}
        onChange={(v) => onChange({ years: v })}
      />

      <div className="border-t pt-6">
        <SliderField
          id="prepayment"
          label="繰上返済額（任意）"
          value={value.prepayment}
          min={PREPAYMENT_MIN}
          max={PREPAYMENT_MAX}
          step={PREPAYMENT_STEP}
          unit="円"
          format={(v) => (v === 0 ? "なし" : formatManYen(v, 0))}
          hint="期間短縮型でシミュレーションします"
          onChange={(v) => onChange({ prepayment: v })}
        />
        {value.prepayment > 0 && (
          <div className="mt-6">
            <SliderField
              id="prepaymentAfterYears"
              label="繰上返済の時期"
              value={value.prepaymentAfterYears}
              min={1}
              max={value.years}
              step={1}
              unit="年後"
              format={(v) => `${v}年後`}
              onChange={(v) => onChange({ prepaymentAfterYears: v })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
