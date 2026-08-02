import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { FurusatoTool } from "@/components/tools/furusato-tax/FurusatoTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("furusato-tax")!;

const description =
  "年収（給与／事業所得）と家族構成から、自己負担2,000円で済むふるさと納税の控除上限額の目安を計算。寄付額と自己負担の関係もグラフで可視化。登録不要・無料。";

const faqs = [
  {
    question: "ふるさと納税の上限額を超えて寄付するとどうなりますか？",
    answer:
      "上限を超えた分は控除されず、そのまま自己負担になります。上限額の範囲内なら、実質負担は2,000円で済みます。",
  },
  {
    question: "上限額は何で決まりますか？",
    answer:
      "主に住民税の所得割額で決まります。所得割額は収入・家族構成・各種控除によって変わるため、人によって上限は異なります。",
  },
  {
    question: "この計算は正確ですか？",
    answer:
      "あくまで目安です。医療費控除・住宅ローン控除などの他の控除があると上限額は変わります。正確な金額は、寄付先ポータルの詳細シミュレーションやお住まいの自治体でご確認ください。",
  },
];

export const metadata: Metadata = {
  title: "ふるさと納税 上限額シミュレーター｜自己負担2,000円の目安を無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function FurusatoTaxPage() {
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
          本計算は目安です。他の控除の有無で上限は変わります。正確な金額は寄付先・自治体でご確認ください。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <FurusatoTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" label="ふるさと納税ポータルサイト" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">ふるさと納税の仕組みと上限額</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              ふるさと納税は、自治体への寄付を通じて、
              <strong className="text-foreground">
                寄付額から2,000円を引いた金額が所得税・住民税から控除
              </strong>
              される制度です。実質2,000円の負担で各地の返礼品を受け取れます。
            </p>
            <p>
              ただし控除には上限があり、これは主に
              <strong className="text-foreground">住民税の所得割額</strong>
              で決まります。上限を超えて寄付すると、超過分は自己負担になります。
            </p>
            <p>
              本ツールでは「住民税所得割額 × 20% ÷ (90% − 所得税率 × 1.021) +
              2,000円」の式で、自己負担2,000円で済む上限額の目安を算出しています。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">住民税 所得割</dt>
              <dd className="text-muted-foreground">
                課税所得に応じてかかる住民税（標準10%）。上限額算定の中心となる値。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">給与所得控除</dt>
              <dd className="text-muted-foreground">
                会社員の給与収入から差し引ける控除。年収に応じて金額が決まる。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">実質負担2,000円</dt>
              <dd className="text-muted-foreground">
                上限額の範囲内なら、寄付額のうち自己負担は2,000円だけで済む。
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

        <RelatedTools excludeId="furusato-tax" />
      </div>
    </Container>
  );
}
