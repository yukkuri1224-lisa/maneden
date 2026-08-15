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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FurusatoInput, IncomeType } from "@/lib/calculators/furusato-tax";
import {
  INCOME_MAX,
  INCOME_MIN,
  INCOME_STEP,
  MAX_DEPENDENTS,
  SOCIAL_MAX,
  SOCIAL_MIN,
  SOCIAL_STEP,
} from "@/lib/calculators/furusato-tax/schema";
import { formatManYen } from "@/lib/format";

interface InputPanelProps {
  value: FurusatoInput;
  onChange: (patch: Partial<FurusatoInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  const isSalary = value.incomeType === "salary";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>収入タイプ</Label>
        <Tabs
          value={value.incomeType}
          onValueChange={(v) =>
            onChange({ incomeType: String(v) as IncomeType })
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="salary">給与（会社員）</TabsTrigger>
            <TabsTrigger value="business">事業（フリーランス）</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <SliderField
        id="inc"
        label={isSalary ? "給与年収（額面）" : "事業所得（経費差引後）"}
        value={value.income}
        min={INCOME_MIN}
        max={INCOME_MAX}
        step={INCOME_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        onChange={(v) => onChange({ income: v })}
      />

      <SliderField
        id="soc"
        label="社会保険料（年間）"
        value={value.socialInsurance}
        min={SOCIAL_MIN}
        max={SOCIAL_MAX}
        step={SOCIAL_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        hint={isSalary ? "給与なら年収の約15%が目安" : "国民健康保険＋年金など"}
        onChange={(v) => onChange({ socialInsurance: v })}
      />

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="sp">配偶者控除</Label>
        <Switch
          id="sp"
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
