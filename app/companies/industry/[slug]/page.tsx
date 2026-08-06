import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { CompanyList } from "@/components/companies/CompanyList";
import {
  INDUSTRY_SLUGS,
  NO_HUB_INDUSTRIES,
  industryFromSlug,
} from "@/lib/companies/industries";
import { getIndustryStats } from "@/lib/companies/stats";
import { NATIONAL_AVERAGE_SALARY } from "@/lib/constants/national-salary";
import { formatManYen } from "@/lib/format";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return Object.entries(INDUSTRY_SLUGS)
    .filter(([name]) => !NO_HUB_INDUSTRIES.has(name))
    .map(([, slug]) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryFromSlug(slug);
  if (!industry) return {};
  const { average, count } = getIndustryStats(industry);

  const title = `${industry}の平均年収ランキング（${count}社）`;
  const description = `${industry}の上場企業${count}社の平均年収は${formatManYen(
    average,
    0,
  )}。有価証券報告書ベースで平均年収の高い順にランキング。気になる企業の手取りもその場で計算できます。`;

  return {
    title,
    description,
    alternates: { canonical: `/companies/industry/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/companies/industry/${slug}`,
    },
  };
}

export default async function IndustryHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industryFromSlug(slug);
  if (!industry || NO_HUB_INDUSTRIES.has(industry)) notFound();

  const { companies, average, count } = getIndustryStats(industry);
  if (count === 0) notFound();

  const national = NATIONAL_AVERAGE_SALARY;
  const diff = average - national.value;
  const diffText =
    diff >= 0
      ? `${formatManYen(Math.abs(diff), 0)}高い`
      : `${formatManYen(Math.abs(diff), 0)}低い`;

  return (
    <Container className="py-10">
      <JsonLd
        data={itemListJsonLd(
          companies.slice(0, 30).map((c) => ({
            name: c.name,
            url: `${siteConfig.url}/companies/${c.slug}`,
          })),
        )}
      />
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "企業の年収", href: "/companies" },
          { name: industry, href: `/companies/industry/${slug}` },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        {industry}の平均年収ランキング
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {industry}の上場企業{count}社の平均年収は
        <strong className="text-foreground">{formatManYen(average, 0)}</strong>
        で、全国平均（約{formatManYen(national.value, 0)}）より{diffText}
        水準です。
        有価証券報告書ベースで、平均年収の高い順に掲載しています。気になる企業から、手取り額もその場で計算できます。
      </p>

      <div className="mt-8">
        <CompanyList companies={companies} />
      </div>

      <div className="mt-10">
        <Link
          href="/companies"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← すべての業種・企業の一覧へ
        </Link>
      </div>
    </Container>
  );
}
