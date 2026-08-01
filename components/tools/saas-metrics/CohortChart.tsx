"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  projectCohort,
  type SaasMetricsInput,
} from "@/lib/calculators/saas-metrics";
import { formatManYen } from "@/lib/format";

export default function CohortChart({ input }: { input: SaasMetricsInput }) {
  const data = useMemo(
    () =>
      projectCohort(input, 36).map((p) => ({
        month: p.month,
        累積粗利: p.cumulativeGrossProfit,
        獲得コスト: p.totalCac,
      })),
    [input],
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
            dataKey="month"
            unit="月"
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
            labelFormatter={(l) => `${l}ヶ月目`}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="累積粗利"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="獲得コスト"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
