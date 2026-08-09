export interface InheritanceTaxInput {
  /** 遺産の総額（借金・葬式費用を差し引いた後の課税価格・円） */
  estate: number;
  /** 配偶者がいるか */
  hasSpouse: boolean;
  /** 子の人数 */
  children: number;
}

export interface InheritanceTaxResult {
  /** 法定相続人の数 */
  heirCount: number;
  /** 基礎控除額（円） */
  basicDeduction: number;
  /** 課税遺産総額（基礎控除後・円） */
  taxableEstate: number;
  /** 相続税の総額（配偶者の税額軽減 適用前・円） */
  totalTax: number;
  /** 配偶者が法定相続分を相続した場合の負担（配偶者の税額軽減 適用後・円） */
  taxAfterSpouseRelief: number;
  /** 配偶者の税額軽減が使えるか（配偶者あり） */
  hasSpouseRelief: boolean;
  /** 相続人が受け取る額（遺産総額 − 相続税の総額・円） */
  netInheritance: number;
}
