import { describe, expect, it } from "vitest";

import {
  calculateHourlyWage,
  type HourlyWageInput,
} from "@/lib/calculators/hourly-wage";

function base(overrides: Partial<HourlyWageInput> = {}): HourlyWageInput {
  return {
    mode: "hourly-to-annual",
    hourlyWage: 1_200,
    annualIncome: 4_000_000,
    hoursPerDay: 8,
    daysPerWeek: 5,
    ...overrides,
  };
}

describe("calculateHourlyWage（時給→年収）", () => {
  const r = calculateHourlyWage(base());

  it("年間労働時間 = 8h × 5日 × 52週 = 2080h", () => {
    expect(r.weeklyHours).toBe(40);
    expect(r.annualHours).toBe(2080);
  });

  it("時給1,200円 → 年収2,496,000円", () => {
    expect(r.annualIncome).toBe(2_496_000);
    expect(r.monthlyWage).toBe(208_000);
    expect(r.weeklyWage).toBe(48_000);
    expect(r.dailyWage).toBe(9_600);
  });
});

describe("calculateHourlyWage（年収→時給）", () => {
  it("年収4,160,000円・週40h → 時給2,000円", () => {
    const r = calculateHourlyWage(
      base({ mode: "annual-to-hourly", annualIncome: 4_160_000 }),
    );
    expect(r.hourlyWage).toBe(2_000);
  });

  it("労働時間が0でも破綻しない（0円・有限値）", () => {
    const r = calculateHourlyWage(
      base({ mode: "annual-to-hourly", hoursPerDay: 0 }),
    );
    expect(r.hourlyWage).toBe(0);
    expect(Number.isFinite(r.hourlyWage)).toBe(true);
  });
});
