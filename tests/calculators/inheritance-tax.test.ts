import { describe, expect, it } from "vitest";

import { calculateInheritanceTax } from "@/lib/calculators/inheritance-tax";

describe("calculateInheritanceTax", () => {
  it("遺産1億円・配偶者あり・子2人（相続税の総額630万円）", () => {
    const r = calculateInheritanceTax({
      estate: 100_000_000,
      hasSpouse: true,
      children: 2,
    });
    expect(r.heirCount).toBe(3);
    expect(r.basicDeduction).toBe(48_000_000);
    expect(r.taxableEstate).toBe(52_000_000);
    expect(r.totalTax).toBe(6_300_000);
    // 配偶者が法定相続分(1/2)を相続 → 子2人分のみ負担
    expect(r.taxAfterSpouseRelief).toBe(3_150_000);
  });

  it("遺産1億円・配偶者あり・子1人（総額770万円）", () => {
    const r = calculateInheritanceTax({
      estate: 100_000_000,
      hasSpouse: true,
      children: 1,
    });
    expect(r.heirCount).toBe(2);
    expect(r.basicDeduction).toBe(42_000_000);
    expect(r.totalTax).toBe(7_700_000);
    expect(r.taxAfterSpouseRelief).toBe(3_850_000);
  });

  it("遺産1億円・配偶者なし・子2人（総額770万円・軽減なし）", () => {
    const r = calculateInheritanceTax({
      estate: 100_000_000,
      hasSpouse: false,
      children: 2,
    });
    expect(r.heirCount).toBe(2);
    expect(r.totalTax).toBe(7_700_000);
    expect(r.taxAfterSpouseRelief).toBe(7_700_000);
  });

  it("基礎控除以下は非課税", () => {
    const r = calculateInheritanceTax({
      estate: 40_000_000,
      hasSpouse: true,
      children: 1,
    });
    expect(r.basicDeduction).toBe(42_000_000);
    expect(r.taxableEstate).toBe(0);
    expect(r.totalTax).toBe(0);
  });

  it("配偶者のみ（子なし）は配偶者の税額軽減で負担ゼロ", () => {
    const r = calculateInheritanceTax({
      estate: 100_000_000,
      hasSpouse: true,
      children: 0,
    });
    expect(r.heirCount).toBe(1);
    expect(r.basicDeduction).toBe(36_000_000);
    expect(r.taxableEstate).toBe(64_000_000);
    expect(r.totalTax).toBe(12_200_000);
    expect(r.taxAfterSpouseRelief).toBe(0);
  });
});
