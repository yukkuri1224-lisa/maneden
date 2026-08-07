import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { CompanyList } from "@/components/companies/CompanyList";
import { companies } from "@/lib/companies/data";
import { hasIndustryHub, industrySlug } from "@/lib/companies/industries";
import { listIndustryStats } from "@/lib/companies/stats";
import { formatManYen } from "@/lib/format";
import { datasetJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "企業の平均年収ランキング",
  description:
    "上場企業約1,500社の平均年収・平均年齢・従業員数を有価証券報告書ベースで掲載。業種別ランキングや会社名検索から、気になる企業の年収と手取り額を確認できます。",
  alternates: { canonical: "/companies" },
};

export default function CompaniesPage() {
  // ハブのある業種を平均年収の高い順に（チップの内部リンク用）
  const industries = listIndustryStats().filter((s) =>
    hasIndustryHub(s.industry),
  );

  return (
    <Container className="py-10">
      <JsonLd
        data={datasetJsonLd({
          name: "上場企業の平均年収データ",
          description: `国内上場企業${companies.length.toLocaleString(
            "ja-JP",
          )}社の平均年収・平均年齢・平均勤続年数・従業員数を有価証券報告書ベースでまとめたデータセット。業種別ランキングや会社名検索から閲覧できます。`,
          url: `${siteConfig.url}/companies`,
          keywords: [
            "平均年収",
            "上場企業",
            "有価証券報告書",
            "年収ランキング",
            "業種別",
          ],
        })}
      />
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "企業の年収", href: "/companies" },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        企業の平均年収ランキング
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        上場企業の平均年収・平均年齢・従業員数（有価証券報告書ベース）。全
        {companies.length.toLocaleString("ja-JP")}
        社を平均年収の高い順に掲載しています。業種で絞り込むか、会社名で検索してください。気になる企業から、手取り額もその場で計算できます。
      </p>

      {/* 業種別ランキングへの導線 */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-muted-foreground">
          業種別の平均年収ランキング
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {industries.map((s) => {
            const slug = industrySlug(s.industry);
            if (!slug) return null;
            return (
              <Link
                key={s.industry}
                href={`/companies/industry/${slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <span>{s.industry}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatManYen(s.average, 0)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <CompanyList companies={companies} filterable />
      </div>
    </Container>
  );
}
