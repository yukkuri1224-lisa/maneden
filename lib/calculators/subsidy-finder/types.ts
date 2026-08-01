export type BusinessType = "corporation" | "sole-proprietor";

export type Purpose =
  | "it" // IT・デジタル導入
  | "equipment" // 設備投資
  | "sales-channel" // 販路開拓・広報
  | "restructuring" // 新分野・業態転換
  | "startup" // 創業・スタートアップ
  | "wage-hike"; // 賃上げ・雇用

export type Difficulty = "low" | "mid" | "high";

export interface SubsidyInput {
  /** 法人 / 個人事業主 */
  businessType: BusinessType;
  /** 従業員数 */
  employees: number;
  /** 事業目的（複数選択） */
  purposes: Purpose[];
  /** 投資予定額（円） */
  investmentAmount: number;
}

export interface SubsidyProgram {
  id: string;
  name: string;
  /** 対象となる事業目的 */
  purposes: Purpose[];
  /** 補助率の下限（0〜1） */
  subsidyRateMin: number;
  /** 補助率の上限（0〜1） */
  subsidyRateMax: number;
  /** 補助上限額（円） */
  maxAmount: number;
  /** 小規模事業者限定か */
  smallBusinessOnly: boolean;
  /** 小規模の従業員数上限（該当時） */
  smallBusinessEmployeeMax?: number;
  /** 申請難易度の目安 */
  difficulty: Difficulty;
  /** 概要 */
  summary: string;
  /** 公式サイト URL */
  url: string;
}

export interface SubsidyMatch {
  program: SubsidyProgram;
  /** 概算受給額（上限補助率ベース・上限額でキャップ） */
  estimatedAmount: number;
  /** 概算受給額の下限（下限補助率ベース） */
  estimatedMin: number;
}
