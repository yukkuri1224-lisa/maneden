import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { companies, getCompanyBySlug } from "@/lib/companies/data";
import { hasIndustryHub, industrySlug } from "@/lib/companies/industries";
import { getCompanyRanking } from "@/lib/companies/stats";
import { NATIONAL_AVERAGE_SALARY } from "@/lib/constants/national-salary";
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
  const description = `${company.name}（${company.industry}）の平均年収を全国平均・業種平均と比較。平均年齢・勤続年数・従業員数を有価証券報告書ベースで掲載し、この年収での手取り額も計算できます。`;

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

/** 差額を「190万円上回り」のように整形（絶対値＋上回る/下回る） */
function comparePhrase(diff: number, verbUp: string, verbDown: string): string {
  const amount = formatManYen(Math.abs(diff), 0);
  return diff >= 0 ? `${amount}${verbUp}` : `${amount}${verbDown}`;
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const ranking = getCompanyRanking(company);
  const national = NATIONAL_AVERAGE_SALARY;
  const nationalDiff = company.averageSalary - national.value;
  const industryDiff = company.averageSalary - ranking.industryAverage;
  const nationalRatio = (company.averageSalary / national.value).toFixed(1);

  // 手取り目安（独身・扶養なし。年齢が分かれば介護保険の対象かを反映）
  const takeHome = calculateSalaryTakeHome({
    income: company.averageSalary,
    isOver40: (company.averageAge ?? 0) >= 40,
    hasSpouse: false,
    dependents: 0,
  }).netIncome;

  const hubSlug = hasIndustryHub(company.industry)
    ? industrySlug(company.industry)
    : undefined;

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
  ].filter((s): s is { label: string; value: string } => s !== null);

  const related =
    company.industry && company.industry !== "その他"
      ? companies
          .filter(
            (c) => c.industry === company.industry && c.slug !== company.slug,
          )
          .slice(0, 6)
      : [];

  // 各社固有の説明文（データから動的生成 → 薄いテンプレを脱する）
  const introSentences = [
    `${company.name}（${company.industry}）の平均年間給与は${formatManYen(
      company.averageSalary,
      0,
    )}です。これは全国平均（${national.year}・約${formatManYen(
      national.value,
      0,
    )}）の約${nationalRatio}倍で、${company.industry}${ranking.industryCount}社の中では第${ranking.industryRank}位${
      ranking.industryTopPercent <= 50
        ? `（上位${ranking.industryTopPercent}%）`
        : ""
    }に位置します。`,
  ];
  const profileParts: string[] = [];
  if (company.averageAge != null)
    profileParts.push(`平均年齢は${company.averageAge}歳`);
  if (company.averageTenure != null)
    profileParts.push(`平均勤続年数は${company.averageTenure}年`);
  if (company.employees != null)
    profileParts.push(
      `従業員数は${company.employees.toLocaleString("ja-JP")}人`,
    );
  if (profileParts.length > 0)
    introSentences.push(`${profileParts.join("、")}です。`);

  return (
    <Container className="py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: company.name,
          industry: company.industry,
          url: `${siteConfig.url}/companies/${company.slug}`,
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
        {hubSlug ? (
          <Link
            href={`/companies/industry/${hubSlug}`}
            className="font-medium text-primary hover:underline"
          >
            {company.industry}
          </Link>
        ) : (
          company.industry
        )}
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
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          全国平均（約{formatManYen(national.value, 0)}）を
          {comparePhrase(nationalDiff, "上回り", "下回り")}、{company.industry}
          の平均（{formatManYen(ranking.industryAverage, 0)}）を
          {comparePhrase(industryDiff, "上回ります", "下回ります")}。
        </p>
      </div>

      {/* 順位 */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">
            {company.industry}内の順位
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {ranking.industryRank}位
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              / {ranking.industryCount}社
            </span>
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">全上場企業中の順位</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {ranking.overallRank.toLocaleString("ja-JP")}位
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              / {ranking.overallTotal.toLocaleString("ja-JP")}社
            </span>
          </p>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
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

      {/* 各社固有の説明文 */}
      <div className="mt-6 space-y-3 leading-relaxed text-muted-foreground">
        {introSentences.map((sentence, i) => (
          <p key={i}>{sentence}</p>
        ))}
      </div>

      {/* 手取り計算への導線（目安をその場で表示） */}
      <div className="mt-8 rounded-2xl border bg-accent/40 p-6">
        <p className="font-semibold">この年収の手取りの目安</p>
        <p className="text-gradient mt-1 text-3xl font-black tabular-nums">
          約{formatManYen(takeHome, 0)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {company.name}の平均年収 {formatManYen(company.averageSalary, 0)}{" "}
          をもとにした概算です（独身・扶養なしの場合）。家族構成などの条件を反映して詳しく計算できます。
        </p>
        <Link
          href={`/tools/salary-take-home?inc=${company.averageSalary}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-4")}
        >
          条件を入れて手取りを計算する
          <ArrowRight className="size-4" />
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-4 text-sm">
          <span className="text-muted-foreground">関連する計算ツール:</span>
          <Link
            href="/tools/bonus-take-home"
            className="font-medium text-primary underline underline-offset-2"
          >
            ボーナスの手取り
          </Link>
          <Link
            href="/tools/furusato-tax"
            className="font-medium text-primary underline underline-offset-2"
          >
            ふるさと納税の上限額
          </Link>
          <Link
            href="/tools/ideco"
            className="font-medium text-primary underline underline-offset-2"
          >
            iDeCoの節税額
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        ※ 平均年間給与は有価証券報告書ベースの
        {company.sample ? "サンプル" : "概算"}
        です。最新・正確な値は各社の有価証券報告書（
        <a
          href="https://disclosure2.edinet-fsa.go.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          EDINET
        </a>
        ）でご確認ください。全国平均は
        <a
          href={national.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {national.source}
        </a>
        （{national.year}）によります。
      </p>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold">
            同じ{company.industry}の企業
          </h2>
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
          {hubSlug && (
            <Link
              href={`/companies/industry/${hubSlug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {company.industry}の平均年収ランキングをすべて見る
              <ArrowRight className="size-4" />
            </Link>
          )}
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
