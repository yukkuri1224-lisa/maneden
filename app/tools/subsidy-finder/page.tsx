import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { SubsidyFinderTool } from "@/components/tools/subsidy-finder/SubsidyFinderTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("subsidy-finder")!;

const description =
  "業種規模・投資予定額・事業目的から、該当しそうな主要な補助金・助成金と概算受給額を診断。IT導入・ものづくり・持続化・事業再構築などの候補を一覧表示。登録不要・無料。";

const faqs = [
  {
    question: "診断結果の金額はどのくらい正確ですか？",
    answer:
      "概算です。補助金は毎年・公募回ごとに制度内容・補助率・上限額・要件が変わります。実際の受給可否や金額は、必ず各制度の公式サイトや窓口でご確認ください。",
  },
  {
    question: "地域限定の補助金も出ますか？",
    answer:
      "本ツールは主に国の主要な制度を対象にしています。自治体独自の補助金・助成金も多数あるため、お住まいの都道府県・市区町村のサイトもあわせてご確認ください。",
  },
  {
    question: "個人事業主でも対象になりますか？",
    answer:
      "多くの制度は中小企業・小規模事業者として個人事業主も対象になります。ただし制度ごとに要件が異なるため、詳細は各公式サイトでご確認ください。",
  },
];

export const metadata: Metadata = {
  title: "補助金・助成金 診断｜受給できそうな制度と概算額を無料でチェック",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function SubsidyFinderPage() {
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

      <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
        ⚠️
        補助金・助成金の制度内容・補助率・上限額・要件は毎年（公募回ごとに）変わります。本診断は
        <strong>概算・目安</strong>
        です。申請前に必ず各制度の公式サイトで最新情報をご確認ください。
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <SubsidyFinderTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" label="補助金申請サポート・専門家紹介" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">補助金・助成金の探し方</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              補助金は「事業目的」に合った制度を選ぶのが基本です。IT化なら
              <strong className="text-foreground">IT導入補助金</strong>
              、設備投資なら
              <strong className="text-foreground">ものづくり補助金</strong>
              、販路開拓なら
              <strong className="text-foreground">
                小規模事業者持続化補助金
              </strong>
              、というように目的から逆引きすると探しやすくなります。
            </p>
            <p>
              補助金は原則
              <strong className="text-foreground">後払い（精算払い）</strong>
              で、採択後に事業を実施してから支給されます。自己資金や資金繰りも合わせて計画しましょう。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">補助率</dt>
              <dd className="text-muted-foreground">
                対象経費のうち補助される割合（例: 2/3）。残りは自己負担。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">補助上限額</dt>
              <dd className="text-muted-foreground">
                受け取れる補助金の上限。投資額 ×
                補助率がこの額を超えても上限まで。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">小規模事業者</dt>
              <dd className="text-muted-foreground">
                業種により従業員数の基準が異なる（商業・サービスは5人以下等）。
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

        <RelatedTools excludeId="subsidy-finder" />
      </div>
    </Container>
  );
}
