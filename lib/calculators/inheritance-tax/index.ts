import { TAX_TABLES } from "@/lib/constants/tax-tables";

import type { InheritanceTaxInput, InheritanceTaxResult } from "./types";

function floorTo(value: number, unit: number): number {
  if (value <= 0) return 0;
  return Math.floor(value / unit) * unit;
}

/** 法定相続分に応ずる取得金額（1000円未満切捨て）に対する相続税額（速算表）。 */
function inheritanceTaxAmount(legalAmount: number): number {
  const amount = floorTo(Math.max(0, legalAmount), 1000);
  const brackets = TAX_TABLES.inheritanceTax.brackets;
  const bracket =
    brackets.find((b) => amount <= b.upTo) ?? brackets[brackets.length - 1];
  return Math.max(0, Math.floor(amount * bracket.rate - bracket.deduction));
}

/**
 * 相続税を概算する（配偶者・子の法定相続を前提）。
 *
 * 手順: ①基礎控除(3,000万＋600万×法定相続人)を引く ②課税遺産総額を法定相続分で按分し
 * 各人の取得額に速算表を適用して合計＝「相続税の総額」③配偶者が法定相続分を相続した場合は
 * 配偶者の税額軽減で配偶者分が非課税になるため、その分を差し引いた負担も示す。
 *
 * 対象は配偶者・子が相続人のケース。父母・兄弟姉妹が相続人となる場合や、
 * 生命保険・退職金の非課税枠、2割加算、各種特例は考慮しない概算。
 */
export function calculateInheritanceTax(
  input: InheritanceTaxInput,
): InheritanceTaxResult {
  const estate = Math.max(0, input.estate);
  const children = Math.max(0, Math.floor(input.children));
  const hasSpouse = input.hasSpouse;
  const t = TAX_TABLES.inheritanceTax;

  const heirCount = (hasSpouse ? 1 : 0) + children;
  const basicDeduction =
    t.basicDeductionFixed + t.basicDeductionPerHeir * heirCount;
  const taxableEstate = Math.max(0, estate - basicDeduction);

  if (heirCount === 0 || taxableEstate === 0) {
    return {
      heirCount,
      basicDeduction,
      taxableEstate,
      totalTax: 0,
      taxAfterSpouseRelief: 0,
      hasSpouseRelief: hasSpouse,
      netInheritance: estate,
    };
  }

  // 法定相続分に応じた各人の取得額 → 速算表 → 合計＝相続税の総額
  let totalTax = 0;
  let spousePortion = 0; // 配偶者の法定相続分（割合）

  if (hasSpouse && children > 0) {
    spousePortion = 1 / 2;
    totalTax += inheritanceTaxAmount(taxableEstate * spousePortion);
    const eachChild = (taxableEstate * (1 / 2)) / children;
    totalTax += inheritanceTaxAmount(eachChild) * children;
  } else if (hasSpouse && children === 0) {
    spousePortion = 1;
    totalTax += inheritanceTaxAmount(taxableEstate);
  } else {
    // 配偶者なし・子のみ
    spousePortion = 0;
    const eachChild = taxableEstate / children;
    totalTax += inheritanceTaxAmount(eachChild) * children;
  }

  totalTax = Math.round(totalTax);

  // 配偶者の税額軽減（配偶者が法定相続分を相続した前提 → 配偶者分は非課税）
  const taxAfterSpouseRelief = hasSpouse
    ? Math.round(totalTax * (1 - spousePortion))
    : totalTax;

  return {
    heirCount,
    basicDeduction,
    taxableEstate,
    totalTax,
    taxAfterSpouseRelief,
    hasSpouseRelief: hasSpouse,
    netInheritance: estate - totalTax,
  };
}

export * from "./types";
