/** 変換の向き */
export type ConvertMode = "hourly-to-annual" | "annual-to-hourly";

export interface HourlyWageInput {
  /** 変換の向き */
  mode: ConvertMode;
  /** 時給（円）— hourly-to-annual のとき入力値として使用 */
  hourlyWage: number;
  /** 年収（額面・円）— annual-to-hourly のとき入力値として使用 */
  annualIncome: number;
  /** 1日の労働時間（時間） */
  hoursPerDay: number;
  /** 週の労働日数（日） */
  daysPerWeek: number;
}

export interface HourlyWageResult {
  /** 時給（円） */
  hourlyWage: number;
  /** 日給（円） */
  dailyWage: number;
  /** 週給（円） */
  weeklyWage: number;
  /** 月収（円・年収 ÷ 12） */
  monthlyWage: number;
  /** 年収（額面・円） */
  annualIncome: number;
  /** 週の労働時間（時間） */
  weeklyHours: number;
  /** 年間労働時間（時間） */
  annualHours: number;
}
