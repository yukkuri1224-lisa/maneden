import { TAX_TABLES } from "@/lib/constants/tax-tables";

import type { GiftTaxInput, GiftTaxResult, GiftType } from "./types";

function bracketsFor(giftType: GiftType) {
  return giftType === "special"
    ? TAX_TABLES.giftTax.special
    : TAX_TABLES.giftTax.general;
}

/**
 * 贈与税（暦年課税）を概算する。
 *
 * 課税価格 = その年の贈与合計 − 基礎控除110万円。
 * 税額 = 課税価格 × 税率 − 控除額（速算表）。税率表は贈与の種類で異なる。
 * 特例贈与＝直系尊属（父母・祖父母）から18歳以上の子・孫への贈与。一般贈与＝それ以外。
 */
export function calculateGiftTax(input: GiftTaxInput): GiftTaxResult {
  const amount = Math.max(0, input.amount);
  const basicDeduction = TAX_TABLES.giftTax.basicDeduction;
  const taxableAmount = Math.max(0, amount - basicDeduction);

  const brackets = bracketsFor(input.giftType);
  const bracket =
    brackets.find((b) => taxableAmount <= b.upTo) ??
    brackets[brackets.length - 1];

  const taxAmount =
    taxableAmount > 0
      ? Math.max(
          0,
          Math.floor(taxableAmount * bracket.rate - bracket.deduction),
        )
      : 0;

  const netAmount = amount - taxAmount;
  const effectiveRate = amount > 0 ? (taxAmount / amount) * 100 : 0;
  const marginalRate = taxableAmount > 0 ? bracket.rate * 100 : 0;

  return {
    basicDeduction,
    taxableAmount,
    taxAmount,
    netAmount,
    effectiveRate,
    marginalRate,
  };
}

export * from "./types";
