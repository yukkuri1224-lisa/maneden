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
import type { SalaryTakeHomeInput } from "@/lib/calculators/salary-take-home";
import {
  INCOME_MAX,
  INCOME_MIN,
  INCOME_STEP,
  MAX_DEPENDENTS,
} from "@/lib/calculators/salary-take-home/schema";
import { formatManYen } from "@/lib/format";

interface InputPanelProps {
  value: SalaryTakeHomeInput;
  onChange: (patch: Partial<SalaryTakeHomeInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SliderField
        id="income"
        label="年収（額面）"
        value={value.income}
        min={INCOME_MIN}
        max={INCOME_MAX}
        step={INCOME_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        hint="ボーナス込みの年間総支給額"
        onChange={(v) => onChange({ income: v })}
      />

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="over40">40歳以上（介護保険）</Label>
        <Switch
          id="over40"
          checked={value.isOver40}
          onCheckedChange={(checked) => onChange({ isOver40: checked })}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="spouse">配偶者控除</Label>
        <Switch
          id="spouse"
          checked={value.hasSpouse}
          onCheckedChange={(checked) => onChange({ hasSpouse: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label>扶養家族の数</Label>
        <Select
          value={String(value.dependents)}
          onValueChange={(v) => onChange({ dependents: Number(String(v)) })}
        >
          <SelectTrigger className="w-full">
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
