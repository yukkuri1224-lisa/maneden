import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolHighlights } from "@/components/common/ToolHighlights";
import { ToolMeta } from "@/components/common/ToolMeta";
import { WorkedExamples } from "@/components/common/WorkedExamples";
import { SalaryTakeHomeTool } from "@/components/tools/salary-take-home/SalaryTakeHomeTool";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { formatManYen } from "@/lib/format";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("salary-take-home")!;

/** 具体例（サーバー側で実際の計算関数から算出した概算） */
const salaryExamples = [
  {
    title: "年収400万円・独身",
    note: "扶養なし・39歳以下",
    income: 4_000_000,
    isOver40: false,
    hasSpouse: false,
    dependents: 0,
  },
  {
    title: "年収600万円・配偶者＋子1人",
    note: "子は16歳以上（扶養1人）・39歳以下",
    income: 6_000_000,
    isOver40: false,
    hasSpouse: true,
    dependents: 1,
  },
  {
    title: "年収900万円・独身・40代",
    note: "介護保険料を含む",
    income: 9_000_000,
    isOver40: true,
    hasSpouse: false,
    dependents: 0,
  },
].map((c) => {
  const r = calculateSalaryTakeHome(c);
  const yen = (v: number) => `−${Math.round(v).toLocaleString("ja-JP")}円`;
  return {
    title: c.title,
    note: c.note,
    rows: [
      { label: "額面年収", value: formatManYen(c.income, 0) },
      { label: "社会保険料", value: yen(r.socialInsurance) },
      { label: "所得税", value: yen(r.incomeTax) },
      { label: "住民税", value: yen(r.residentTax) },
      {
        label: "手取り",
        value: `約${formatManYen(r.netIncome, 0)}`,
        strong: true,
      },
    ],
  };
});

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
  {
    question: "手取りをだいたいで計算したいのですが、目安はありますか？",
    answer:
      "ざっくりの目安なら、年収300万円で手取り約240万円、年収400万円で約315万円、年収500万円で約390万円、年収600万円で約460万円、年収700万円で約530万円、年収800万円で約590万円ほどです（独身・扶養なしの概算）。より正確な手取りは、上の計算ツールに年齢や家族構成を入れて計算してください。",
  },
  {
    question: "住民税は入社1年目から引かれますか？",
    answer:
      "住民税は前年の所得に対して課税され、翌年6月からの給与天引き（特別徴収）で納めます。そのため入社1年目は住民税がかからず、2年目の6月から引かれ始めるのが一般的です。本ツールは年間ベースの概算のため、住民税を含めた金額を表示します。",
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
          選択した都道府県（既定は東京都）の協会けんぽ料率（令和8年度）と標準報酬月額の等級表で計算した概算です。勤務先の健康保険組合など制度により実額は異なります。
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          <Link href="/companies" className="text-primary underline">
            上場企業の平均年収ランキング
          </Link>
          から、気になる企業の年収で手取りをすぐ試せます。
          <Link href="/take-home" className="ml-1 text-primary underline">
            年収別の手取り一覧
          </Link>
          もご覧いただけます。
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

      <ToolHighlights
        items={[
          "年収（額面）から、社会保険料・所得税・住民税を差し引いた手取り額と手取り率がわかります。",
          "健康保険・厚生年金・雇用保険（40歳以上は介護保険）の内訳を確認できます。",
          "扶養家族の人数や配偶者控除を反映して、家族構成別の手取りを比較できます。",
        ]}
      />

      <AdSlot className="mt-10" />

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

        <WorkedExamples
          description="年収・家族構成別に、手取り額の内訳を計算した目安です（東京都・協会けんぽ令和8年度・標準報酬月額の等級表ベース）。"
          examples={salaryExamples}
        />

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

        <ToolMeta updated="2026年8月6日" taxBasis toolId="salary-take-home" />
      </div>
    </Container>
  );
}
