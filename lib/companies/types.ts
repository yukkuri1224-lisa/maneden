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
  /** デモ用のサンプルデータか（EDINET取得の実データはこのフラグを持たない） */
  sample?: boolean;
}
