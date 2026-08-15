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
import { Switch } from "@/components/ui/switch";
import type { BonusTakeHomeInput } from "@/lib/calculators/bonus-take-home";
import {
  BONUS_MAX,
  BONUS_MIN,
  BONUS_STEP,
  MAX_DEPENDENTS,
  MONTHLY_MAX,
  MONTHLY_MIN,
  MONTHLY_STEP,
} from "@/lib/calculators/bonus-take-home/schema";
import { formatManYen } from "@/lib/format";

interface InputPanelProps {
  value: BonusTakeHomeInput;
  onChange: (patch: Partial<BonusTakeHomeInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SliderField
        id="bonus"
        label="賞与（額面）"
        value={value.bonus}
        min={BONUS_MIN}
        max={BONUS_MAX}
        step={BONUS_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ bonus: v })}
      />
      <SliderField
        id="monthlySalary"
        label="前月の給与（額面）"
        value={value.monthlySalary}
        min={MONTHLY_MIN}
        max={MONTHLY_MAX}
        step={MONTHLY_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        hint="所得税の概算に使います"
        onChange={(v) => onChange({ monthlySalary: v })}
      />

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="over40">40歳以上（介護保険）</Label>
        <Switch
          id="over40"
          checked={value.isOver40}
          onCheckedChange={(checked) => onChange({ isOver40: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label>扶養家族の数</Label>
        <Select
          value={String(value.dependents)}
          onValueChange={(v) => onChange({ dependents: Number(String(v)) })}
        >
          <SelectTrigger className="w-full" aria-label="扶養家族の数">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: MAX_DEPENDENTS + 1 }, (_, i) => (
              <SelectItem key={i} value={String(i)}>
                {i}人
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
