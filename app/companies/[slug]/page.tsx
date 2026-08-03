import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { companies, getCompanyBySlug } from "@/lib/companies/data";
import { formatManYen } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return {};

  const title = `${company.name}の平均年収は${formatManYen(
    company.averageSalary,
    0,
  )}｜手取りも計算`;
  const description = `${company.name}（${company.industry}）の平均年収・平均年齢・従業員数を有価証券報告書ベースで掲載。この年収での手取り額もその場で計算できます。`;

  return {
    title,
    description,
    alternates: { canonical: `/companies/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/companies/${slug}`,
    },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const stats = [
    company.averageAge != null
      ? { label: "平均年齢", value: `${company.averageAge}歳` }
      : null,
    company.averageTenure != null
      ? { label: "平均勤続年数", value: `${company.averageTenure}年` }
      : null,
    company.employees != null
      ? {
          label: "従業員数",
          value: `${company.employees.toLocaleString("ja-JP")}人`,
        }
      : null,
    company.fiscalYear
      ? { label: "対象決算期", value: company.fiscalYear }
      : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  const related =
    company.industry && company.industry !== "その他"
      ? companies
          .filter(
            (c) => c.industry === company.industry && c.slug !== company.slug,
          )
          .slice(0, 3)
      : [];

  return (
    <Container className="py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: company.name,
          industry: company.industry,
        }}
      />
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "企業の年収", href: "/companies" },
          { name: company.name, href: `/companies/${company.slug}` },
        ]}
      />

      <p className="mt-4 text-sm text-muted-foreground">
        {company.industry}
        {company.securitiesCode ? `・証券コード ${company.securitiesCode}` : ""}
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
        {company.name}の平均年収
      </h1>

      <div className="mt-6 rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm text-muted-foreground">
          平均年間給与（有価証券報告書ベース）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-6xl">
          {formatManYen(company.averageSalary, 0)}
        </p>
      </div>

      {stats.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 手取り計算への導線 */}
      <div className="mt-8 rounded-2xl border bg-accent/40 p-6">
        <p className="font-semibold">この年収だと、手取りはいくら？</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {company.name}の平均年収 {formatManYen(company.averageSalary, 0)}{" "}
          を、会社員の手取り計算にそのまま反映します。
        </p>
        <Link
          href={`/tools/salary-take-home?inc=${company.averageSalary}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-4")}
        >
          この年収の手取りを計算する
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        ※ 数値は有価証券報告書ベースの
        {company.sample ? "サンプル" : "概算"}
        です。最新・正確な値は各社の有価証券報告書（EDINET）でご確認ください。
      </p>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold">同じ業種の企業</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="rounded-xl border p-4 transition-colors hover:border-primary/30"
              >
                <p className="font-medium">{c.name}</p>
                <p className="text-gradient mt-1 font-bold tabular-nums">
                  {formatManYen(c.averageSalary, 0)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/companies"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← 企業の年収一覧へ
        </Link>
      </div>
    </Container>
  );
}
