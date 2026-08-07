import type { HourlyWageInput, HourlyWageResult } from "./types";

/** 年間の週数（概算） */
const WEEKS_PER_YEAR = 52;

/**
 * 時給と年収を相互に換算する。
 * 年間労働時間 = 1日の労働時間 × 週の労働日数 × 52週 を基準にした概算。
 * ここで扱うのはすべて「額面」（税・社会保険を差し引く前）。
 */
export function calculateHourlyWage(input: HourlyWageInput): HourlyWageResult {
  const hoursPerDay = Math.max(0, input.hoursPerDay);
  const daysPerWeek = Math.max(0, input.daysPerWeek);
  const weeklyHours = hoursPerDay * daysPerWeek;
  const annualHours = weeklyHours * WEEKS_PER_YEAR;

  let hourlyWage: number;
  let annualIncome: number;

  if (input.mode === "hourly-to-annual") {
    hourlyWage = Math.max(0, input.hourlyWage);
    annualIncome = hourlyWage * annualHours;
  } else {
    annualIncome = Math.max(0, input.annualIncome);
    hourlyWage = annualHours > 0 ? annualIncome / annualHours : 0;
  }

  return {
    hourlyWage: Math.round(hourlyWage),
    dailyWage: Math.round(hourlyWage * hoursPerDay),
    weeklyWage: Math.round(hourlyWage * weeklyHours),
    monthlyWage: Math.round(annualIncome / 12),
    annualIncome: Math.round(annualIncome),
    weeklyHours,
    annualHours,
  };
}

export * from "./types";
