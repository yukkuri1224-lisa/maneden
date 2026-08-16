import {
  DEFAULT_PREFECTURE_SLUG,
  getPrefectureRate,
} from "@/lib/constants/insurance-rates";

import type { SalaryTakeHomeInput } from "./types";

export const INCOME_MIN = 0;
export const INCOME_MAX = 30_000_000;
export const INCOME_STEP = 100_000;
export const MAX_DEPENDENTS = 5;

export const DEFAULT_INPUT: SalaryTakeHomeInput = {
  income: 5_000_000,
  isOver40: false,
  hasSpouse: false,
  dependents: 0,
  prefecture: DEFAULT_PREFECTURE_SLUG,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(
  input: SalaryTakeHomeInput,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("inc", String(input.income));
  params.set("o40", input.isOver40 ? "1" : "0");
  params.set("sp", input.hasSpouse ? "1" : "0");
  params.set("dep", String(input.dependents));
  params.set("pref", input.prefecture ?? DEFAULT_PREFECTURE_SLUG);
  return params;
}

export function decodeInputFromParams(
  params: URLSearchParams,
): SalaryTakeHomeInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const prefRaw = params.get("pref");
  const prefecture =
    prefRaw && getPrefectureRate(prefRaw).slug === prefRaw
      ? prefRaw
      : DEFAULT_PREFECTURE_SLUG;

  return {
    income: clamp(num("inc", d.income), INCOME_MIN, INCOME_MAX),
    isOver40: params.get("o40") === "1",
    hasSpouse: params.get("sp") === "1",
    dependents: clamp(Math.round(num("dep", d.dependents)), 0, MAX_DEPENDENTS),
    prefecture,
  };
}
