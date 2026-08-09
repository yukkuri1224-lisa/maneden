import { describe, expect, it } from "vitest";

import { calculateNisa } from "@/lib/calculators/nisa";

describe("calculateNisa", () => {
  it("毎月3万円・年利5%・20年（複利）の将来評価額", () => {
    const r = calculateNisa({
      initialLumpSum: 0,
      monthlyContribution: 30_000,
      annualReturnPercent: 5,
      years: 20,
    });

    expect(r.totalPrincipal).toBe(7_200_000); // 3万×12×20
    // 月末拠出の複利で約1,233万円
    expect(r.futureValue).toBeGreaterThan(12_300_000);
    expect(r.futureValue).toBeLessThan(12_360_000);
    expect(r.totalGain).toBe(r.futureValue - r.totalPrincipal);
    expect(r.taxSaved).toBe(Math.round(r.totalGain * 0.20315));
    expect(r.reachedLifetimeCap).toBe(false);
    expect(r.capReachedYear).toBeNull();
    expect(r.timeline).toHaveLength(20);
  });

  it("年利0%なら評価額＝元本、運用益・非課税メリットはゼロ", () => {
    const r = calculateNisa({
      initialLumpSum: 0,
      monthlyContribution: 30_000,
      annualReturnPercent: 0,
      years: 10,
    });

    expect(r.totalPrincipal).toBe(3_600_000);
    expect(r.futureValue).toBe(3_600_000);
    expect(r.totalGain).toBe(0);
    expect(r.taxSaved).toBe(0);
  });

  it("生涯投資枠1,800万円で頭打ちになる（月30万×5年で到達）", () => {
    const r = calculateNisa({
      initialLumpSum: 0,
      monthlyContribution: 300_000, // 年360万＝年間枠ちょうど
      annualReturnPercent: 5,
      years: 10,
    });

    expect(r.totalPrincipal).toBe(18_000_000); // 枠でクランプ
    expect(r.reachedLifetimeCap).toBe(true);
    expect(r.capReachedYear).toBe(5);
  });

  it("年間投資枠360万円を超える分は投資されない（月50万→年360万まで）", () => {
    const r = calculateNisa({
      initialLumpSum: 0,
      monthlyContribution: 500_000, // 年600万だが年間枠は360万
      annualReturnPercent: 0,
      years: 1,
    });

    expect(r.totalPrincipal).toBe(3_600_000);
    expect(r.futureValue).toBe(3_600_000);
  });
});
