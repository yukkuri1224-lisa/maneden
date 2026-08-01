"use client";

import { SliderField } from "@/components/common/SliderField";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  BuildingStructure,
  RealEstateInput,
} from "@/lib/calculators/real-estate-yield";
import {
  BUILDING_RATIO_MAX,
  BUILDING_RATIO_MIN,
  BUILDING_RATIO_STEP,
  EXPENSE_RATE_MAX,
  EXPENSE_RATE_MIN,
  EXPENSE_RATE_STEP,
  INTEREST_MAX,
  INTEREST_MIN,
  INTEREST_STEP,
  LOAN_MAX,
  LOAN_MIN,
  LOAN_STEP,
  LOAN_YEARS_MAX,
  LOAN_YEARS_MIN,
  LOAN_YEARS_STEP,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  RENT_MAX,
  RENT_MIN,
  RENT_STEP,
} from "@/lib/calculators/real-estate-yield/schema";
import { formatManYen } from "@/lib/format";

import { STRUCTURE_OPTIONS } from "./options";

interface InputPanelProps {
  value: RealEstateInput;
  onChange: (patch: Partial<RealEstateInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SliderField
        id="price"
        label="物件価格"
        value={value.propertyPrice}
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ propertyPrice: v })}
      />
      <SliderField
        id="rent"
        label="年間家賃収入（満室）"
        value={value.annualRent}
        min={RENT_MIN}
        max={RENT_MAX}
        step={RENT_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ annualRent: v })}
      />
      <SliderField
        id="exp"
        label="諸経費率（家賃に対する）"
        value={value.expenseRate}
        min={EXPENSE_RATE_MIN}
        max={EXPENSE_RATE_MAX}
        step={EXPENSE_RATE_STEP}
        unit="%"
        format={(v) => `${v}%`}
        hint="管理費・修繕・固定資産税などの目安"
        onChange={(v) => onChange({ expenseRate: v })}
      />
      <SliderField
        id="bld"
        label="建物価格の割合"
        value={value.buildingRatio}
        min={BUILDING_RATIO_MIN}
        max={BUILDING_RATIO_MAX}
        step={BUILDING_RATIO_STEP}
        unit="%"
        format={(v) => `${v}%`}
        hint="減価償却の対象（残りは土地）"
        onChange={(v) => onChange({ buildingRatio: v })}
      />

      <div className="space-y-2">
        <Label>建物構造</Label>
        <Select
          value={value.structure}
          onValueChange={(v) =>
            onChange({ structure: String(v) as BuildingStructure })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STRUCTURE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <SliderField
        id="loan"
        label="借入額"
        value={value.loanAmount}
        min={LOAN_MIN}
        max={LOAN_MAX}
        step={LOAN_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ loanAmount: v })}
      />
      <SliderField
        id="rate"
        label="借入金利"
        value={value.interestRate}
        min={INTEREST_MIN}
        max={INTEREST_MAX}
        step={INTEREST_STEP}
        unit="%"
        format={(v) => `${v}%`}
        onChange={(v) => onChange({ interestRate: v })}
      />
      <SliderField
        id="years"
        label="返済期間"
        value={value.loanYears}
        min={LOAN_YEARS_MIN}
        max={LOAN_YEARS_MAX}
        step={LOAN_YEARS_STEP}
        unit="年"
        format={(v) => `${v}年`}
        onChange={(v) => onChange({ loanYears: v })}
      />
    </div>
  );
}
