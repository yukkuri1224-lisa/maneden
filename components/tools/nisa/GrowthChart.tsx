"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { NisaResult } from "@/lib/calculators/nisa";
import { formatManYen } from "@/lib/format";

export default function GrowthChart({ result }: { result: NisaResult }) {
  const data = useMemo(
    () =>
      result.timeline.map((p) => ({
        year: p.year,
        元本: p.principal,
        運用益: Math.max(0, p.balance - p.principal),
      })),
    [result.timeline],
  );

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 4, left: 4 }}
        >
          <defs>
            <linearGradient id="nisaPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="nisaGain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.45} />
            </linearGradient>
          </defs>
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
            width={44}
          />
          <Tooltip
            formatter={(v) => formatManYen(Number(v))}
            labelFormatter={(l) => `${l}年目`}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="元本"
            stackId="1"
            stroke="#4f46e5"
            strokeWidth={2}
            fill="url(#nisaPrincipal)"
          />
          <Area
            type="monotone"
            dataKey="運用益"
            stackId="1"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#nisaGain)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
