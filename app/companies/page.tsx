import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { companies, hasSampleData } from "@/lib/companies/data";
import { formatManYen } from "@/lib/format";

export const metadata: Metadata = {
  title: "企業の平均年収一覧",
  description:
    "上場企業の平均年収・平均年齢・従業員数を有価証券報告書ベースで一覧。気になる企業の年収から、手取り額もその場で計算できます。",
  alternates: { canonical: "/companies" },
};

export default function CompaniesPage() {
  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "企業の年収", href: "/companies" },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        企業の平均年収一覧
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        上場企業の平均年収・平均年齢・従業員数（有価証券報告書ベース）。気になる企業から、手取り額もその場で計算できます。
      </p>
      {hasSampleData && (
        <p className="mt-2 text-xs text-muted-foreground">
          ※
          現在はサンプルデータを含みます（EDINETからの取得後に実データへ更新されます）。
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="group block h-full"
          >
            <div className="flex h-full flex-col rounded-xl border p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="size-4" aria-hidden />
                </span>
                <span className="text-xs text-muted-foreground">
                  {company.industry}
                </span>
              </div>
              <h2 className="mt-3 font-semibold">{company.name}</h2>
              <p className="text-gradient mt-2 text-2xl font-bold tabular-nums">
                {formatManYen(company.averageSalary, 0)}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                詳しく見る
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
