import type { RetirementTaxInput } from "./types";

export const AMOUNT_MIN = 0;
export const AMOUNT_MAX = 100_000_000;
export const AMOUNT_STEP = 500_000;

export const YEARS_MIN = 1;
export const YEARS_MAX = 50;

export const DEFAULT_INPUT: RetirementTaxInput = {
  amount: 20_000_000,
  yearsOfService: 30,
  isExecutive: false,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(
  input: RetirementTaxInput,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("amt", String(input.amount));
  params.set("yrs", String(input.yearsOfService));
  params.set("exec", input.isExecutive ? "1" : "0");
  return params;
}

export function decodeInputFromParams(
  params: URLSearchParams,
): RetirementTaxInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  return {
    amount: clamp(num("amt", d.amount), AMOUNT_MIN, AMOUNT_MAX),
    yearsOfService: clamp(
      Math.round(num("yrs", d.yearsOfService)),
      YEARS_MIN,
      YEARS_MAX,
    ),
    isExecutive: params.get("exec") === "1",
  };
}
