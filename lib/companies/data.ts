import { hasIndustryHub } from "./industries";
import companiesJson from "./companies.json";
import type { Company, CompanyListItem } from "./types";

/** 平均年間給与の妥当な範囲（明らかな抽出ミス＝桁違い等を除外する安全弁） */
const MIN_SALARY = 1_500_000;
const MAX_SALARY = 25_000_000;

/** 妥当な値のみを平均年収の高い順にソートした企業一覧 */
export const companies: Company[] = (companiesJson as Company[])
  .filter((c) => c.averageSalary >= MIN_SALARY && c.averageSalary <= MAX_SALARY)
  .sort((a, b) => b.averageSalary - a.averageSalary);

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

/** 業種ハブを持たない業種（「その他」等）の企業。ハブ経由で辿れないため一覧ページに直接リンクを出す */
export function companiesWithoutHub(): Company[] {
  return companies.filter((c) => !hasIndustryHub(c.industry));
}

/** 一覧表示用の軽量項目に変換する（順序は保持） */
export function toListItems(list: Company[]): CompanyListItem[] {
  return list.map(({ slug, name, industry, averageSalary }) => ({
    slug,
    name,
    industry,
    averageSalary,
  }));
}

/** サンプル（デモ）データを含むか */
export const hasSampleData = companies.some((c) => c.sample);

export type { Company, CompanyListItem };
