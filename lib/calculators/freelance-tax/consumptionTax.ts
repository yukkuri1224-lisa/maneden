import { TAX_TABLES } from "@/lib/constants/tax-tables";

import { clampMin0, floorTo } from "./helpers";
import type { BusinessCategory, InvoiceStatus } from "./types";

/** 売上（税込）に含まれる消費税額（標準税率10%） */
function embeddedTax(taxIncludedAmount: number): number {
  const { standardRate } = TAX_TABLES.consumptionTax;
  return (taxIncludedAmount * standardRate) / (1 + standardRate);
}

/**
 * 消費税納付額を概算する。
 * - exempt（免税）: 0
 * - simplified-2wari（2割特例）: 売上税額 × 20%
 * - simplified（簡易課税）: 売上税額 × (1 − みなし仕入率)
 * - general（本則課税・概算）: 売上税額 − 経費に係る仕入税額（経費は全額課税仕入とみなす）
 *
 * 売上・経費はいずれも税込金額として扱う。納付額は百円未満切り捨て。
 */
export function consumptionTax(
  revenue: number,
  expenses: number,
  status: InvoiceStatus,
  category: BusinessCategory,
): number {
  if (status === "exempt") return 0;

  const salesTax = embeddedTax(revenue);

  if (status === "simplified-2wari") {
    return floorTo(salesTax * TAX_TABLES.consumptionTax.specialRate, 100);
  }

  if (status === "simplified") {
    const deemedRate = TAX_TABLES.consumptionTax.deemedPurchaseRates[category];
    return floorTo(salesTax * (1 - deemedRate), 100);
  }

  // general（本則課税）
  const purchaseTax = embeddedTax(expenses);
  return floorTo(clampMin0(salesTax - purchaseTax), 100);
}
