import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { BreakdownBar } from "@/components/common/BreakdownBar";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { calculateFurusato } from "@/lib/calculators/furusato-tax";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { companies, getCompanyBySlug } from "@/lib/companies/data";
import { hasIndustryHub, industrySlug } from "@/lib/companies/industries";
import { getCompanyRanking } from "@/lib/companies/stats";
import { NATIONAL_AVERAGE_SALARY } from "@/lib/constants/national-salary";
import { TAX_YEAR } from "@/lib/constants/tax-tables";
import { formatManYen } from "@/lib/format";
import { datasetJsonLd, faqJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
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
  const isOver40 = (company.averageAge ?? 0) >= 40;
  const takeHome = calculateSalaryTakeHome({
    income: company.averageSalary,
    isOver40,
    hasSpouse: false,
    dependents: 0,
  });
  const monthlyTakeHome = takeHome.netIncome / 12;
  // この年収でのふるさと納税上限額（上で算出した社会保険料を用いた概算）
  const furusatoLimit = calculateFurusato({
    incomeType: "salary",
    income: company.averageSalary,
    socialInsurance: takeHome.socialInsurance,
    hasSpouse: false,
    dependents: 0,
  }).donationLimit;

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

  // 企業ページ固有のFAQ（すべて掲載データ・計算結果からの事実。推測なし）
  const companyFaqs: { question: string; answer: string }[] = [
    {
      question: `${company.name}の平均年収はいくらですか？`,
      answer: `有価証券報告書ベースで${formatManYen(
        company.averageSalary,
        0,
      )}です。全国平均（${national.year}・約${formatManYen(
        national.value,
        0,
      )}）の約${nationalRatio}倍で、${company.industry}${
        ranking.industryCount
      }社の中では第${ranking.industryRank}位、全上場${ranking.overallTotal.toLocaleString(
        "ja-JP",
      )}社中${ranking.overallRank.toLocaleString("ja-JP")}位です。`,
    },
    {
      question: `${company.name}の平均年収での手取りはいくらですか？`,
      answer: `額面${formatManYen(
        company.averageSalary,
        0,
      )}（独身・扶養なしの概算）の場合、社会保険料・所得税・住民税を差し引いた手取りは約${formatManYen(
        takeHome.netIncome,
        0,
      )}です。手取り率は約${takeHome.netIncomeRate.toFixed(
        1,
      )}%、月あたり約${formatManYen(monthlyTakeHome, 1)}が目安です。`,
    },
  ];
  if (profileParts.length > 0) {
    companyFaqs.push({
      question: `${company.name}の平均年齢・勤続年数・従業員数は？`,
      answer: `有価証券報告書によると、${profileParts.join("、")}です。`,
    });
  }
  if (furusatoLimit > 0) {
    companyFaqs.push({
      question: `${company.name}の年収だとふるさと納税はいくらまでできますか？`,
      answer: `年収${formatManYen(
        company.averageSalary,
        0,
      )}（独身・扶養なし）なら、控除上限額は約${formatManYen(
        furusatoLimit,
        0,
      )}が目安です。この範囲内なら自己負担2,000円で寄付でき、他の控除があると上限は変わります。`,
    });
  }
  companyFaqs.push({
    question: "この平均年収データの出典は何ですか？",
    answer:
      "各社が金融庁の開示システムEDINETに提出した有価証券報告書の「平均年間給与」等の公開情報に基づく概算です。最新・正確な値は各社の有価証券報告書でご確認ください。",
  });

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
      <JsonLd data={faqJsonLd(companyFaqs)} />
      <JsonLd
        data={datasetJsonLd({
          name: `${company.name}の平均年収データ（有価証券報告書ベース）`,
          description: `${company.name}（${company.industry}）の平均年間給与${formatManYen(
            company.averageSalary,
            0,
          )}、${company.averageAge != null ? `平均年齢${company.averageAge}歳、` : ""}${
            company.averageTenure != null
              ? `平均勤続年数${company.averageTenure}年、`
              : ""
          }${company.employees != null ? `従業員数${company.employees.toLocaleString("ja-JP")}人。` : ""}金融庁EDINETの有価証券報告書の公開情報に基づく。`,
          url: `${siteConfig.url}/companies/${company.slug}`,
          keywords: [
            company.name,
            "平均年収",
            company.industry,
            "有価証券報告書",
          ],
        })}
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

      {/* 順位バッジ（スキャン性・重要指標を最上部に） */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary tabular-nums">
          {company.industry} {ranking.industryRank}位
          <span className="ml-1 font-normal text-primary/70">
            / {ranking.industryCount}社
          </span>
        </span>
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-semibold tabular-nums">
          全上場 {ranking.overallRank.toLocaleString("ja-JP")}位
          <span className="ml-1 font-normal text-muted-foreground">
            / {ranking.overallTotal.toLocaleString("ja-JP")}社
          </span>
        </span>
      </div>

      {/* AEO: H1直下に直接回答＋引用可能な数値 */}
      <p className="mt-3 max-w-2xl text-[15px] leading-7">
        <strong className="text-foreground">
          {company.name}の平均年収は{formatManYen(company.averageSalary, 0)}、
          {company.industry}
          {ranking.industryCount}社中{ranking.industryRank}位です。
        </strong>{" "}
        この年収の手取りは約{formatManYen(takeHome.netIncome, 0)}
        （月あたり約{formatManYen(monthlyTakeHome, 1)}
        ）が目安です（有価証券報告書ベース・東京都・独身の概算）。
      </p>

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

      {/* 手取り内訳（サーバー側で静的生成 → クローラー可読・ロングテール獲得） */}
      <section className="mt-10 rounded-2xl border bg-accent/40 p-6">
        <h2 className="text-xl font-bold sm:text-2xl">
          {company.name}の平均年収{formatManYen(company.averageSalary, 0)}
          、手取りはいくら？
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          年収{formatManYen(company.averageSalary, 0)}（
          {company.averageAge != null ? `${company.averageAge}歳・` : ""}
          独身・扶養なし・東京都の協会けんぽ令和8年度料率
          {isOver40 ? "・介護保険料を含む" : ""}
          ）で計算した場合の、手取りの内訳の目安です。
        </p>

        <h3 className="mt-5 text-base font-bold">手取りの内訳</h3>
        <div className="mt-3 overflow-x-auto rounded-xl border bg-background">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  額面年収
                </th>
                <td className="px-4 py-3 text-right tabular-nums">
                  {company.averageSalary.toLocaleString("ja-JP")}円
                </td>
              </tr>
              <tr className="border-b">
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                >
                  社会保険料
                </th>
                <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                  −
                  {Math.round(takeHome.socialInsurance).toLocaleString("ja-JP")}
                  円
                </td>
              </tr>
              <tr className="border-b">
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                >
                  所得税（復興特別所得税含む）
                </th>
                <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                  −{Math.round(takeHome.incomeTax).toLocaleString("ja-JP")}円
                </td>
              </tr>
              <tr className="border-b">
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                >
                  住民税
                </th>
                <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                  −{Math.round(takeHome.residentTax).toLocaleString("ja-JP")}円
                </td>
              </tr>
              <tr className="bg-muted/40">
                <th scope="row" className="px-4 py-3 text-left font-bold">
                  手取り
                </th>
                <td className="px-4 py-3 text-right font-bold tabular-nums">
                  約{Math.round(takeHome.netIncome).toLocaleString("ja-JP")}円
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    （月あたり約{formatManYen(monthlyTakeHome, 1)}）
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <BreakdownBar
            formatValue={(v) => formatManYen(v, 0)}
            segments={[
              {
                label: "手取り",
                value: takeHome.netIncome,
                colorClass: "bg-emerald-500",
              },
              {
                label: "社会保険料",
                value: takeHome.socialInsurance,
                colorClass: "bg-sky-500",
              },
              {
                label: "所得税",
                value: takeHome.incomeTax,
                colorClass: "bg-amber-500",
              },
              {
                label: "住民税",
                value: takeHome.residentTax,
                colorClass: "bg-violet-500",
              },
            ]}
          />
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          手取り率は約{takeHome.netIncomeRate.toFixed(1)}%
          {furusatoLimit > 0 && (
            <>
              。この年収なら
              <strong className="text-foreground">
                ふるさと納税は約{formatManYen(furusatoLimit, 0)}
              </strong>
              まで、自己負担2,000円で寄付できる目安です
            </>
          )}
          。
        </p>

        <div className="mt-5 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:flex-wrap">
          <Link
            href={`/tools/salary-take-home?inc=${company.averageSalary}`}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            扶養・居住地を変えて手取りを計算する
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={`/tools/furusato-tax?inc=${company.averageSalary}`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            この年収でふるさと納税の上限額を計算する
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-4 text-sm">
          <span className="text-muted-foreground">関連する計算ツール:</span>
          <Link
            href="/tools/bonus-take-home"
            className="font-medium text-primary underline underline-offset-2"
          >
            ボーナスの手取り
          </Link>
          <Link
            href="/tools/ideco"
            className="font-medium text-primary underline underline-offset-2"
          >
            iDeCoの節税額
          </Link>
        </div>
      </section>

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

      <section className="mt-12">
        <h2 className="text-lg font-semibold">
          {company.name}の年収・手取りに関するよくある質問
        </h2>
        <dl className="mt-4 space-y-4 text-sm">
          {companyFaqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold">{faq.question}</dt>
              <dd className="mt-1 text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-label="出典と更新情報"
        className="mt-6 rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground"
      >
        <p>
          <span className="font-medium text-foreground">出典：</span>
          {company.name}
          の平均年間給与・平均年齢・平均勤続年数・従業員数は、同社が金融庁
          <a
            href="https://disclosure2.edinet-fsa.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            EDINET
          </a>
          に提出した有価証券報告書の公開情報に基づきます。順位・偏差は、当サイト掲載の
          {ranking.overallTotal.toLocaleString("ja-JP")}
          社（{company.industry}は{ranking.industryCount}
          社）を母数とした集計です。
        </p>
        <p className="mt-2">
          手取り額・税額は{TAX_YEAR}年度の税制・料率に基づく概算です。詳しくは
          <Link href="/disclaimer" className="underline">
            免責事項
          </Link>
          をご確認ください。
        </p>
        <p className="mt-1">最終更新日: 2026年8月12日</p>
      </section>

      {related.length > 0 && (
        <div className="mt-12">
          <JsonLd
            data={itemListJsonLd(
              related.map((c) => ({
                name: `${c.name}の平均年収`,
                url: `${siteConfig.url}/companies/${c.slug}`,
              })),
            )}
          />
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
