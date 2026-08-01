import type { SaasMetricsInput } from "./types";

export const CHURN_MIN = 0.1;
export const CHURN_MAX = 20;
export const CHURN_STEP = 0.1;

export const ARPU_MIN = 500;
export const ARPU_MAX = 100_000;
export const ARPU_STEP = 100;

export const MARGIN_MIN = 0;
export const MARGIN_MAX = 100;
export const MARGIN_STEP = 1;

export const CAC_MIN = 0;
export const CAC_MAX = 500_000;
export const CAC_STEP = 1_000;

export const CUSTOMERS_MIN = 1;
export const CUSTOMERS_MAX = 100_000;
export const CUSTOMERS_STEP = 10;

export const DEFAULT_INPUT: SaasMetricsInput = {
  monthlyChurnRate: 3,
  arpu: 5_000,
  grossMarginRate: 80,
  cac: 30_000,
  customers: 100,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: SaasMetricsInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("churn", String(input.monthlyChurnRate));
  params.set("arpu", String(input.arpu));
  params.set("gm", String(input.grossMarginRate));
  params.set("cac", String(input.cac));
  params.set("cust", String(input.customers));
  return params;
}

export function decodeInputFromParams(
  params: URLSearchParams,
): SaasMetricsInput {
  const d = DEFAULT_INPUT;
  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  return {
    monthlyChurnRate: clamp(
      num("churn", d.monthlyChurnRate),
      CHURN_MIN,
      CHURN_MAX,
    ),
    arpu: clamp(num("arpu", d.arpu), ARPU_MIN, ARPU_MAX),
    grossMarginRate: clamp(
      num("gm", d.grossMarginRate),
      MARGIN_MIN,
      MARGIN_MAX,
    ),
    cac: clamp(num("cac", d.cac), CAC_MIN, CAC_MAX),
    customers: clamp(num("cust", d.customers), CUSTOMERS_MIN, CUSTOMERS_MAX),
  };
}
