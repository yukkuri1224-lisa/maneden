"use client";

import { SliderField } from "@/components/common/SliderField";
import type { HourlyWageInput } from "@/lib/calculators/hourly-wage";
import {
  ANNUAL_MAX,
  ANNUAL_MIN,
  ANNUAL_STEP,
  DAYS_PER_WEEK_MAX,
  DAYS_PER_WEEK_MIN,
  HOURLY_MAX,
  HOURLY_MIN,
  HOURLY_STEP,
  HOURS_PER_DAY_MAX,
  HOURS_PER_DAY_MIN,
  HOURS_PER_DAY_STEP,
} from "@/lib/calculators/hourly-wage/schema";
import { formatManYen, formatYen } from "@/lib/format";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "hourly-to-annual", label: "時給 → 年収" },
  { id: "annual-to-hourly", label: "年収 → 時給" },
] as const;

interface InputPanelProps {
  value: HourlyWageInput;
  onChange: (patch: Partial<HourlyWageInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <div
        role="group"
        aria-label="変換の向き"
        className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
      >
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange({ mode: mode.id })}
            aria-pressed={value.mode === mode.id}
            className={cn(
              "rounded-md py-2 text-sm font-medium transition-colors",
              value.mode === mode.id
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {value.mode === "hourly-to-annual" ? (
        <SliderField
          id="hourly"
          label="時給"
          value={value.hourlyWage}
          min={HOURLY_MIN}
          max={HOURLY_MAX}
          step={HOURLY_STEP}
          unit="円"
          format={(v) => formatYen(v)}
          onChange={(v) => onChange({ hourlyWage: v })}
        />
      ) : (
        <SliderField
          id="annual"
          label="年収（額面）"
          value={value.annualIncome}
          min={ANNUAL_MIN}
          max={ANNUAL_MAX}
          step={ANNUAL_STEP}
          unit="円"
          format={(v) => formatManYen(v, 0)}
          hint="税・社会保険を引く前の額面（ボーナス込み）"
          onChange={(v) => onChange({ annualIncome: v })}
        />
      )}

      <SliderField
        id="hoursPerDay"
        label="1日の労働時間"
        value={value.hoursPerDay}
        min={HOURS_PER_DAY_MIN}
        max={HOURS_PER_DAY_MAX}
        step={HOURS_PER_DAY_STEP}
        unit="時間"
        format={(v) => `${v}時間`}
        onChange={(v) => onChange({ hoursPerDay: v })}
      />

      <SliderField
        id="daysPerWeek"
        label="週の労働日数"
        value={value.daysPerWeek}
        min={DAYS_PER_WEEK_MIN}
        max={DAYS_PER_WEEK_MAX}
        step={1}
        unit="日"
        format={(v) => `${v}日`}
        onChange={(v) => onChange({ daysPerWeek: v })}
      />
    </div>
  );
}
