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
import type { GiftTaxInput, GiftType } from "@/lib/calculators/gift-tax";
import {
  AMOUNT_MAX,
  AMOUNT_MIN,
  AMOUNT_STEP,
} from "@/lib/calculators/gift-tax/schema";
import { formatManYen } from "@/lib/format";

import { GIFT_TYPE_OPTIONS } from "./options";

interface InputPanelProps {
  value: GiftTaxInput;
  onChange: (patch: Partial<GiftTaxInput>) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SliderField
        id="amount"
        label="1年間に受け取った贈与の合計"
        value={value.amount}
        min={AMOUNT_MIN}
        max={AMOUNT_MAX}
        step={AMOUNT_STEP}
        unit="円"
        format={(v) => formatManYen(v, 0)}
        hint="同じ年に複数の人からもらった額は合算します"
        onChange={(v) => onChange({ amount: v })}
      />

      <div className="space-y-2">
        <Label htmlFor="giftType">贈与の種類</Label>
        <Select
          value={value.giftType}
          onValueChange={(v) => onChange({ giftType: String(v) as GiftType })}
        >
          <SelectTrigger
            id="giftType"
            className="w-full"
            aria-label="贈与の種類"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GIFT_TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          直系尊属（親・祖父母）から18歳以上の子・孫への贈与は、税率が低い「特例贈与」になります。
        </p>
      </div>
    </div>
  );
}
