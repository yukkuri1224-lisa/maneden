import type { InheritanceTaxInput } from "./types";

export const ESTATE_MIN = 0;
export const ESTATE_MAX = 500_000_000;
export const ESTATE_STEP = 5_000_000;

export const CHILDREN_MIN = 0;
export const CHILDREN_MAX = 10;

export const DEFAULT_INPUT: InheritanceTaxInput = {
  estate: 100_000_000,
  hasSpouse: true,
  children: 2,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(
  input: InheritanceTaxInput,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("est", String(input.estate));
  params.set("sp", input.hasSpouse ? "1" : "0");
  params.set("ch", String(input.children));
  return params;
}

export function decodeInputFromParams(
  params: URLSearchParams,
): InheritanceTaxInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const sp = params.get("sp");

  return {
    estate: clamp(num("est", d.estate), ESTATE_MIN, ESTATE_MAX),
    hasSpouse: sp === null ? d.hasSpouse : sp === "1",
    children: clamp(
      Math.round(num("ch", d.children)),
      CHILDREN_MIN,
      CHILDREN_MAX,
    ),
  };
}
