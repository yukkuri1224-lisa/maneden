import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolHighlights } from "@/components/common/ToolHighlights";
import { ToolMeta } from "@/components/common/ToolMeta";
import { SaasMetricsTool } from "@/components/tools/saas-metrics/SaasMetricsTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("saas-metrics")!;

const description =
  "月次解約率・ARPU・粗利率・CAC から LTV や LTV/CAC 比率・CAC回収期間・MRR/ARR を自動計算。コホートの累積粗利の推移も可視化。登録不要・無料。";

const faqs = [
  {
    question: "LTV/CAC 比率はいくつが目安ですか？",
    answer:
      "一般に 3 以上が健全とされます。1〜3 は要改善、1 未満は獲得コストを回収できていない赤字構造の可能性があります。",
  },
  {
    question: "LTV はどのように計算していますか？",
    answer:
      "粗利ベースの LTV として「ARPU × 粗利率 ÷ 月次解約率」で概算しています。平均継続月数は 1 ÷ 月次解約率です。",
  },
  {
    question: "CAC 回収期間とは何ですか？",
    answer:
      "獲得コスト（CAC）を、顧客あたりの月間粗利で割った月数です。一般に 12 ヶ月以内が目安とされます。",
  },
  {
    question: "解約率（チャーンレート）はどう定義しますか？",
    answer:
      "一般には「その期間に解約した顧客数 ÷ 期初の顧客数」で求めるカスタマーチャーン（顧客数ベース）と、失った月次売上で見るレベニューチャーン（金額ベース）があります。本ツールは月次の解約率を前提に LTV を概算します。年間で見る場合は月次に換算してご利用ください。",
  },
  {
    question: "LTV/CAC が高すぎる場合は問題ありますか？",
    answer:
      "LTV/CAC が極端に高い（例: 5 以上が続く）場合、獲得への投資が不足して成長機会を逃している可能性があります。3 前後を目安に、回収期間とあわせて、投資を増やす余地がないかを検討するのが一般的です。",
  },
];

export const metadata: Metadata = {
  title: "SaaS指標 計算機｜LTV・LTV/CAC・回収期間を無料でシミュレーション",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function SaasMetricsPage() {
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
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <SaasMetricsTool />
        </Suspense>
      </div>

      <ToolHighlights
        items={[
          "解約率・ARPU・CAC から LTV と LTV/CAC 比率を算出し、事業の健全性を可視化できます。",
          "CAC 回収期間（顧客獲得コストを何ヶ月で回収できるか）がわかります。",
          "数値を変えながら、ユニットエコノミクスの改善余地を検討できます。",
        ]}
      />

      <AdSlot className="mt-10" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">指標の解説</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">LTV（顧客生涯価値）</strong>
              は、1人の顧客が契約期間を通じてもたらす粗利の総額です。本ツールでは「ARPU
              × 粗利率 ÷ 月次解約率」で概算しています。
            </p>
            <p>
              <strong className="text-foreground">LTV/CAC 比率</strong>
              は、獲得コストに対して何倍の価値を回収できるかを表し、事業の健全性の代表的な指標です（3以上が目安）。
            </p>
            <p>
              <strong className="text-foreground">CAC 回収期間</strong>
              は、獲得コストを月間粗利で回収するのにかかる月数で、資金繰りの観点から短いほど有利です（12ヶ月以内が目安）。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">ARPU</dt>
              <dd className="text-muted-foreground">
                顧客あたりの月間平均売上（Average Revenue Per User）。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Churn Rate（解約率）</dt>
              <dd className="text-muted-foreground">
                一定期間に解約する顧客の割合。低いほど継続率が高い。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">MRR / ARR</dt>
              <dd className="text-muted-foreground">
                月間経常収益 / 年間経常収益。サブスク事業の規模を表す指標。
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

        <RelatedTools excludeId="saas-metrics" />

        <ToolMeta
          updated="2026年8月6日"
          basis="一般的な計算式（例: LTV＝ARPU÷解約率）に基づく試算です。事業の実態に合わせて指標を調整してください。"
        />
      </div>
    </Container>
  );
}
