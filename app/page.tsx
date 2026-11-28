import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { ToolCard, ToolIndex } from "@/components/common/ToolCard";
import { buttonVariants } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  faqJsonLd,
  itemListJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById, toolCategories, tools } from "@/lib/tools-registry";
import { guides } from "@/lib/guides";
import { companies } from "@/lib/companies/data";
import { formatManYen } from "@/lib/format";
import { cn } from "@/lib/utils";

// トップは最重要 URL。canonical と、SERPスニペットを使い切る説明文を明示する。
const HOME_TITLE = `${siteConfig.name}｜税金・手取り・経営・不動産の無料計算ツール`;
const homeMetadata = pageMetadata({
  title: HOME_TITLE,
  description:
    "年収の手取り・ふるさと納税の上限・退職金や贈与税まで、税金とお金の計算が登録不要・完全無料で完結。会社員もフリーランスも使えるシミュレーター14種と上場企業の平均年収データを収録。",
  path: "/",
});
// <title> は layout の default を使うため title を除く（og:title は HOME_TITLE）
delete homeMetadata.title;
export const metadata: Metadata = homeMetadata;

/** まねでんの方針（旧「選ばれる理由」「使い方」を統合） */
const principles = [
  {
    title: "入力した金額は、外に出しません",
    body: "計算はすべてお使いのブラウザの中で行います。年収や経費などの入力内容がサーバーへ送信・保存されることはありません。",
  },
  {
    title: "登録なしで、何度でも無料",
    body: "会員登録もログインも不要です。開いてすぐ使え、入力内容は URL に保存されるので、そのままブックマークや共有ができます。",
  },
  {
    title: "計算の根拠を、画面に載せます",
    body: "内訳・計算式・用語・出典を各ツールに掲載しています。「なぜこの金額になるのか」を確かめながら使えます。",
  },
];

const faqs = [
  {
    question: "まねでんは本当に無料ですか？",
    answer:
      "はい。すべてのツールが登録不要・無料です。開いてすぐ使え、利用回数の制限もありません。",
  },
  {
    question: "入力した金額は保存されますか？",
    answer:
      "いいえ。計算はすべてお使いのブラウザ内で行われ、収入や経費などの情報が外部のサーバーに送信・保存されることはありません。",
  },
  {
    question: "どんな計算ができますか？",
    answer:
      "フリーランス・会社員の手取りや税金、ふるさと納税の上限、iDeCoの節税や新NISAの積立、退職金やボーナスの手取り、贈与税・相続税、住宅ローンや不動産の利回りまで、幅広いお金の計算ができます。iDeCoと新NISAの使い分けなどのガイド記事も掲載しています。",
  },
];

/** ヒーローの明細（会社員の手取り計算ツールで年収500万円・東京都・独身・39歳以下を計算した値） */
const sampleLedger = [
  { label: "額面年収", value: "5,000,000円" },
  { label: "社会保険料", value: "−723,148円" },
  { label: "所得税", value: "−130,700円" },
  { label: "住民税", value: "−245,600円" },
];

export default function Home() {
  const featured = getToolById("freelance-tax");
  const salaryTool = getToolById("salary-take-home");
  const topCompanies = companies.slice(0, 6);

  return (
    <>
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={webApplicationJsonLd({
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={itemListJsonLd(
          tools.map((tool) => ({
            name: tool.title,
            url: `${siteConfig.url}${tool.href}`,
          })),
        )}
      />

      {/* ===== ヒーロー ===== */}
      <section className="border-b">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px w-8 bg-highlight" aria-hidden />
              登録不要・無料・入力はブラウザの中だけで計算
            </p>
            <h1 className="mt-5 text-[1.75rem] font-bold sm:text-4xl lg:text-[2.75rem]">
              税金や手取りの計算を、
              <br />
              まとめて無料で。
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground sm:text-lg">
              フリーランス・個人事業主・会社員向けの計算ツールをそろえました。確定申告や手取り、ふるさと納税、不動産まで、登録なしでその場で試せます。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {featured && (
                <Link
                  href={featured.href}
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  {featured.shortTitle}を使う
                  <ArrowRight data-icon="inline-end" />
                </Link>
              )}
              <Link
                href="/tools"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                すべてのツールを見る
              </Link>
            </div>
          </div>

          {/* 明細の例 */}
          <figure className="rounded-md border bg-card p-5 sm:p-7">
            <figcaption className="flex items-baseline justify-between gap-3 border-b pb-3">
              <span className="font-heading text-lg font-semibold">
                手取りの明細
              </span>
              <span className="text-xs text-muted-foreground">
                例：年収500万円・東京都・独身
              </span>
            </figcaption>
            <dl className="mt-4 flex flex-col gap-3 text-sm sm:text-base">
              {sampleLedger.map((row) => (
                <div key={row.label} className="ledger-row">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <span className="ledger-leader" aria-hidden />
                  <dd className="tabular-nums">{row.value}</dd>
                </div>
              ))}
              <div className="ledger-row mt-2 border-t pt-4">
                <dt className="font-medium">手取り</dt>
                <span className="ledger-leader" aria-hidden />
                <dd className="answer-underline text-2xl font-bold text-primary tabular-nums sm:text-3xl">
                  3,900,552円
                </dd>
              </div>
            </dl>
            {salaryTool && (
              <Link
                href={salaryTool.href}
                className="mt-6 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                自分の年収で計算する
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            )}
          </figure>
        </Container>

        {/* 数字で見るまねでん */}
        <div className="border-t bg-muted">
          <Container>
            <dl className="grid grid-cols-2 divide-border py-6 sm:grid-cols-4 sm:divide-x">
              {[
                { value: `${tools.length}`, unit: "種類", label: "計算ツール" },
                {
                  value: companies.length.toLocaleString("ja-JP"),
                  unit: "社",
                  label: "上場企業の年収データ",
                },
                { value: "0", unit: "円", label: "利用料" },
                { value: "0", unit: "件", label: "送信される入力データ" },
              ].map((item) => (
                <div key={item.label} className="px-2 py-2 sm:px-6">
                  <dt className="text-xs text-muted-foreground sm:text-sm">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-heading text-2xl font-bold tabular-nums">
                    {item.value}
                    <span className="ml-0.5 font-sans text-sm font-medium">
                      {item.unit}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {/* ===== ツール ===== */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            title={`${tools.length}種類の計算ツール`}
            lead="確定申告の手取りから、ふるさと納税の上限、補助金、不動産の利回りまで。用途に合わせて選べます。"
          />
          <div className="mt-10 flex flex-col gap-12">
            {toolCategories.map((category) => {
              const categoryTools = tools.filter(
                (tool) => tool.category === category.id,
              );
              if (categoryTools.length === 0) return null;
              return (
                <div key={category.id}>
                  <h3 className="flex items-baseline gap-2 text-lg font-bold">
                    {category.name}
                    <span className="text-sm font-normal text-muted-foreground">
                      {categoryTools.length}件
                    </span>
                  </h3>
                  <div className="mt-3">
                    <ToolIndex>
                      {categoryTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                      ))}
                    </ToolIndex>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ===== お金のガイド ===== */}
      <section className="border-t bg-muted py-16 sm:py-24">
        <Container>
          <SectionHeading
            title="お金のガイド"
            lead="税金・節税・資産形成のポイントを、まねでんの計算ツールで数字を確かめながら学べる解説記事です。"
          />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug} className="bg-card">
                <Link
                  href={g.href}
                  className="group flex h-full flex-col p-5 sm:p-6"
                >
                  <span className="text-xs text-muted-foreground">
                    読了 約{g.readingMinutes}分
                  </span>
                  <span className="mt-2 font-heading text-lg leading-snug font-semibold group-hover:text-primary">
                    {g.shortTitle}
                  </span>
                  <span className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {g.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <MoreLink href="/guides">すべてのガイドを見る</MoreLink>
        </Container>
      </section>

      {/* ===== 企業の平均年収 ===== */}
      <section className="border-t py-16 sm:py-24">
        <Container>
          <SectionHeading
            title="企業の平均年収を調べる"
            lead={`上場企業${companies.length.toLocaleString("ja-JP")}社の平均年収を、有価証券報告書のデータから掲載しています。気になる企業の手取り額も、その場で計算できます。`}
          />
          <ol className="mt-10 border-t">
            {topCompanies.map((company, index) => (
              <li key={company.slug} className="border-b">
                <Link
                  href={`/companies/${company.slug}`}
                  className="group grid min-h-11 grid-cols-[2rem_1fr_auto] items-center gap-3 py-3 sm:grid-cols-[2.5rem_1fr_12rem_auto]"
                >
                  <span className="font-heading text-lg text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium group-hover:text-primary">
                      {company.name}
                    </span>
                    <span className="text-xs text-muted-foreground sm:hidden">
                      {company.industry}
                    </span>
                  </span>
                  <span className="hidden text-sm text-muted-foreground sm:block">
                    {company.industry}
                  </span>
                  <span className="text-right font-bold text-primary tabular-nums">
                    {formatManYen(company.averageSalary, 0)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <MoreLink href="/companies">企業の年収ランキングを見る</MoreLink>
        </Container>
      </section>

      {/* ===== まねでんの方針 ===== */}
      <section className="border-t bg-muted py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <SectionHeading
            title="安心して使える理由"
            lead="お金の計算は、入力する数字そのものが大切な個人情報です。まねでんは次の3つを守って作っています。"
          />
          <ol className="flex flex-col">
            {principles.map((item, index) => (
              <li
                key={item.title}
                className="grid grid-cols-[2.5rem_1fr] gap-3 border-t py-6 first:border-t-0 first:pt-0"
              >
                <span className="font-heading text-xl font-bold text-highlight tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-t py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <SectionHeading title="よくあるご質問" />
          <dl className="flex flex-col">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-t py-6 first:border-t-0 first:pt-0"
              >
                <dt className="text-lg font-bold">{faq.question}</dt>
                <dd className="mt-2 text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-8">
        <Container>
          <div className="flex flex-col gap-6 rounded-md bg-primary px-6 py-10 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                まずは手取りの計算から
              </h2>
              <p className="mt-2 opacity-85">
                登録不要・無料で使えます。手取り＆税金シミュレーターから試してみてください。
              </p>
            </div>
            {featured && (
              <Link
                href={featured.href}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary-foreground px-6 font-medium text-primary transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
              >
                無料でシミュレーション
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

/** セクション見出し（左揃え・明朝・朱の短い罫） */
function SectionHeading({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="max-w-2xl">
      <span className="block h-0.5 w-8 bg-highlight" aria-hidden />
      <h2 className="mt-4 text-[1.375rem] font-bold sm:text-3xl">{title}</h2>
      {lead && <p className="mt-3 text-muted-foreground">{lead}</p>}
    </div>
  );
}

/** セクション末尾の「もっと見る」リンク */
function MoreLink({ href, children }: { href: string; children: string }) {
  return (
    <div className="mt-8">
      <Link
        href={href}
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        {children}
        <ArrowRight data-icon="inline-end" />
      </Link>
    </div>
  );
}
