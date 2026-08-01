import type { BusinessType, Purpose, SubsidyInput } from "./types";

export const EMPLOYEES_MIN = 0;
export const EMPLOYEES_MAX = 300;
export const EMPLOYEES_STEP = 1;

export const INVESTMENT_MIN = 0;
export const INVESTMENT_MAX = 50_000_000;
export const INVESTMENT_STEP = 100_000;

export const ALL_PURPOSES: readonly Purpose[] = [
  "it",
  "equipment",
  "sales-channel",
  "restructuring",
  "startup",
  "wage-hike",
];

export const DEFAULT_INPUT: SubsidyInput = {
  businessType: "corporation",
  employees: 5,
  purposes: ["it", "equipment"],
  investmentAmount: 3_000_000,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: SubsidyInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("bt", input.businessType === "corporation" ? "c" : "s");
  params.set("emp", String(input.employees));
  params.set("inv", String(input.investmentAmount));
  if (input.purposes.length > 0) params.set("pu", input.purposes.join("."));
  return params;
}

export function decodeInputFromParams(params: URLSearchParams): SubsidyInput {
  const d = DEFAULT_INPUT;

  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const businessType: BusinessType =
    params.get("bt") === "s" ? "sole-proprietor" : "corporation";

  const puRaw = params.get("pu");
  const purposes: Purpose[] =
    puRaw !== null
      ? puRaw
          .split(".")
          .filter((p): p is Purpose => ALL_PURPOSES.includes(p as Purpose))
      : d.purposes;

  return {
    businessType,
    employees: clamp(
      Math.round(num("emp", d.employees)),
      EMPLOYEES_MIN,
      EMPLOYEES_MAX,
    ),
    purposes,
    investmentAmount: clamp(
      num("inv", d.investmentAmount),
      INVESTMENT_MIN,
      INVESTMENT_MAX,
    ),
  };
}
