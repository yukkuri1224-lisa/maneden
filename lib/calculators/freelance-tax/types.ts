/** 青色申告特別控除額 */
export type BlueReturnDeduction = 650000 | 550000 | 100000 | 0;

/** インボイス制度上の区分 */
export type InvoiceStatus =
  | "exempt" // 免税事業者
  | "simplified-2wari" // 課税事業者（2割特例）
  | "simplified" // 課税事業者（簡易課税）
  | "general"; // 課税事業者（本則課税）

/** 簡易課税のみなし仕入率区分（第1種〜第6種） */
export type BusinessCategory = 1 | 2 | 3 | 4 | 5 | 6;

export interface FreelanceTaxInput {
  /** 年間売上（税込・円） */
  revenue: number;
  /** 年間経費（円） */
  expenses: number;
  /** 青色申告特別控除額 */
  blueReturnDeduction: BlueReturnDeduction;
  /** 扶養親族の数（16歳以上の一般扶養・概算） */
  dependents: number;
  /** 配偶者控除・配偶者特別控除の対象とするか */
  hasSpouse: boolean;
  /** 配偶者の合計所得金額（円・配偶者特別控除の判定用） */
  spouseIncome: number;
  /** インボイス制度上の区分 */
  invoiceStatus: InvoiceStatus;
  /** 簡易課税のみなし仕入率区分（既定: 第5種＝サービス業） */
  businessCategory: BusinessCategory;
  /** 40歳以上（国保の介護分対象）か */
  isOver40: boolean;
}

export interface FreelanceTaxResult {
  /** 事業所得 = 売上 − 経費 − 青色申告特別控除 */
  businessIncome: number;
  /** 所得控除の合計（所得税ベース） */
  totalDeductions: number;
  /** 課税所得（所得税ベース・1000円未満切り捨て） */
  taxableIncome: number;
  /** 所得税（復興特別所得税を含む） */
  incomeTax: number;
  /** 復興特別所得税 */
  reconstructionTax: number;
  /** 住民税（所得割 ＋ 均等割） */
  residentTax: number;
  /** 国民健康保険料 */
  nationalHealthInsurance: number;
  /** 国民年金保険料 */
  nationalPension: number;
  /** 消費税納付額 */
  consumptionTax: number;
  /** 税・社会保険料の合計 */
  totalBurden: number;
  /** 年間手取り額 */
  netIncome: number;
  /** 手取り率（%） */
  netIncomeRate: number;
  /** インボイス登録による負担額（免税のままとの差＝登録時の消費税納付額） */
  invoiceImpact: number;
}
