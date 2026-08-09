export type GiftType = "special" | "general";

export interface GiftTaxInput {
  /** その年に受け取った贈与の合計額（円） */
  amount: number;
  /** 贈与の種類（特例＝直系尊属→18歳以上の子・孫／一般＝それ以外） */
  giftType: GiftType;
}

export interface GiftTaxResult {
  /** 基礎控除額（110万円・円） */
  basicDeduction: number;
  /** 課税価格（贈与額 − 基礎控除・円） */
  taxableAmount: number;
  /** 贈与税額（円） */
  taxAmount: number;
  /** 手元に残る額（贈与額 − 税額・円） */
  netAmount: number;
  /** 実効税率（税額 ÷ 贈与額・%） */
  effectiveRate: number;
  /** 適用された限界税率（%・表示用） */
  marginalRate: number;
}
