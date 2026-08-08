"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { MortgageResult } from "@/lib/calculators/mortgage";
import { formatManYen } from "@/lib/format";

const COLORS = {
  principal: "#4f46e5",
  interest: "#38bdf8",
};

export default function BreakdownChart({ result }: { result: MortgageResult }) {
  const principal = Math.max(0, result.totalPayment - result.totalInterest);
  const data = [
    { name: "元金", value: principal, color: COLORS.principal },
    {
      name: "利息",
      value: Math.max(0, result.totalInterest),
      color: COLORS.interest,
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
              formatter={(v) => formatManYen(Number(v), 0)}
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
              {formatManYen(d.value, 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
