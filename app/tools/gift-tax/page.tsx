import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolMeta } from "@/components/common/ToolMeta";
import { GiftTaxTool } from "@/components/tools/gift-tax/GiftTaxTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("gift-tax")!;

const description =
  "贈与税（暦年課税）が、もらった金額からいくらかかるかを無料で計算。基礎控除110万円を引いた課税価格に、特例贈与・一般贈与それぞれの税率を適用し、手元に残る額まで概算します。登録不要。";

const faqs = [
  {
    question: "贈与税はいくらからかかりますか？",
    answer:
      "1年間（1月1日〜12月31日）に受け取った贈与の合計が110万円（基礎控除）を超えると、その超えた部分に贈与税がかかります。110万円以下なら贈与税はかからず、申告も不要です。",
  },
  {
    question: "特例贈与と一般贈与の違いは何ですか？",
    answer:
      "特例贈与は、親や祖父母などの直系尊属から、その年の1月1日時点で18歳以上の子・孫への贈与で、税率が低めに設定されています。それ以外（夫婦間、兄弟間、未成年の子への贈与など）は一般贈与となり、税率がやや高くなります。",
  },
  {
    question: "贈与税の計算方法（計算式）は？",
    answer:
      "「（1年間の贈与合計 − 110万円）× 税率 − 控除額」で計算します。税率と控除額は課税価格に応じた速算表で決まり、特例贈与と一般贈与で表が異なります。本ツールはこの速算表で自動計算します。",
  },
  {
    question: "土地や不動産をもらったときはどう計算しますか？",
    answer:
      "現金でなくても、その財産の評価額（土地は路線価方式など、建物は固定資産税評価額）を贈与額として同じように課税されます。評価額を「贈与の合計」に入力すれば、贈与税の目安を確認できます。",
  },
  {
    question: "毎年110万円ずつ贈与すれば非課税ですか？",
    answer:
      "1年ごとに基礎控除110万円が使えるため、原則として非課税で贈与できます（暦年贈与）。ただし、はじめから総額を分割して渡す約束とみなされる「定期贈与」や、名義預金と判断されると課税されることがあります。また相続開始前の一定期間の贈与は相続税の対象に加算されます。心配な場合は税理士にご相談ください。",
  },
];

export const metadata: Metadata = {
  title: "贈与税の計算シミュレーター｜いくらかかる？特例・一般を無料で計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function GiftTaxPage() {
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
          暦年課税による概算です。相続時精算課税や住宅取得資金・教育資金などの非課税特例、相続開始前の贈与加算は考慮していません。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <GiftTaxTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">贈与税（暦年課税）の計算方法</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              1年間に受け取った贈与の合計から
              <strong className="text-foreground">基礎控除110万円</strong>
              を引いた金額（課税価格）に、税率をかけて計算します。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">計算式</h3>
              <p className="mt-1">
                贈与税額 =（1年間の贈与合計 − 110万円）× 税率 −
                控除額。税率と控除額は課税価格に応じた速算表で決まります。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                特例贈与と一般贈与
              </h3>
              <p className="mt-1">
                親・祖父母から18歳以上の子・孫への贈与は税率が低い「特例贈与」、それ以外は「一般贈与」です。同じ金額でも税額が変わるため、本ツールで切り替えて比べられます。
              </p>
            </div>
            <p>
              なお、まとまった額を無理に一度で贈与せず、複数年に分けたり、
              <a href="/tools/furusato-tax" className="text-primary underline">
                ふるさと納税
              </a>
              などほかの制度と組み合わせて家計全体で考えるのも有効です。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">暦年課税</dt>
              <dd className="text-muted-foreground">
                1月1日〜12月31日の1年間にもらった贈与の合計で課税する、贈与税の原則的な方式。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">基礎控除</dt>
              <dd className="text-muted-foreground">
                贈与税で毎年差し引ける110万円。合計がこの範囲内なら非課税・申告不要。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">特例贈与財産</dt>
              <dd className="text-muted-foreground">
                直系尊属（親・祖父母）から18歳以上の子・孫への贈与。低めの税率が適用される。
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

        <RelatedTools excludeId="gift-tax" />

        <ToolMeta
          toolId="gift-tax"
          updated="2026年8月10日"
          taxBasis
          basis="暦年課税による概算です。相続時精算課税や住宅取得資金・教育資金等の非課税特例、相続開始前の贈与加算は考慮していません。土地・建物は別途、評価額の算定が必要です。"
        />
      </div>
    </Container>
  );
}
