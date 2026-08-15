/**
 * 手取り計算のゴールデンスナップショット生成器。
 *
 * 年収100万〜3,000万（50万円刻み）× 扶養0〜3人の全パターンで、
 * calculateSalaryTakeHome の全出力フィールドを JSON に書き出す。
 *
 * 使い方:
 *   - 生成: `pnpm vitest run tests/golden/generate-take-home.test.ts`
 *     → config/golden/take-home.current.json を（再）生成する（決定的・何度実行しても同じ）。
 *   - 改修前のベースライン凍結: 生成後に current.json を take-home.baseline.json へコピー。
 *   - 改修後: 再生成した current.json を baseline.json と diff し、変化を説明する。
 *
 * ※ この生成器は current.json のみを書き換える。baseline.json は手動コピーで凍結するため、
 *   通常の `pnpm test` で誤って上書きされない。
 */
import { mkdirSync, writeFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { TAX_YEAR } from "@/lib/constants/tax-tables";

interface GoldenRow {
  incomeMan: number;
  income: number;
  dependents: number;
  salaryIncome: number;
  socialInsurance: number;
  healthInsurance: number;
  pensionInsurance: number;
  employmentInsurance: number;
  taxableIncomeIncomeTax: number;
  taxableIncomeResident: number;
  incomeTax: number;
  residentTax: number;
  netIncome: number;
  netIncomeRate: number;
}

describe("golden: 手取り計算スナップショット生成", () => {
  it("年収100〜3000万×扶養0〜3の全パターンを current.json へ書き出す", () => {
    const rows: GoldenRow[] = [];
    for (let man = 100; man <= 3000; man += 50) {
      const income = man * 10_000;
      for (let dependents = 0; dependents <= 3; dependents++) {
        const r = calculateSalaryTakeHome({
          income,
          isOver40: false,
          hasSpouse: false,
          dependents,
        });
        rows.push({
          incomeMan: man,
          income,
          dependents,
          salaryIncome: r.salaryIncome,
          socialInsurance: r.socialInsurance,
          healthInsurance: r.healthInsurance,
          pensionInsurance: r.pensionInsurance,
          employmentInsurance: r.employmentInsurance,
          taxableIncomeIncomeTax: r.taxableIncomeIncomeTax,
          taxableIncomeResident: r.taxableIncomeResident,
          incomeTax: r.incomeTax,
          residentTax: r.residentTax,
          netIncome: r.netIncome,
          netIncomeRate: Number(r.netIncomeRate.toFixed(4)),
        });
      }
    }

    const payload = {
      meta: {
        description:
          "手取り計算のゴールデンスナップショット。年収100〜3000万(50万刻み)×扶養0〜3人。",
        fixedConditions:
          "isOver40=false, hasSpouse=false, 都道府県=未対応(全国一律の概算)",
        taxYear: TAX_YEAR,
        rowCount: rows.length,
      },
      rows,
    };

    mkdirSync("config/golden", { recursive: true });
    writeFileSync(
      "config/golden/take-home.current.json",
      JSON.stringify(payload, null, 2) + "\n",
    );

    expect(rows.length).toBe(59 * 4);
  });
});
