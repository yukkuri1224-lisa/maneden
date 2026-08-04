import type { Metadata } from "next";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { CompanyList } from "@/components/companies/CompanyList";
import { companies } from "@/lib/companies/data";

export const metadata: Metadata = {
  title: "企業の平均年収ランキング",
  description:
    "上場企業の平均年収・平均年齢・従業員数を有価証券報告書ベースで掲載。気になる企業の年収から、手取り額もその場で計算できます。",
  alternates: { canonical: "/companies" },
};

/** 一覧に表示する上位社数（全社は各企業ページ・sitemapからアクセス可能） */
const TOP_LIMIT = 150;

export default function CompaniesPage() {
  const top = companies.slice(0, TOP_LIMIT);

  return (
    <Container className="py-10">
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
        社を掲載しており、ここでは平均年収の高い順に上位{TOP_LIMIT}
        社を表示しています。気になる企業から、手取り額もその場で計算できます。
      </p>

      <div className="mt-8">
        <CompanyList companies={top} />
      </div>
    </Container>
  );
}
