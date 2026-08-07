"use client";

import { SliderField } from "@/components/common/SliderField";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { RetirementTaxInput } from "@/lib/calculators/retirement-tax";
import {
  AMOUNT_MAX,
  AMOUNT_MIN,
  AMOUNT_STEP,
  YEARS_MAX,
  YEARS_MIN,
} from "@/lib/calculators/retirement-tax/schema";
import { formatManYen } from "@/lib/format";

interface InputPanelProps {
  value: RetirementTaxInput;
  onChange: (patch: Partial<RetirementTaxInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SliderField
        id="amount"
        label="退職金の額"
        value={value.amount}
        min={AMOUNT_MIN}
        max={AMOUNT_MAX}
        step={AMOUNT_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ amount: v })}
      />
      <SliderField
        id="years"
        label="勤続年数"
        value={value.yearsOfService}
        min={YEARS_MIN}
        max={YEARS_MAX}
        step={1}
        unit="年"
        format={(v) => `${v}年`}
        hint="1年未満は切り上げて計算します"
        onChange={(v) => onChange({ yearsOfService: v })}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <Label htmlFor="exec">役員等である</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            勤続5年以下の役員等は1/2課税の対象外
          </p>
        </div>
        <Switch
          id="exec"
          checked={value.isExecutive}
          onCheckedChange={(checked) => onChange({ isExecutive: checked })}
        />
      </div>
    </div>
  );
}
