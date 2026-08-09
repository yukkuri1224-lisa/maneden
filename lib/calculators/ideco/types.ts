export type IdecoCategory =
  | "company-no-pension" // 会社員（企業年金なし）
  | "company-dc" // 会社員（企業型DCのみ加入）
  | "company-db"; // 会社員（DB等併用）・公務員

export interface IdecoInput {
  /** 年収（額面・円） */
  income: number;
  /** 毎月の掛金（円） */
  monthlyContribution: number;
  /** 現在の年齢（歳） */
  age: number;
  /** 加入区分（掛金の上限が決まる） */
  category: IdecoCategory;
}

export interface IdecoResult {
  /** 加入区分の毎月の掛金上限（円） */
  monthlyCap: number;
  /** 上限でクランプ後の毎月の掛金（円） */
  appliedMonthlyContribution: number;
  /** 年間掛金（円） */
  annualContribution: number;
  /** 適用される所得税の限界税率（%・表示用） */
  marginalIncomeTaxRate: number;
  /** 年間の所得税の軽減額（復興特別所得税込み・円） */
  incomeTaxSaved: number;
  /** 年間の住民税の軽減額（円） */
  residentTaxSaved: number;
  /** 年間の節税額合計（円） */
  annualTaxSaved: number;
  /** 掛金に対する節税率（%）＝ annualTaxSaved / annualContribution */
  savingRate: number;
  /** 掛金の実質的な自己負担（年・円）＝ annualContribution − annualTaxSaved */
  annualNetCost: number;
  /** 60歳までの積立年数（年） */
  yearsToSixty: number;
  /** 60歳までの累計掛金（円） */
  totalContribution: number;
  /** 60歳までの累計節税額（円・現在の税率が続くと仮定した概算） */
  totalTaxSaved: number;
}
