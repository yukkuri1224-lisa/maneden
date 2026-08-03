import companiesJson from "./companies.json";
import type { Company } from "./types";

/** 平均年収の高い順にソートした企業一覧 */
export const companies: Company[] = [...(companiesJson as Company[])].sort(
  (a, b) => b.averageSalary - a.averageSalary,
);

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

/** サンプル（デモ）データを含むか */
export const hasSampleData = companies.some((c) => c.sample);

export type { Company };
