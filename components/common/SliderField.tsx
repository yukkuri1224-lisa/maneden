"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

/**
 * スライダー＋数値入力が連動する共通の数値入力フィールド。
 */
export function SliderField({
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
  const clampNum = (n: number) =>
    Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min;

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
          onChange(clampNum(typeof v === "number" ? v : (v[0] ?? min)))
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
          onChange={(e) => onChange(clampNum(Number(e.target.value)))}
          className="tabular-nums"
        />
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
