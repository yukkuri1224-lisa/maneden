import type { NisaInput } from "./types";

export const INITIAL_MIN = 0;
export const INITIAL_MAX = 18_000_000;
export const INITIAL_STEP = 100_000;

export const MONTHLY_MIN = 0;
export const MONTHLY_MAX = 300_000;
export const MONTHLY_STEP = 5_000;

export const RATE_MIN = 0;
export const RATE_MAX = 10;
export const RATE_STEP = 0.5;

export const YEARS_MIN = 1;
export const YEARS_MAX = 40;

export const DEFAULT_INPUT: NisaInput = {
  initialLumpSum: 0,
  monthlyContribution: 30_000,
  annualReturnPercent: 5,
  years: 20,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: NisaInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("init", String(input.initialLumpSum));
  params.set("m", String(input.monthlyContribution));
  params.set("r", String(input.annualReturnPercent));
  params.set("y", String(input.years));
  return params;
}

export function decodeInputFromParams(params: URLSearchParams): NisaInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  return {
    initialLumpSum: clamp(
      num("init", d.initialLumpSum),
      INITIAL_MIN,
      INITIAL_MAX,
    ),
    monthlyContribution: clamp(
      num("m", d.monthlyContribution),
      MONTHLY_MIN,
      MONTHLY_MAX,
    ),
    annualReturnPercent: clamp(
      num("r", d.annualReturnPercent),
      RATE_MIN,
      RATE_MAX,
    ),
    years: clamp(Math.round(num("y", d.years)), YEARS_MIN, YEARS_MAX),
  };
}
