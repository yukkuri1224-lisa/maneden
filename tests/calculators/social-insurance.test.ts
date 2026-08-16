import { describe, expect, it } from "vitest";

import { calculateSocialInsurance } from "@/lib/calculators/social-insurance";
import {
  standardHealthRemuneration,
  standardPensionRemuneration,
} from "@/lib/constants/insurance-rates";

describe("標準報酬月額の等級ルックアップ", () => {
  it("健康保険の標準報酬月額（境界・下限・上限）", () => {
    expect(standardHealthRemuneration(50_000)).toBe(58_000); // 下限（第1等級）
    expect(standardHealthRemuneration(62_999)).toBe(58_000);
    expect(standardHealthRemuneration(63_000)).toBe(68_000); // 第2等級の下限
    expect(standardHealthRemuneration(300_000)).toBe(300_000); // 第22等級
    expect(standardHealthRemuneration(2_000_000)).toBe(1_390_000); // 上限（第50等級）
  });

  it("厚生年金の標準報酬月額は[88,000, 650,000]にクランプ", () => {
    expect(standardPensionRemuneration(50_000)).toBe(88_000); // 下限
    expect(standardPensionRemuneration(300_000)).toBe(300_000);
    expect(standardPensionRemuneration(2_000_000)).toBe(650_000); // 上限
  });
});

describe("社会保険料（本人・年額）＝公式保険料額表と1円一致", () => {
  // 東京（健保9.85%）・月収30万（年収360万）・40歳未満
  const tokyoYoung = calculateSocialInsurance({
    annualIncome: 3_600_000,
    prefectureSlug: "tokyo",
    isOver40: false,
  });

  it("東京・月30万・40歳未満：健保(子育て込)・厚年・雇用", () => {
    // 健保折半(月)=300000×0.0985/2=14775、子育て折半=300000×0.0023/2=345 → 合計15120/月
    expect(tokyoYoung.healthInsurance).toBe(15_120 * 12); // 181,440
    expect(tokyoYoung.careInsurance).toBe(0);
    // 厚年折半(月)=300000×0.183/2=27450
    expect(tokyoYoung.pensionInsurance).toBe(27_450 * 12); // 329,400
    // 雇用=年収×0.5%
    expect(tokyoYoung.employmentInsurance).toBe(18_000);
    expect(tokyoYoung.total).toBe(181_440 + 329_400 + 18_000);
  });

  it("東京・月30万・40〜64歳：介護保険が加わる", () => {
    const over40 = calculateSocialInsurance({
      annualIncome: 3_600_000,
      prefectureSlug: "tokyo",
      isOver40: true,
    });
    // 介護折半(月)=300000×0.0162/2=2430
    expect(over40.careInsurance).toBe(2_430 * 12); // 29,160
    // 健保(介護込・子育て込)=300000×(0.0985+0.0023+0.0162)/2=17550/月
    expect(over40.healthInsurance).toBe(17_550 * 12); // 210,600
  });

  it("大阪（9.85%と異なる10.13%）でも料率が反映される", () => {
    const osaka = calculateSocialInsurance({
      annualIncome: 3_600_000,
      prefectureSlug: "osaka",
      isOver40: false,
    });
    // 健保+子育て=300000×(0.1013+0.0023)/2=15540/月
    expect(osaka.healthInsurance).toBe(15_540 * 12); // 186,480
    // 厚年・雇用は全国一律
    expect(osaka.pensionInsurance).toBe(329_400);
  });

  it("未知の都道府県は東京にフォールバック", () => {
    const unknown = calculateSocialInsurance({
      annualIncome: 3_600_000,
      prefectureSlug: "atlantis",
      isOver40: false,
    });
    expect(unknown.healthInsurance).toBe(tokyoYoung.healthInsurance);
  });

  it("高所得は標準報酬月額の上限で頭打ち（厚年650,000）", () => {
    const high = calculateSocialInsurance({
      annualIncome: 30_000_000, // 月250万 → 健保139万・厚年65万で頭打ち
      prefectureSlug: "tokyo",
      isOver40: false,
    });
    expect(high.pensionInsurance).toBe(Math.round((650_000 * 0.183) / 2) * 12);
  });
});
