"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { InheritanceTaxResult } from "@/lib/calculators/inheritance-tax";
import { formatOkuMan } from "@/lib/format";

const COLORS = {
  net: "#4f46e5",
  tax: "#94a3b8",
};

export default function BreakdownChart({
  result,
}: {
  result: InheritanceTaxResult;
}) {
  const data = [
    {
      name: "相続人が受け取る額",
      value: Math.max(0, result.netInheritance),
      color: COLORS.net,
    },
    {
      name: "相続税（総額）",
      value: Math.max(0, result.totalTax),
      color: COLORS.tax,
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
              formatter={(v) => formatOkuMan(Number(v))}
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
              {formatOkuMan(d.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
