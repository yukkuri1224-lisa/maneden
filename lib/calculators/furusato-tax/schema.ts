import type { FurusatoInput, IncomeType } from "./types";

export const INCOME_MIN = 0;
export const INCOME_MAX = 30_000_000;
export const INCOME_STEP = 100_000;

export const SOCIAL_MIN = 0;
export const SOCIAL_MAX = 3_000_000;
export const SOCIAL_STEP = 10_000;

export const MAX_DEPENDENTS = 5;

export const DEFAULT_INPUT: FurusatoInput = {
  incomeType: "salary",
  income: 5_000_000,
  socialInsurance: 750_000,
  hasSpouse: false,
  dependents: 0,
};

const INCOME_TYPES: readonly IncomeType[] = ["salary", "business"];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: FurusatoInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("type", input.incomeType === "business" ? "b" : "s");
  params.set("inc", String(input.income));
  params.set("soc", String(input.socialInsurance));
  params.set("sp", input.hasSpouse ? "1" : "0");
  params.set("dep", String(input.dependents));
  return params;
}

export function decodeInputFromParams(params: URLSearchParams): FurusatoInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const incomeType: IncomeType =
    params.get("type") === "b" ? "business" : "salary";
  void INCOME_TYPES;

  return {
    incomeType,
    income: clamp(num("inc", d.income), INCOME_MIN, INCOME_MAX),
    socialInsurance: clamp(
      num("soc", d.socialInsurance),
      SOCIAL_MIN,
      SOCIAL_MAX,
    ),
    hasSpouse: params.get("sp") === "1",
    dependents: clamp(Math.round(num("dep", d.dependents)), 0, MAX_DEPENDENTS),
  };
}
