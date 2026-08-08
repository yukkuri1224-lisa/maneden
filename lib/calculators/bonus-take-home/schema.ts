import type { BonusTakeHomeInput } from "./types";

export const BONUS_MIN = 0;
export const BONUS_MAX = 10_000_000;
export const BONUS_STEP = 50_000;

export const MONTHLY_MIN = 0;
export const MONTHLY_MAX = 2_000_000;
export const MONTHLY_STEP = 10_000;

export const MAX_DEPENDENTS = 5;

export const DEFAULT_INPUT: BonusTakeHomeInput = {
  bonus: 500_000,
  monthlySalary: 300_000,
  isOver40: false,
  dependents: 0,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(
  input: BonusTakeHomeInput,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("b", String(input.bonus));
  params.set("ms", String(input.monthlySalary));
  params.set("o40", input.isOver40 ? "1" : "0");
  params.set("dep", String(input.dependents));
  return params;
}

export function decodeInputFromParams(
  params: URLSearchParams,
): BonusTakeHomeInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  return {
    bonus: clamp(num("b", d.bonus), BONUS_MIN, BONUS_MAX),
    monthlySalary: clamp(num("ms", d.monthlySalary), MONTHLY_MIN, MONTHLY_MAX),
    isOver40: params.get("o40") === "1",
    dependents: clamp(Math.round(num("dep", d.dependents)), 0, MAX_DEPENDENTS),
  };
}
