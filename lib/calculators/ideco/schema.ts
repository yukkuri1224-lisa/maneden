import { IDECO_MONTHLY_CAPS } from "./index";
import type { IdecoCategory, IdecoInput } from "./types";

export const INCOME_MIN = 1_000_000;
export const INCOME_MAX = 20_000_000;
export const INCOME_STEP = 100_000;

export const CONTRIBUTION_MIN = 5_000;
export const CONTRIBUTION_STEP = 1_000;

export const AGE_MIN = 20;
export const AGE_MAX = 59;

const CATEGORIES: IdecoCategory[] = [
  "company-no-pension",
  "company-dc",
  "company-db",
];

export const DEFAULT_INPUT: IdecoInput = {
  income: 5_000_000,
  monthlyContribution: 23_000,
  age: 35,
  category: "company-no-pension",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: IdecoInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("inc", String(input.income));
  params.set("m", String(input.monthlyContribution));
  params.set("age", String(input.age));
  params.set("cat", input.category);
  return params;
}

export function decodeInputFromParams(params: URLSearchParams): IdecoInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const rawCat = params.get("cat");
  const category: IdecoCategory = CATEGORIES.includes(rawCat as IdecoCategory)
    ? (rawCat as IdecoCategory)
    : d.category;

  return {
    income: clamp(num("inc", d.income), INCOME_MIN, INCOME_MAX),
    monthlyContribution: clamp(
      Math.round(num("m", d.monthlyContribution) / CONTRIBUTION_STEP) *
        CONTRIBUTION_STEP,
      0,
      IDECO_MONTHLY_CAPS[category],
    ),
    age: clamp(Math.round(num("age", d.age)), AGE_MIN, AGE_MAX),
    category,
  };
}
