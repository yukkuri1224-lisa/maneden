"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CashFlowPoint } from "@/lib/calculators/real-estate-yield";
import { formatManYen } from "@/lib/format";

export default function CashFlowChart({
  schedule,
  deadCrossYear,
}: {
  schedule: CashFlowPoint[];
  deadCrossYear: number | null;
}) {
  const data = useMemo(
    () =>
      schedule.map((p) => ({
        year: p.year,
        元金返済: p.principal,
        減価償却: p.depreciation,
      })),
    [schedule],
  );

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 4, left: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="year"
            unit="年"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${Math.round(Number(v) / 10_000)}`}
            unit="万"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            formatter={(v) => formatManYen(Number(v))}
            labelFormatter={(l) => `${l}年目`}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {deadCrossYear !== null && (
            <ReferenceLine
              x={deadCrossYear}
              stroke="var(--chart-3)"
              strokeDasharray="4 4"
              label={{
                value: "デッドクロス",
                position: "top",
                fontSize: 10,
                fill: "var(--chart-2)",
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="元金返済"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="減価償却"
            stroke="var(--chart-4)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
