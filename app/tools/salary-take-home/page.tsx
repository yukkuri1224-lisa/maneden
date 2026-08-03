import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { SalaryTakeHomeTool } from "@/components/tools/salary-take-home/SalaryTakeHomeTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("salary-take-home")!;

const description =
  "年収（額面）を入力するだけで、健康保険・厚生年金・雇用保険と所得税・住民税を差し引いた会社員の手取り額を概算。手取り率や内訳グラフも表示。登録不要・無料。";

const faqs = [
  {
    question: "手取りは年収の何割くらいですか？",
    answer:
      "一般に年収の75〜85%程度が目安です。年収が上がるほど税・社会保険の負担率が増え、手取り率は下がる傾向があります。",
  },
  {
    question: "社会保険料には何が含まれますか？",
    answer:
      "健康保険・厚生年金・雇用保険です（40歳以上は介護保険も加わります）。会社と折半で負担し、本人負担は概ね額面の約15%が目安です。",
  },
  {
    question: "ボーナスも含めますか？",
    answer:
      "はい。「年収（額面）」にはボーナス込みの年間総支給額を入力してください。",
  },
];

export const metadata: Metadata = {
  title: "会社員の手取り計算シミュレーター｜年収から手取り額を無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function SalaryTakeHomePage() {
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
          協会けんぽ・全国平均的な料率での概算です。都道府県や勤務先の制度により実額は異なります。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <SalaryTakeHomeTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" label="転職・年収アップ関連サービス" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">会社員の手取りの計算方法</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              会社員の手取りは、
              <strong className="text-foreground">
                年収（額面）から社会保険料と税金（所得税・住民税）を差し引いた金額
              </strong>
              です。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">社会保険料</h3>
              <p className="mt-1">
                健康保険・厚生年金・雇用保険（40歳以上は介護保険も）。会社と折半で、本人負担は概ね額面の約15%が目安です。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">所得税・住民税</h3>
              <p className="mt-1">
                給与所得（年収 −
                給与所得控除）から各種控除を引いた課税所得に対してかかります。所得税は累進税率、住民税は約10%です。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">額面と手取り</dt>
              <dd className="text-muted-foreground">
                額面は税・社保が引かれる前の総支給額。手取りは実際に振り込まれる金額。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">給与所得控除</dt>
              <dd className="text-muted-foreground">
                会社員の必要経費に相当する控除。年収に応じて金額が決まる。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">標準報酬月額</dt>
              <dd className="text-muted-foreground">
                社会保険料の計算のもとになる月額。上限があり、高収入でも一定以上は増えない。
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

        <RelatedTools excludeId="salary-take-home" />
      </div>
    </Container>
  );
}
