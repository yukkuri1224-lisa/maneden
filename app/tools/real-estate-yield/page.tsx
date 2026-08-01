import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { RealEstateTool } from "@/components/tools/real-estate-yield/RealEstateTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("real-estate-yield")!;

const description =
  "物件価格・家賃・借入条件から表面／実質利回りを算出し、減価償却とローン返済の関係から「デッドクロス」発生年を診断。年次の元金返済と減価償却の推移も可視化。登録不要・無料。";

const faqs = [
  {
    question: "デッドクロスとは何ですか？",
    answer:
      "ローンの元金返済額が減価償却費を上回る状態です。元金返済は経費にならず、減価償却は現金支出のない経費のため、この状態になると帳簿上は黒字でも手元資金（キャッシュフロー）が不足しやすくなります。",
  },
  {
    question: "表面利回りと実質利回りの違いは？",
    answer:
      "表面利回りは『年間家賃 ÷ 物件価格』、実質利回りは『（家賃 − 諸経費）÷ 物件価格』です。実質利回りのほうが運営コストを反映した実態に近い指標です。",
  },
  {
    question: "この診断はどこまで正確ですか？",
    answer:
      "概算です。実際は購入諸費用・空室・家賃下落・税金・修繕などが影響します。投資判断は税理士・不動産の専門家にもご相談ください。",
  },
];

export const metadata: Metadata = {
  title: "不動産利回り＆デッドクロス診断｜表面・実質利回りと発生年を無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function RealEstateYieldPage() {
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
          ※ 本計算結果は概算です。実際の投資判断は専門家にご相談ください。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <RealEstateTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" label="不動産投資・ローン比較サービス" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">計算方法の解説</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">表面利回り</strong>
              は「年間家賃 ÷ 物件価格」、
              <strong className="text-foreground">実質利回り</strong>
              は「（家賃 − 諸経費）÷ 物件価格」で算出します。
            </p>
            <p>
              ローンは<strong className="text-foreground">元利均等返済</strong>
              として、毎年の返済額を元金と利息に分解します。返済が進むほど元金の割合が増えていきます。
            </p>
            <p>
              <strong className="text-foreground">減価償却費</strong>
              は「建物価格 ÷
              法定耐用年数」（定額法）で計算し、耐用年数を過ぎると0になります。
            </p>
            <p>
              年間の元金返済額が減価償却費を上回る年が
              <strong className="text-foreground">デッドクロス</strong>
              です。以降は課税所得が増える一方でキャッシュは残りにくくなります。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">NOI（純収益）</dt>
              <dd className="text-muted-foreground">
                家賃収入から諸経費を差し引いた、物件本来の稼ぐ力。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">法定耐用年数</dt>
              <dd className="text-muted-foreground">
                構造ごとに定められた減価償却の年数（RC47年・鉄骨34年・木造22年）。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">税引前キャッシュフロー</dt>
              <dd className="text-muted-foreground">
                NOI からローン返済額を差し引いた、税引前の手残り。
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

        <RelatedTools excludeId="real-estate-yield" />
      </div>
    </Container>
  );
}
