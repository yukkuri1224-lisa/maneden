import type { MortgageInput } from "./types";

export const PRINCIPAL_MIN = 1_000_000;
export const PRINCIPAL_MAX = 200_000_000;
export const PRINCIPAL_STEP = 500_000;

export const RATE_MIN = 0;
export const RATE_MAX = 5;
export const RATE_STEP = 0.05;

export const YEARS_MIN = 1;
export const YEARS_MAX = 50;

export const PREPAYMENT_MIN = 0;
export const PREPAYMENT_MAX = 50_000_000;
export const PREPAYMENT_STEP = 500_000;

export const DEFAULT_INPUT: MortgageInput = {
  principal: 35_000_000,
  annualRatePercent: 1.0,
  years: 35,
  prepayment: 0,
  prepaymentAfterYears: 5,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: MortgageInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("p", String(input.principal));
  params.set("r", String(input.annualRatePercent));
  params.set("y", String(input.years));
  params.set("pp", String(input.prepayment));
  params.set("ppy", String(input.prepaymentAfterYears));
  return params;
}

export function decodeInputFromParams(params: URLSearchParams): MortgageInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const years = clamp(Math.round(num("y", d.years)), YEARS_MIN, YEARS_MAX);

  return {
    principal: clamp(num("p", d.principal), PRINCIPAL_MIN, PRINCIPAL_MAX),
    annualRatePercent: clamp(num("r", d.annualRatePercent), RATE_MIN, RATE_MAX),
    years,
    prepayment: clamp(num("pp", d.prepayment), PREPAYMENT_MIN, PREPAYMENT_MAX),
    prepaymentAfterYears: clamp(
      Math.round(num("ppy", d.prepaymentAfterYears)),
      1,
      years,
    ),
  };
}
