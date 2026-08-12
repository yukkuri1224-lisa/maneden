import { describe, expect, it } from "vitest";

import {
  calculateBonusTakeHome,
  type BonusTakeHomeInput,
} from "@/lib/calculators/bonus-take-home";
import {
  BONUS_TABLE_AMOUNTS,
  buildBonusTable,
} from "@/lib/calculators/bonus-take-home/reference";

function base(overrides: Partial<BonusTakeHomeInput> = {}): BonusTakeHomeInput {
  return {
    bonus: 500_000,
    monthlySalary: 300_000,
    isOver40: false,
    dependents: 0,
    ...overrides,
  };
}

describe("calculateBonusTakeHome", () => {
  it("賞与50万・前月給与30万・単身：社会保険料は約14.75%、手取りは額面未満", () => {
    const r = calculateBonusTakeHome(base());
    // health 25,000 + pension 45,750 + employment 3,000 = 73,750
    expect(r.socialInsurance).toBe(73_750);
    expect(r.totalDeduction).toBe(r.socialInsurance + r.incomeTax);
    expect(r.netBonus).toBe(500_000 - r.totalDeduction);
    expect(r.netBonus).toBeLessThan(500_000);
    expect(r.netBonus).toBeGreaterThan(350_000);
  });

  it("40歳以上は介護保険で社会保険料が増える", () => {
    const under = calculateBonusTakeHome(base());
    const over = calculateBonusTakeHome(base({ isOver40: true }));
    expect(over.socialInsurance).toBeGreaterThan(under.socialInsurance);
  });

  it("高額賞与は上限（厚年150万/回・健保573万/年度）で負担率が下がる", () => {
    const r = calculateBonusTakeHome(
      base({ bonus: 6_000_000, monthlySalary: 500_000 }),
    );
    // 上限が効くため社会保険料率は 14.75% を下回る
    expect(r.socialInsurance / 6_000_000).toBeLessThan(0.1475);
    expect(r.socialInsurance).toBeGreaterThan(0);
  });

  it("賞与0円なら手取り0・手取り率0", () => {
    const r = calculateBonusTakeHome(base({ bonus: 0 }));
    expect(r.netBonus).toBe(0);
    expect(r.netRate).toBe(0);
  });
});

describe("ボーナス 額面別早見表（buildBonusTable）", () => {
  const rows = buildBonusTable();

  it("額面行の数だけ行が生成される", () => {
    expect(rows.length).toBe(BONUS_TABLE_AMOUNTS.length);
  });

  it("手取り率は概ね70〜90%に収まる", () => {
    for (const row of rows) {
      expect(row.netRate).toBeGreaterThan(65);
      expect(row.netRate).toBeLessThan(92);
    }
  });

  it("手取り＝額面−社会保険料−所得税", () => {
    for (const row of rows) {
      expect(row.netBonus).toBe(
        row.amount - row.socialInsurance - row.incomeTax,
      );
    }
  });

  it("額面が上がるほど手取り額も増える", () => {
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].netBonus).toBeGreaterThan(rows[i - 1].netBonus);
    }
  });
});
