import type { HourlyWageInput } from "./types";

export const HOURLY_MIN = 0;
export const HOURLY_MAX = 20_000;
export const HOURLY_STEP = 50;

export const ANNUAL_MIN = 0;
export const ANNUAL_MAX = 30_000_000;
export const ANNUAL_STEP = 100_000;

export const HOURS_PER_DAY_MIN = 1;
export const HOURS_PER_DAY_MAX = 16;
export const HOURS_PER_DAY_STEP = 0.5;

export const DAYS_PER_WEEK_MIN = 1;
export const DAYS_PER_WEEK_MAX = 7;

export const DEFAULT_INPUT: HourlyWageInput = {
  mode: "hourly-to-annual",
  hourlyWage: 1_200,
  annualIncome: 4_000_000,
  hoursPerDay: 8,
  daysPerWeek: 5,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: HourlyWageInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("mode", input.mode === "annual-to-hourly" ? "a2h" : "h2a");
  params.set("hw", String(input.hourlyWage));
  params.set("ai", String(input.annualIncome));
  params.set("hpd", String(input.hoursPerDay));
  params.set("dpw", String(input.daysPerWeek));
  return params;
}

export function decodeInputFromParams(
  params: URLSearchParams,
): HourlyWageInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  return {
    mode:
      params.get("mode") === "a2h" ? "annual-to-hourly" : "hourly-to-annual",
    hourlyWage: clamp(num("hw", d.hourlyWage), HOURLY_MIN, HOURLY_MAX),
    annualIncome: clamp(num("ai", d.annualIncome), ANNUAL_MIN, ANNUAL_MAX),
    hoursPerDay: clamp(
      num("hpd", d.hoursPerDay),
      HOURS_PER_DAY_MIN,
      HOURS_PER_DAY_MAX,
    ),
    daysPerWeek: clamp(
      Math.round(num("dpw", d.daysPerWeek)),
      DAYS_PER_WEEK_MIN,
      DAYS_PER_WEEK_MAX,
    ),
  };
}
