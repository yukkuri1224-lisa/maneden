/** 建物構造（法定耐用年数の決定要素） */
export type BuildingStructure = "rc" | "steel" | "wood";

export interface RealEstateInput {
  /** 物件価格（円） */
  propertyPrice: number;
  /** 年間家賃収入（満室想定・円） */
  annualRent: number;
  /** 諸経費率（家賃に対する%） */
  expenseRate: number;
  /** 建物価格の割合（%・減価償却の対象） */
  buildingRatio: number;
  /** 借入額（円） */
  loanAmount: number;
  /** 借入金利（年%） */
  interestRate: number;
  /** 返済期間（年） */
  loanYears: number;
  /** 建物構造 */
  structure: BuildingStructure;
}

export interface CashFlowPoint {
  /** 経過年 */
  year: number;
  /** その年の元金返済額 */
  principal: number;
  /** その年の利息 */
  interest: number;
  /** その年の減価償却費 */
  depreciation: number;
}

export interface RealEstateResult {
  /** 表面利回り（%） */
  grossYield: number;
  /** 実質利回り（%） */
  netYield: number;
  /** 年間 NOI（純収益） */
  noi: number;
  /** 建物価格（減価償却の対象） */
  buildingValue: number;
  /** 年間減価償却費 */
  annualDepreciation: number;
  /** 耐用年数 */
  usefulLife: number;
  /** 月々のローン返済額 */
  monthlyPayment: number;
  /** 年間ローン返済額 */
  annualDebtService: number;
  /** 総返済額 */
  totalRepayment: number;
  /** 年間の税引前キャッシュフロー */
  beforeTaxCashFlow: number;
  /** デッドクロス発生年（借入期間内で発生しなければ null） */
  deadCrossYear: number | null;
  /** 年次スケジュール */
  schedule: CashFlowPoint[];
}
