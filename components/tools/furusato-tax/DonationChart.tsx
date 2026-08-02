"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  selfPayment,
  type FurusatoResult,
} from "@/lib/calculators/furusato-tax";
import { formatYen } from "@/lib/format";

export default function DonationChart({ result }: { result: FurusatoResult }) {
  const data = useMemo(() => {
    const maxDonation = Math.max(result.donationLimit * 1.6, 20_000);
    const step = Math.max(Math.round(maxDonation / 40 / 1000) * 1000, 1000);
    const points: { donationMan: number; 自己負担: number }[] = [];
    for (let d = 0; d <= maxDonation; d += step) {
      points.push({
        donationMan: d / 10_000,
        自己負担: selfPayment(
          d,
          result.residentTaxIncomeLevy,
          result.incomeTaxRate,
        ),
      });
    }
    return points;
  }, [result]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 4, left: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="donationMan"
            unit="万"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}`}
            unit="千"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            formatter={(v) => formatYen(Number(v))}
            labelFormatter={(l) => `寄付 ${l}万円`}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          {result.donationLimit > 0 && (
            <ReferenceLine
              x={result.donationLimit / 10_000}
              stroke="#4f46e5"
              strokeDasharray="4 4"
              label={{
                value: "上限",
                position: "top",
                fontSize: 10,
                fill: "#4f46e5",
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="自己負担"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
