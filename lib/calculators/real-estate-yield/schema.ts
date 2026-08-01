import type { BuildingStructure, RealEstateInput } from "./types";

export const PRICE_MIN = 1_000_000;
export const PRICE_MAX = 200_000_000;
export const PRICE_STEP = 100_000;

export const RENT_MIN = 0;
export const RENT_MAX = 20_000_000;
export const RENT_STEP = 10_000;

export const EXPENSE_RATE_MIN = 0;
export const EXPENSE_RATE_MAX = 50;
export const EXPENSE_RATE_STEP = 1;

export const BUILDING_RATIO_MIN = 10;
export const BUILDING_RATIO_MAX = 100;
export const BUILDING_RATIO_STEP = 5;

export const LOAN_MIN = 0;
export const LOAN_MAX = 200_000_000;
export const LOAN_STEP = 100_000;

export const INTEREST_MIN = 0;
export const INTEREST_MAX = 10;
export const INTEREST_STEP = 0.1;

export const LOAN_YEARS_MIN = 1;
export const LOAN_YEARS_MAX = 50;
export const LOAN_YEARS_STEP = 1;

const STRUCTURE_VALUES: readonly BuildingStructure[] = ["rc", "steel", "wood"];

export const DEFAULT_INPUT: RealEstateInput = {
  propertyPrice: 30_000_000,
  annualRent: 2_400_000,
  expenseRate: 20,
  buildingRatio: 70,
  loanAmount: 27_000_000,
  interestRate: 2,
  loanYears: 30,
  structure: "wood",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: RealEstateInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("price", String(input.propertyPrice));
  params.set("rent", String(input.annualRent));
  params.set("exp", String(input.expenseRate));
  params.set("bld", String(input.buildingRatio));
  params.set("loan", String(input.loanAmount));
  params.set("rate", String(input.interestRate));
  params.set("years", String(input.loanYears));
  params.set("st", input.structure);
  return params;
}

export function decodeInputFromParams(
  params: URLSearchParams,
): RealEstateInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const stRaw = params.get("st");
  const structure: BuildingStructure =
    stRaw !== null && STRUCTURE_VALUES.includes(stRaw as BuildingStructure)
      ? (stRaw as BuildingStructure)
      : d.structure;

  return {
    propertyPrice: clamp(num("price", d.propertyPrice), PRICE_MIN, PRICE_MAX),
    annualRent: clamp(num("rent", d.annualRent), RENT_MIN, RENT_MAX),
    expenseRate: clamp(
      num("exp", d.expenseRate),
      EXPENSE_RATE_MIN,
      EXPENSE_RATE_MAX,
    ),
    buildingRatio: clamp(
      num("bld", d.buildingRatio),
      BUILDING_RATIO_MIN,
      BUILDING_RATIO_MAX,
    ),
    loanAmount: clamp(num("loan", d.loanAmount), LOAN_MIN, LOAN_MAX),
    interestRate: clamp(
      num("rate", d.interestRate),
      INTEREST_MIN,
      INTEREST_MAX,
    ),
    loanYears: clamp(
      Math.round(num("years", d.loanYears)),
      LOAN_YEARS_MIN,
      LOAN_YEARS_MAX,
    ),
    structure,
  };
}
