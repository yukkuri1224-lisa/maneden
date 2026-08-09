import { describe, expect, it } from "vitest";

import { calculateGiftTax } from "@/lib/calculators/gift-tax";

describe("calculateGiftTax", () => {
  it("特例贈与500万円（課税価格390万→15%・控除10万）", () => {
    const r = calculateGiftTax({ amount: 5_000_000, giftType: "special" });
    expect(r.taxableAmount).toBe(3_900_000);
    expect(r.taxAmount).toBe(485_000);
    expect(r.netAmount).toBe(4_515_000);
    expect(r.marginalRate).toBe(15);
    expect(r.effectiveRate).toBeCloseTo(9.7, 1);
  });

  it("一般贈与500万円（課税価格390万→20%・控除25万）", () => {
    const r = calculateGiftTax({ amount: 5_000_000, giftType: "general" });
    expect(r.taxAmount).toBe(530_000);
  });

  it("特例贈与1,000万円（課税価格890万→30%・控除90万）", () => {
    const r = calculateGiftTax({ amount: 10_000_000, giftType: "special" });
    expect(r.taxAmount).toBe(1_770_000);
  });

  it("一般贈与1,000万円（課税価格890万→40%・控除125万）", () => {
    const r = calculateGiftTax({ amount: 10_000_000, giftType: "general" });
    expect(r.taxAmount).toBe(2_310_000);
  });

  it("110万円以下は基礎控除内で非課税", () => {
    const r = calculateGiftTax({ amount: 1_100_000, giftType: "special" });
    expect(r.taxableAmount).toBe(0);
    expect(r.taxAmount).toBe(0);
    expect(r.netAmount).toBe(1_100_000);
    expect(r.marginalRate).toBe(0);
  });
});
