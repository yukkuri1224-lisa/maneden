import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolMeta } from "@/components/common/ToolMeta";
import { FreelanceTaxTool } from "@/components/tools/freelance-tax/FreelanceTaxTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("freelance-tax")!;

const description =
  "売上と経費を入力するだけで、所得税・住民税・国保・消費税とインボイス影響、年間手取り額をリアルタイムに概算。登録不要・完全無料。";

const faqs = [
  {
    question: "インボイス制度の「2割特例」とは何ですか？",
    answer:
      "免税事業者からインボイス発行のために課税事業者になった人が、売上に係る消費税額の2割だけを納付すればよい負担軽減の経過措置です。適用には期限があるため、最新の情報をご確認ください。",
  },
  {
    question: "このシミュレーターの結果は正確ですか？",
    answer:
      "あくまで概算です。税率や控除は年度・自治体によって異なり、特に国民健康保険料は地域差が大きいため、正確な金額は税理士や市区町村の窓口でご確認ください。",
  },
  {
    question: "手取りを増やすにはどうすればよいですか？",
    answer:
      "青色申告特別控除（最大65万円）の活用、経費の適切な計上、扶養・各種所得控除の見直しなどが有効です。条件を変えながら本ツールで比較してみてください。",
  },
  {
    question: "売上がいくらまでなら免税事業者でいられますか？",
    answer:
      "原則として、基準期間（前々年）の課税売上高が1,000万円以下であれば免税事業者になれます。ただしインボイス登録をした場合は売上に関わらず課税事業者になります。",
  },
];

export const metadata: Metadata = {
  title:
    "フリーランスの手取り計算シミュレーター｜税金・インボイス影響も一括診断【無料】",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function FreelanceTaxPage() {
  return (
    <Container className="py-8">
      <JsonLd
        data={webApplicationJsonLd({
          name: tool.title,
          description,
          url: `${siteConfig.url}${tool.href}`,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ツール一覧", href: "/tools" },
          { name: tool.shortTitle, href: tool.href },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold sm:text-3xl">{tool.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          ※
          本計算結果は概算であり、正確な税額を保証するものではありません。詳細は税理士等の専門家にご相談ください。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <FreelanceTaxTool />
        </Suspense>
      </div>

      <AdSlot
        className="mt-10"
        label="クラウド会計ソフト（freee・マネーフォワード等）"
      />

      {/* SEO ロングフォーム */}
      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">計算方法の解説</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              フリーランス・個人事業主の手取りは、
              <strong className="text-foreground">
                売上から経費・各種控除を差し引いた「事業所得」
              </strong>
              をもとに、所得税・住民税・国民健康保険・国民年金・（課税事業者の場合）消費税を計算して求めます。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">所得税</h3>
              <p className="mt-1">
                課税所得に対して5%〜45%の累進税率（速算表）を適用し、復興特別所得税（所得税額の2.1%）を加算します。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">住民税</h3>
              <p className="mt-1">
                課税所得の約10%（所得割）に、均等割・森林環境税を加えて概算します。自治体により差があります。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                国民健康保険・国民年金
              </h3>
              <p className="mt-1">
                国保は所得割と均等割で構成され、自治体差が大きいため本ツールでは単身世帯の全国平均的なモデルで概算します。国民年金は年額の概算です。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                消費税（インボイス制度）
              </h3>
              <p className="mt-1">
                免税事業者は納付0円です。課税事業者は「2割特例」「簡易課税」「本則課税」により納付額が変わります。本ツールでは免税のままと登録した場合の負担差（インボイス影響額）も表示します。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">青色申告特別控除</dt>
              <dd className="text-muted-foreground">
                複式簿記＋電子申告などの要件を満たすと、所得から最大65万円を差し引ける控除。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">事業所得</dt>
              <dd className="text-muted-foreground">
                売上から必要経費と青色申告特別控除を差し引いた、事業のもうけ。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">手取り率</dt>
              <dd className="text-muted-foreground">
                売上に対して手元に残る金額の割合。税・社会保険の負担度合いの目安。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">2割特例</dt>
              <dd className="text-muted-foreground">
                インボイス登録で課税事業者になった人向けの、消費税の負担軽減措置。
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="text-xl font-bold">よくあるご質問</h2>
          <dl className="mt-4 space-y-4 text-sm">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold">{faq.question}</dt>
                <dd className="mt-1 text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <RelatedTools excludeId="freelance-tax" />

        <ToolMeta updated="2026年8月6日" taxBasis />
      </div>
    </Container>
  );
}
