"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type {
  FreelanceTaxInput,
  FreelanceTaxResult,
} from "@/lib/calculators/freelance-tax";
import { formatYen } from "@/lib/format";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export function BreakdownDetails({
  result,
  input,
}: {
  result: FreelanceTaxResult;
  input: FreelanceTaxInput;
}) {
  return (
    <Accordion className="rounded-xl border px-4">
      <AccordionItem value="business">
        <AccordionTrigger>事業所得の計算</AccordionTrigger>
        <AccordionContent>
          <Row label="年間売上" value={formatYen(input.revenue)} />
          <Row label="− 経費" value={formatYen(input.expenses)} />
          <Row
            label="− 青色申告特別控除"
            value={formatYen(input.blueReturnDeduction)}
          />
          <Row label="＝ 事業所得" value={formatYen(result.businessIncome)} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="income-tax">
        <AccordionTrigger>
          所得税（{formatYen(result.incomeTax)}）
        </AccordionTrigger>
        <AccordionContent>
          <Row
            label="所得控除の合計"
            value={formatYen(result.totalDeductions)}
          />
          <Row
            label="課税所得（1000円未満切捨）"
            value={formatYen(result.taxableIncome)}
          />
          <Row
            label="うち復興特別所得税"
            value={formatYen(result.reconstructionTax)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            所得税は速算表（累進税率）で算出し、復興特別所得税（2.1%）を加算しています。
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="resident-tax">
        <AccordionTrigger>
          住民税（{formatYen(result.residentTax)}）
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-xs text-muted-foreground">
            所得割（課税所得 ×
            10%）に、均等割・森林環境税を加えた概算です。自治体により異なります。
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="insurance">
        <AccordionTrigger>
          社会保険（
          {formatYen(result.nationalHealthInsurance + result.nationalPension)}）
        </AccordionTrigger>
        <AccordionContent>
          <Row
            label="国民健康保険"
            value={formatYen(result.nationalHealthInsurance)}
          />
          <Row label="国民年金" value={formatYen(result.nationalPension)} />
          <p className="mt-2 text-xs text-muted-foreground">
            国保は単身世帯・全国平均的なモデルの概算です（自治体差が大きい項目です）。
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="consumption">
        <AccordionTrigger>
          消費税（{formatYen(result.consumptionTax)}）
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-xs text-muted-foreground">
            {input.invoiceStatus === "exempt"
              ? `免税事業者のため納付は0円です。インボイス登録（2割特例）した場合は約 ${formatYen(
                  result.invoiceImpact,
                )} の負担になります。`
              : "選択した課税方式に基づく納付額の概算です。"}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
