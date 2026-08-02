"use client";

import { DetailsSection } from "@/components/common/DetailsSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  BlueReturnDeduction,
  BusinessCategory,
  FreelanceTaxInput,
  InvoiceStatus,
} from "@/lib/calculators/freelance-tax";
import {
  AMOUNT_STEP,
  MAX_DEPENDENTS,
  REVENUE_MAX,
  REVENUE_MIN,
  SPOUSE_INCOME_MAX,
} from "@/lib/calculators/freelance-tax/schema";
import { formatManYen } from "@/lib/format";
import { parseLooseNumber } from "@/lib/parse";

import { BLUE_OPTIONS, CATEGORY_OPTIONS, INVOICE_OPTIONS } from "./options";

interface InputPanelProps {
  value: FreelanceTaxInput;
  onChange: (patch: Partial<FreelanceTaxInput>) => void;
}

function toInt(raw: string, min: number, max: number): number {
  const n = parseLooseNumber(raw);
  if (n === null) return min;
  return Math.min(Math.max(Math.round(n), min), max);
}

function AmountField({
  id,
  label,
  amount,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  amount: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm font-semibold tabular-nums">
          {formatManYen(amount, 0)}
        </span>
      </div>
      <Slider
        value={[amount]}
        min={min}
        max={max}
        step={AMOUNT_STEP}
        aria-label={label}
        onValueChange={(v) =>
          onChange(typeof v === "number" ? v : (v[0] ?? min))
        }
      />
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={amount}
        onChange={(e) => onChange(toInt(e.target.value, min, max))}
        className="tabular-nums"
      />
    </div>
  );
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <AmountField
        id="revenue"
        label="年間売上（税込）"
        amount={value.revenue}
        min={REVENUE_MIN}
        max={REVENUE_MAX}
        onChange={(v) =>
          onChange({ revenue: v, expenses: Math.min(value.expenses, v) })
        }
      />

      <AmountField
        id="expenses"
        label="年間経費"
        amount={value.expenses}
        min={0}
        max={value.revenue}
        onChange={(v) => onChange({ expenses: v })}
      />

      <div className="space-y-2">
        <Label>青色申告特別控除</Label>
        <Select
          value={String(value.blueReturnDeduction)}
          onValueChange={(v) =>
            onChange({
              blueReturnDeduction: Number(String(v)) as BlueReturnDeduction,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BLUE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={String(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          電子申告＋複式簿記なら65万円。白色申告は0円です。
        </p>
      </div>

      <DetailsSection title="詳細設定（インボイス・扶養・配偶者など）">
        <div className="space-y-2">
          <Label>インボイス制度の区分</Label>
          <Tabs
            value={value.invoiceStatus}
            onValueChange={(v) =>
              onChange({ invoiceStatus: String(v) as InvoiceStatus })
            }
          >
            <TabsList className="grid w-full grid-cols-4">
              {INVOICE_OPTIONS.map((o) => (
                <TabsTrigger key={o.value} value={o.value}>
                  {o.short}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {value.invoiceStatus === "simplified" && (
            <Select
              value={String(value.businessCategory)}
              onValueChange={(v) =>
                onChange({
                  businessCategory: Number(String(v)) as BusinessCategory,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={String(o.value)}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <p className="text-xs text-muted-foreground">
            免税事業者は消費税の納付が不要です。
          </p>
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

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="spouse">配偶者控除</Label>
          <Switch
            id="spouse"
            checked={value.hasSpouse}
            onCheckedChange={(checked) => onChange({ hasSpouse: checked })}
          />
        </div>

        {value.hasSpouse && (
          <div className="space-y-2">
            <Label htmlFor="spouseIncome">配偶者の年間所得</Label>
            <Input
              id="spouseIncome"
              type="text"
              inputMode="numeric"
              value={value.spouseIncome}
              onChange={(e) =>
                onChange({
                  spouseIncome: toInt(e.target.value, 0, SPOUSE_INCOME_MAX),
                })
              }
              className="tabular-nums"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="over40">40歳以上（介護保険）</Label>
          <Switch
            id="over40"
            checked={value.isOver40}
            onCheckedChange={(checked) => onChange({ isOver40: checked })}
          />
        </div>
      </DetailsSection>
    </div>
  );
}
