"use client";

import { SliderField } from "@/components/common/SliderField";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  BusinessType,
  Purpose,
  SubsidyInput,
} from "@/lib/calculators/subsidy-finder";
import {
  EMPLOYEES_MAX,
  EMPLOYEES_MIN,
  EMPLOYEES_STEP,
  INVESTMENT_MAX,
  INVESTMENT_MIN,
  INVESTMENT_STEP,
} from "@/lib/calculators/subsidy-finder/schema";
import { formatManYen } from "@/lib/format";
import { cn } from "@/lib/utils";

import { PURPOSE_OPTIONS } from "./options";

interface InputPanelProps {
  value: SubsidyInput;
  onChange: (patch: Partial<SubsidyInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  const togglePurpose = (purpose: Purpose) => {
    const has = value.purposes.includes(purpose);
    const next = has
      ? value.purposes.filter((p) => p !== purpose)
      : [...value.purposes, purpose];
    onChange({ purposes: next });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>事業形態</Label>
        <Tabs
          value={value.businessType}
          onValueChange={(v) =>
            onChange({ businessType: String(v) as BusinessType })
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="corporation">法人</TabsTrigger>
            <TabsTrigger value="sole-proprietor">個人事業主</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <SliderField
        id="emp"
        label="従業員数"
        value={value.employees}
        min={EMPLOYEES_MIN}
        max={EMPLOYEES_MAX}
        step={EMPLOYEES_STEP}
        unit="人"
        format={(v) => `${v}人`}
        onChange={(v) => onChange({ employees: v })}
      />

      <SliderField
        id="inv"
        label="投資予定額"
        value={value.investmentAmount}
        min={INVESTMENT_MIN}
        max={INVESTMENT_MAX}
        step={INVESTMENT_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ investmentAmount: v })}
      />

      <div className="space-y-2">
        <Label>事業目的（複数選択可）</Label>
        <div className="flex flex-wrap gap-2">
          {PURPOSE_OPTIONS.map((option) => {
            const active = value.purposes.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => togglePurpose(option.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
