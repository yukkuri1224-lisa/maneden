import type {
  BlueReturnDeduction,
  BusinessCategory,
  FreelanceTaxInput,
  InvoiceStatus,
} from "./types";

export const REVENUE_MIN = 1_000_000;
export const REVENUE_MAX = 30_000_000;
export const AMOUNT_STEP = 100_000;
export const MAX_DEPENDENTS = 5;
export const SPOUSE_INCOME_MAX = 5_000_000;

export const DEFAULT_INPUT: FreelanceTaxInput = {
  revenue: 5_000_000,
  expenses: 1_000_000,
  blueReturnDeduction: 650_000,
  dependents: 0,
  hasSpouse: false,
  spouseIncome: 0,
  invoiceStatus: "exempt",
  businessCategory: 5,
  isOver40: false,
};

const INVOICE_STATUS_VALUES: readonly InvoiceStatus[] = [
  "exempt",
  "simplified-2wari",
  "simplified",
  "general",
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** 入力を URL クエリパラメータに変換する（共有用） */
export function encodeInputToParams(input: FreelanceTaxInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("rev", String(input.revenue));
  params.set("exp", String(input.expenses));
  params.set("blue", String(input.blueReturnDeduction));
  params.set("dep", String(input.dependents));
  params.set("spouse", input.hasSpouse ? "1" : "0");
  if (input.hasSpouse) params.set("spinc", String(input.spouseIncome));
  params.set("inv", input.invoiceStatus);
  if (input.invoiceStatus === "simplified") {
    params.set("cat", String(input.businessCategory));
  }
  params.set("o40", input.isOver40 ? "1" : "0");
  return params;
}

/** URL クエリパラメータから入力を復元する（未指定・不正値は既定値にフォールバック） */
export function decodeInputFromParams(
  params: URLSearchParams,
): FreelanceTaxInput {
  const d = DEFAULT_INPUT;

  const num = (key: string, fallback: number): number => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const revenue = clamp(num("rev", d.revenue), 0, REVENUE_MAX);
  const expenses = clamp(num("exp", d.expenses), 0, revenue);

  const blueRaw = num("blue", d.blueReturnDeduction);
  const blueReturnDeduction: BlueReturnDeduction =
    blueRaw === 650_000 ||
    blueRaw === 550_000 ||
    blueRaw === 100_000 ||
    blueRaw === 0
      ? blueRaw
      : d.blueReturnDeduction;

  const dependents = clamp(
    Math.round(num("dep", d.dependents)),
    0,
    MAX_DEPENDENTS,
  );
  const hasSpouse = params.get("spouse") === "1";
  const spouseIncome = clamp(
    num("spinc", d.spouseIncome),
    0,
    SPOUSE_INCOME_MAX,
  );

  const invRaw = params.get("inv");
  const invoiceStatus: InvoiceStatus =
    invRaw !== null && INVOICE_STATUS_VALUES.includes(invRaw as InvoiceStatus)
      ? (invRaw as InvoiceStatus)
      : d.invoiceStatus;

  const catRaw = Math.round(num("cat", d.businessCategory));
  const businessCategory: BusinessCategory =
    catRaw >= 1 && catRaw <= 6
      ? (catRaw as BusinessCategory)
      : d.businessCategory;

  const isOver40 = params.get("o40") === "1";

  return {
    revenue,
    expenses,
    blueReturnDeduction,
    dependents,
    hasSpouse,
    spouseIncome,
    invoiceStatus,
    businessCategory,
    isOver40,
  };
}
