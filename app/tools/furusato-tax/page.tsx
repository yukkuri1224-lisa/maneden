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
import { FurusatoTool } from "@/components/tools/furusato-tax/FurusatoTool";
import {
  buildFurusatoTable,
  FURUSATO_TABLE_COLUMNS,
} from "@/lib/calculators/furusato-tax/reference";
import { formatManYen } from "@/lib/format";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("furusato-tax")!;

const description =
  "年収（給与／事業所得）と家族構成から、自己負担2,000円で済むふるさと納税の控除上限額の目安を計算。年収別の限度額早見表つき。寄付額と自己負担の関係もグラフで可視化。登録不要・無料。";

/** ビルド時に生成する年収別の限度額早見表 */
const furusatoTable = buildFurusatoTable();

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
  {
    question: "年収別の限度額早見表はありますか？",
    answer:
      "はい。このページ下部に、年収300万〜2,000万円・家族構成別（独身／夫婦／子あり）のふるさと納税 限度額の早見表を掲載しています。社会保険料は年収の約15%で概算した目安です。ご自身の正確な金額は、上部のシミュレーターで社会保険料や扶養の条件を入れて計算してください。",
  },
  {
    question: "上限額は「いつの年収」で計算しますか？",
    answer:
      "ふるさと納税の控除は、寄付した年（1〜12月）の所得に対する住民税・所得税から行われます。そのため上限額は、前年の年収ではなく「寄付する年の見込み年収」で判断します。年の途中では確定しないため、直近の年収や見込みをもとに、上限の8〜9割程度に抑えておくと安心です。",
  },
];

export const metadata: Metadata = {
  title:
    "ふるさと納税 限度額シミュレーター＆年収別早見表｜自己負担2,000円の目安を無料計算",
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
        <p className="mt-2 text-xs text-muted-foreground">
          <Link href="/furusato" className="text-primary underline">
            年収別ふるさと納税 上限額一覧
          </Link>
          から、年収ごとの目安をすぐ確認できます。
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

      <ToolHighlights
        items={[
          "年収と家族構成から、自己負担2,000円で済むふるさと納税の控除上限額の目安がわかります。",
          "会社員（給与）だけでなく、個人事業主（事業所得）の上限も計算できます。",
          "年収別・家族構成別の限度額早見表で、おおよその金額をすぐに確認できます。",
        ]}
      />

      <AdSlot className="mt-10" />

      <section className="mt-14">
        <h2 className="text-xl font-bold">ふるさと納税 限度額の年収別早見表</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          給与年収と家族構成から、自己負担2,000円で済むふるさと納税の
          <strong className="text-foreground">控除上限額の目安</strong>
          をまとめた早見表です。まずはこの表でおおよその金額をつかみ、
          正確な額は上のシミュレーターで社会保険料や扶養の条件を入れて確認してください。
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60">
                <th className="sticky left-0 z-10 bg-muted/60 px-3 py-3 text-left font-semibold whitespace-nowrap">
                  給与年収
                </th>
                {FURUSATO_TABLE_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-right font-semibold whitespace-nowrap"
                  >
                    {col.label}
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      {col.note}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {furusatoTable.map((row, i) => (
                <tr
                  key={row.income}
                  className={i % 2 === 1 ? "bg-muted/30" : undefined}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 px-3 py-2.5 text-left font-semibold whitespace-nowrap tabular-nums ${
                      i % 2 === 1 ? "bg-muted/30" : "bg-background"
                    }`}
                  >
                    {formatManYen(row.income, 0)}
                  </th>
                  {row.limits.map((limit, j) => (
                    <td
                      key={FURUSATO_TABLE_COLUMNS[j].key}
                      className="px-3 py-2.5 text-right whitespace-nowrap tabular-nums"
                    >
                      {limit.toLocaleString("ja-JP")}円
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          ※
          給与所得者を前提に、社会保険料を年収の約15%で概算した目安です。子は高校生（16〜18歳＝一般の扶養控除の対象）を想定しています。医療費控除・住宅ローン控除など他の控除がある場合や、共働きで配偶者控除を受けない場合などは上限が変わります。大学生（特定扶養）や中学生以下の子は本表と条件が異なります。
        </p>
      </section>

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

        <ToolMeta updated="2026年8月6日" taxBasis toolId="furusato-tax" />
      </div>
    </Container>
  );
}
