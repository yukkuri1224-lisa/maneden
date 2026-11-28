import { describe, expect, it } from "vitest";

import {
  calculateBonusTakeHome,
  type BonusTakeHomeInput,
} from "@/lib/calculators/bonus-take-home";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/bonus-take-home/schema";
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

describe("calculateBonusTakeHome（令和8年度の料率・都道府県別）", () => {
  it("40歳以上は介護保険料率1.62%が加わる", () => {
    const r = calculateBonusTakeHome(base({ isOver40: true }));
    // 健保 500,000×(9.85%+0.23%+1.62%)÷2 = 29,250 ＋ 45,750 ＋ 2,500
    expect(r.socialInsurance).toBe(77_500);
  });

  it("都道府県の健康保険料率を使う（北海道10.28%）", () => {
    const r = calculateBonusTakeHome(base({ prefecture: "hokkaido" }));
    // 健保 500,000×(10.28%+0.23%)÷2 = 26,275 ＋ 45,750 ＋ 2,500
    expect(r.socialInsurance).toBe(74_525);
  });

  it("未知の都道府県は東京の料率で計算する", () => {
    const r = calculateBonusTakeHome(base({ prefecture: "unknown" }));
    expect(r.socialInsurance).toBe(73_450);
  });

  it("本人負担の端数は50銭以下切捨て・50銭超切上げ", () => {
    const r = calculateBonusTakeHome(base({ bonus: 333_333 }));
    // 標準賞与額333,000。健保 16,783.2→16,783、厚年 30,469.5→30,469、
    // 雇用 333,333×0.5% = 1,666.665→1,667 → 計48,919
    expect(r.socialInsurance).toBe(48_919);
  });

  it("厚生年金は1回150万円が上限", () => {
    const a = calculateBonusTakeHome(base({ bonus: 1_500_000 }));
    const b = calculateBonusTakeHome(base({ bonus: 2_000_000 }));
    // 差額50万円ぶんは健保（10.08%÷2）と雇用（0.5%）のみ増える
    expect(b.socialInsurance - a.socialInsurance).toBe(25_200 + 2_500);
  });
});

describe("calculateBonusTakeHome", () => {
  it("賞与50万・前月給与30万・単身・東京：社会保険料は約14.7%、手取りは額面未満", () => {
    const r = calculateBonusTakeHome(base());
    // 健保 500,000×(9.85%+支援金0.23%)÷2 = 25,200
    // 厚年 500,000×18.3%÷2 = 45,750、雇用 500,000×0.5% = 2,500 → 計73,450
    expect(r.socialInsurance).toBe(73_450);
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

describe("ボーナスの入力とURLの相互変換（都道府県）", () => {
  it("都道府県をURLに保存し、読み戻せる", () => {
    const params = encodeInputToParams({
      ...DEFAULT_INPUT,
      prefecture: "osaka",
    });
    expect(params.get("pref")).toBe("osaka");
    expect(decodeInputFromParams(params).prefecture).toBe("osaka");
  });

  it("都道府県がない・不正なURLは東京になる", () => {
    expect(
      decodeInputFromParams(new URLSearchParams("b=500000")).prefecture,
    ).toBe("tokyo");
    expect(
      decodeInputFromParams(new URLSearchParams("pref=atlantis")).prefecture,
    ).toBe("tokyo");
  });
});
