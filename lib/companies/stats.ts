import { companies } from "./data";
import type { Company } from "./types";

/**
 * 企業の平均年収に関する集計・順位付け。
 * `companies` は平均年収の降順ソート済みなので、配列インデックスがそのまま順位になる。
 * すべてビルド時に一度だけ計算される（静的生成）。
 */

// 全体順位（1 始まり）
const overallRankBySlug = new Map<string, number>();
companies.forEach((company, index) => {
  overallRankBySlug.set(company.slug, index + 1);
});

// 業種ごとのグループ（各グループも降順のまま）
const byIndustry = new Map<string, Company[]>();
for (const company of companies) {
  const list = byIndustry.get(company.industry);
  if (list) list.push(company);
  else byIndustry.set(company.industry, [company]);
}

function average(list: Company[]): number {
  if (list.length === 0) return 0;
  const sum = list.reduce((acc, c) => acc + c.averageSalary, 0);
  return Math.round(sum / list.length);
}

export interface IndustryStats {
  industry: string;
  /** 平均年収の降順 */
  companies: Company[];
  count: number;
  average: number;
}

export function getIndustryStats(industry: string): IndustryStats {
  const list = byIndustry.get(industry) ?? [];
  return {
    industry,
    companies: list,
    count: list.length,
    average: average(list),
  };
}

export interface CompanyRanking {
  overallRank: number;
  overallTotal: number;
  industryRank: number;
  industryCount: number;
  industryAverage: number;
  /** 業種内で上位何%か（1〜100、小さいほど上位） */
  industryTopPercent: number;
}

export function getCompanyRanking(company: Company): CompanyRanking {
  const list = byIndustry.get(company.industry) ?? [];
  const industryRank = list.findIndex((c) => c.slug === company.slug) + 1;
  const industryCount = list.length;
  const industryTopPercent =
    industryCount > 0
      ? Math.max(1, Math.round((industryRank / industryCount) * 100))
      : 100;

  return {
    overallRank: overallRankBySlug.get(company.slug) ?? 0,
    overallTotal: companies.length,
    industryRank,
    industryCount,
    industryAverage: average(list),
    industryTopPercent,
  };
}

/** ハブ一覧用：業種ごとの集計を平均年収の高い順に並べて返す */
export function listIndustryStats(): IndustryStats[] {
  return [...byIndustry.keys()]
    .map((industry) => getIndustryStats(industry))
    .sort((a, b) => b.average - a.average);
}
