"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  calculateFreelanceTax,
  type FreelanceTaxInput,
} from "@/lib/calculators/freelance-tax";
import { REVENUE_MAX } from "@/lib/calculators/freelance-tax/schema";
import { formatManYen } from "@/lib/format";

import { CHART_COLORS } from "./options";

export default function RevenueSimulationChart({
  input,
}: {
  input: FreelanceTaxInput;
}) {
  const { data, current } = useMemo(() => {
    const expenseRatio = input.revenue > 0 ? input.expenses / input.revenue : 0;
    const points: { revenueMan: number; net: number }[] = [];
    for (let rev = 1_000_000; rev <= REVENUE_MAX; rev += 1_000_000) {
      const r = calculateFreelanceTax({
        ...input,
        revenue: rev,
        expenses: Math.round(rev * expenseRatio),
      });
      points.push({ revenueMan: rev / 10_000, net: r.netIncome });
    }
    const cur = calculateFreelanceTax(input);
    return {
      data: points,
      current: { revenueMan: input.revenue / 10_000, net: cur.netIncome },
    };
  }, [input]);

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 4, left: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="revenueMan"
            tickFormatter={(v) => `${v}`}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            unit="万"
          />
          <YAxis
            tickFormatter={(v) => `${Math.round(Number(v) / 10_000)}`}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={36}
            unit="万"
          />
          <Tooltip
            formatter={(v) => formatManYen(Number(v))}
            labelFormatter={(l) => `売上 ${l}万円`}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke={CHART_COLORS.netIncome}
            strokeWidth={2}
            dot={false}
          />
          <ReferenceDot
            x={current.revenueMan}
            y={current.net}
            r={5}
            fill={CHART_COLORS.netIncome}
            stroke="white"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
