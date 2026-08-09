"use client";

import { SliderField } from "@/components/common/SliderField";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { InheritanceTaxInput } from "@/lib/calculators/inheritance-tax";
import {
  CHILDREN_MAX,
  CHILDREN_MIN,
  ESTATE_MAX,
  ESTATE_MIN,
  ESTATE_STEP,
} from "@/lib/calculators/inheritance-tax/schema";
import { formatOkuMan } from "@/lib/format";

interface InputPanelProps {
  value: InheritanceTaxInput;
  onChange: (patch: Partial<InheritanceTaxInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SliderField
        id="estate"
        label="遺産の総額"
        value={value.estate}
        min={ESTATE_MIN}
        max={ESTATE_MAX}
        step={ESTATE_STEP}
        unit="円"
        format={(v) => formatOkuMan(v)}
        hint="借金・葬式費用を差し引いた後の金額"
        onChange={(v) => onChange({ estate: v })}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <Label htmlFor="spouse">配偶者がいる</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            配偶者の税額軽減の対象になります
          </p>
        </div>
        <Switch
          id="spouse"
          checked={value.hasSpouse}
          onCheckedChange={(checked) => onChange({ hasSpouse: checked })}
        />
      </div>

      <SliderField
        id="children"
        label="子の人数"
        value={value.children}
        min={CHILDREN_MIN}
        max={CHILDREN_MAX}
        step={1}
        unit="人"
        format={(v) => `${v}人`}
        onChange={(v) => onChange({ children: v })}
      />
    </div>
  );
}
