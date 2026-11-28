import companiesJson from "./companies.json";
import type { Company } from "./types";

/** 平均年間給与の妥当な範囲（明らかな抽出ミス＝桁違い等を除外する安全弁） */
const MIN_SALARY = 1_500_000;
const MAX_SALARY = 25_000_000;

/**
 * 従業員数を表示してよいか（検証済みか）。
 *
 * 現在の companies.json の従業員数は、取得スクリプトが「連結」の値を拾っている可能性が高い
 * （例: 平均年間給与は提出会社単体の値なのに、従業員数が連結子会社を含む30万人規模、0人の会社もある）。
 * 平均年間給与と集計範囲が一致しない数値を出さないため、正しいデータを再取得・検証するまで非表示にする。
 * 再表示する場合は、提出会社（単体）の値であること・対象年度・取得日を確認してから true にする。
 */
export const EMPLOYEES_VERIFIED = false;

/** 妥当な値のみを平均年収の高い順にソートした企業一覧 */
export const companies: Company[] = (companiesJson as Company[])
  .filter((c) => c.averageSalary >= MIN_SALARY && c.averageSalary <= MAX_SALARY)
  .map((c) => (EMPLOYEES_VERIFIED ? c : { ...c, employees: undefined }))
  .sort((a, b) => b.averageSalary - a.averageSalary);

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

/** サンプル（デモ）データを含むか */
export const hasSampleData = companies.some((c) => c.sample);

export type { Company };
