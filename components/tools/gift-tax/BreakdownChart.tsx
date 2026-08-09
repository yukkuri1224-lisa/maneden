"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { GiftTaxResult } from "@/lib/calculators/gift-tax";
import { formatYen } from "@/lib/format";

const COLORS = {
  net: "#4f46e5",
  tax: "#94a3b8",
};

export default function BreakdownChart({ result }: { result: GiftTaxResult }) {
  const data = [
    {
      name: "手元に残る額",
      value: Math.max(0, result.netAmount),
      color: COLORS.net,
    },
    { name: "贈与税", value: Math.max(0, result.taxAmount), color: COLORS.tax },
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
