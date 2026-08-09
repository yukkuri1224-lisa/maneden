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
import {
  IDECO_MONTHLY_CAPS,
  type IdecoCategory,
  type IdecoInput,
} from "@/lib/calculators/ideco";
import {
  AGE_MAX,
  AGE_MIN,
  CONTRIBUTION_MIN,
  CONTRIBUTION_STEP,
  INCOME_MAX,
  INCOME_MIN,
  INCOME_STEP,
} from "@/lib/calculators/ideco/schema";
import { formatManYen } from "@/lib/format";

import { CATEGORY_OPTIONS } from "./options";

interface InputPanelProps {
  value: IdecoInput;
  onChange: (patch: Partial<IdecoInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  const contributionCap = IDECO_MONTHLY_CAPS[value.category];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">加入区分</Label>
        <Select
          value={value.category}
          onValueChange={(v) =>
            onChange({ category: String(v) as IdecoCategory })
          }
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          勤務先の年金制度で毎月の掛金上限が変わります。
        </p>
      </div>

      <SliderField
        id="income"
        label="年収（額面）"
        value={value.income}
        min={INCOME_MIN}
        max={INCOME_MAX}
        step={INCOME_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ income: v })}
      />

      <SliderField
        id="contribution"
        label="毎月の掛金"
        value={value.monthlyContribution}
        min={CONTRIBUTION_MIN}
        max={contributionCap}
        step={CONTRIBUTION_STEP}
        unit="円"
        format={(v) => `${v.toLocaleString()}円`}
        hint={`この区分の上限は月 ${contributionCap.toLocaleString()}円です`}
        onChange={(v) => onChange({ monthlyContribution: v })}
      />

      <SliderField
        id="age"
        label="現在の年齢"
        value={value.age}
        min={AGE_MIN}
        max={AGE_MAX}
        step={1}
        unit="歳"
        format={(v) => `${v}歳`}
        hint="60歳までの積立期間の計算に使います"
        onChange={(v) => onChange({ age: v })}
      />
    </div>
  );
}
