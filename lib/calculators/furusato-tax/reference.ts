import { calculateFurusato } from "./index";

/**
 * ふるさと納税「限度額早見表」を、実際の計算関数から生成する。
 * 数値の正確性を担保するため、専用の近似式は持たず calculateFurusato を再利用する。
 *
 * 前提（早見表の一般的な想定に合わせる）:
 * - 給与所得者（会社員）
 * - 社会保険料は給与年収の約 15% で概算
 * - 子は「高校生（16〜18歳＝一般の扶養控除の対象）」を想定
 * - 医療費控除・住宅ローン控除など他の控除は考慮しない
 */

/** 社会保険料の概算率（給与年収に対する割合） */
export const FURUSATO_SOCIAL_RATE = 0.15;

export interface FurusatoTableColumn {
  key: string;
  /** 表頭のラベル */
  label: string;
  /** 補足（家族構成の前提） */
  note: string;
  hasSpouse: boolean;
  dependents: number;
}

/**
 * 早見表の家族構成カラム。
 * calculateFurusato が扱える「配偶者控除」「一般の扶養控除」の範囲に限定し、
 * 特定扶養（大学生）など未対応の控除は含めない（＝数値のズレを避ける）。
 */
export const FURUSATO_TABLE_COLUMNS: FurusatoTableColumn[] = [
  {
    key: "single",
    label: "独身・共働き",
    note: "配偶者控除なし・扶養なし",
    hasSpouse: false,
    dependents: 0,
  },
  {
    key: "couple",
    label: "夫婦",
    note: "配偶者に収入なし",
    hasSpouse: true,
    dependents: 0,
  },
  {
    key: "dual-child1",
    label: "共働き＋子1人",
    note: "子は高校生",
    hasSpouse: false,
    dependents: 1,
  },
  {
    key: "couple-child1",
    label: "夫婦＋子1人",
    note: "配偶者に収入なし・子は高校生",
    hasSpouse: true,
    dependents: 1,
  },
];

/** 早見表の年収行（給与年収・額面） */
export const FURUSATO_TABLE_INCOMES: number[] = [
  3_000_000, 3_500_000, 4_000_000, 4_500_000, 5_000_000, 5_500_000, 6_000_000,
  7_000_000, 8_000_000, 9_000_000, 10_000_000, 12_000_000, 15_000_000,
  20_000_000,
];

/** 指定の年収・家族構成での控除上限額（自己負担2,000円で済む目安）を返す */
export function furusatoLimitFor(
  income: number,
  hasSpouse: boolean,
  dependents: number,
): number {
  return calculateFurusato({
    incomeType: "salary",
    income,
    socialInsurance: Math.round(income * FURUSATO_SOCIAL_RATE),
    hasSpouse,
    dependents,
  }).donationLimit;
}

export interface FurusatoTableRow {
  income: number;
  /** FURUSATO_TABLE_COLUMNS と同じ並びの上限額 */
  limits: number[];
}

/** 早見表の全行を生成する */
export function buildFurusatoTable(): FurusatoTableRow[] {
  return FURUSATO_TABLE_INCOMES.map((income) => ({
    income,
    limits: FURUSATO_TABLE_COLUMNS.map((col) =>
      furusatoLimitFor(income, col.hasSpouse, col.dependents),
    ),
  }));
}
