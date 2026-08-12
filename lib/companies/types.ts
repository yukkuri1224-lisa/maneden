export interface Company {
  /** URL スラッグ（証券コードやローマ字など一意な文字列） */
  slug: string;
  /** 会社名 */
  name: string;
  /** 証券コード */
  securitiesCode?: string;
  /** 業種 */
  industry: string;
  /** 平均年間給与（円） */
  averageSalary: number;
  /** 平均年齢（歳） */
  averageAge?: number;
  /** 平均勤続年数（年） */
  averageTenure?: number;
  /** 従業員数（人） */
  employees?: number;
  /** 対象決算期（例: "2024年3月期"） */
  fiscalYear?: string;
  /**
   * 過去の平均年間給与の推移（将来の拡張用）。
   * EDINET から複数期を再取得できたときに、古い期→新しい期の順で格納する。
   * 現状のデータには含まれないため任意。埋まっている企業のみ推移表を表示する。
   */
  salaryHistory?: SalaryHistoryPoint[];
  /** デモ用のサンプルデータか（EDINET取得の実データはこのフラグを持たない） */
  sample?: boolean;
}

/** 平均年間給与の1期分（過去推移の1点） */
export interface SalaryHistoryPoint {
  /** 決算期（例: "2024年3月期"） */
  fiscalYear: string;
  /** その期の平均年間給与（円） */
  averageSalary: number;
}
