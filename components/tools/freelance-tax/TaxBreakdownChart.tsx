"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { FreelanceTaxResult } from "@/lib/calculators/freelance-tax";
import { formatYen } from "@/lib/format";

import { CHART_COLORS } from "./options";

export default function TaxBreakdownChart({
  result,
}: {
  result: FreelanceTaxResult;
}) {
  const data = [
    {
      name: "手取り",
      value: Math.max(0, result.netIncome),
      color: CHART_COLORS.netIncome,
    },
    { name: "所得税", value: result.incomeTax, color: CHART_COLORS.incomeTax },
    {
      name: "住民税",
      value: result.residentTax,
      color: CHART_COLORS.residentTax,
    },
    {
      name: "国民健康保険",
      value: result.nationalHealthInsurance,
      color: CHART_COLORS.nationalHealthInsurance,
    },
    {
      name: "国民年金",
      value: result.nationalPension,
      color: CHART_COLORS.nationalPension,
    },
    {
      name: "消費税",
      value: result.consumptionTax,
      color: CHART_COLORS.consumptionTax,
    },
  ].filter((d) => d.value > 0);

  return (
    <div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => formatYen(Number(v))}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
                aria-hidden
              />
              {d.name}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {formatYen(d.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
