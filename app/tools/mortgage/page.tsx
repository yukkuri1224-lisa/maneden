import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolMeta } from "@/components/common/ToolMeta";
import { MortgageTool } from "@/components/tools/mortgage/MortgageTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("mortgage")!;

const description =
  "借入額・金利・返済期間から、住宅ローンの毎月の返済額と総返済額・総利息を元利均等で計算。繰上返済（期間短縮型）による利息の軽減額と短縮できる期間もわかります。登録不要・無料。";

const faqs = [
  {
    question: "毎月の返済額はどう決まりますか？",
    answer:
      "借入額・金利・返済期間から、元利均等返済方式で計算します。金利が高いほど、返済期間が長いほど総利息は増えます。",
  },
  {
    question: "繰上返済の「期間短縮型」とは？",
    answer:
      "毎月の返済額はそのままに、返済期間を縮める方法です。総利息の軽減効果が大きいのが特徴です。毎月の負担を減らす「返済額軽減型」とは効果の出方が異なります。",
  },
  {
    question: "ここでの返済額は正確ですか？",
    answer:
      "概算です。実際には金融機関ごとの端数処理、保証料や団体信用生命保険料の有無などで変わります。契約前に必ず金融機関の試算をご確認ください。",
  },
];

export const metadata: Metadata = {
  title:
    "住宅ローン返済シミュレーター｜毎月の返済額・総返済額・繰上返済を無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function MortgagePage() {
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
          ※ 元利均等返済による概算です。保証料・団信・端数処理は含みません。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <MortgageTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">住宅ローンの返済額の計算方法</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              住宅ローンで最も一般的な
              <strong className="text-foreground">元利均等返済</strong>
              は、毎月の返済額（元金＋利息）が一定になる方式です。返済当初は利息の割合が大きく、後半になるほど元金の割合が増えていきます。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">
                総返済額と総利息
              </h3>
              <p className="mt-1">
                毎月の返済額 × 返済回数
                が総返済額で、そこから借入額を引いた分が総利息です。金利や期間が大きいほど、総利息はふくらみます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">繰上返済の効果</h3>
              <p className="mt-1">
                期間短縮型の繰上返済は、返済したお金がまるごと元金に充当され、その先にかかるはずだった利息を丸ごとカットします。早い時期に行うほど効果が大きくなります。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">元利均等返済</dt>
              <dd className="text-muted-foreground">
                毎月の返済額（元金＋利息）が一定になる方式。返済計画が立てやすい。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">期間短縮型（繰上返済）</dt>
              <dd className="text-muted-foreground">
                毎月の返済額を変えずに返済期間を縮める方法。利息の軽減効果が大きい。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">返済額軽減型（繰上返済）</dt>
              <dd className="text-muted-foreground">
                返済期間は変えずに毎月の返済額を減らす方法。家計の負担を軽くしたいときに。
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

        <RelatedTools excludeId="mortgage" />

        <ToolMeta
          updated="2026年8月7日"
          basis="元利均等返済方式による概算です。金融機関ごとの端数処理・保証料・団体信用生命保険料等は含みません。契約前に金融機関の試算をご確認ください。"
        />
      </div>
    </Container>
  );
}
