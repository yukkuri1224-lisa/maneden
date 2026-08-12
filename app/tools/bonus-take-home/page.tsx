import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolMeta } from "@/components/common/ToolMeta";
import { BonusTakeHomeTool } from "@/components/tools/bonus-take-home/BonusTakeHomeTool";
import {
  BONUS_TABLE_MONTHLY_SALARY,
  buildBonusTable,
} from "@/lib/calculators/bonus-take-home/reference";
import { formatManYen } from "@/lib/format";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("bonus-take-home")!;

const description =
  "ボーナス（賞与）の額面から、健康保険・厚生年金・雇用保険と所得税を差し引いた手取り額を概算。額面50万・70万・100万などの手取り早見表つき。手取り率もひと目でわかります。登録不要・無料。";

/** ビルド時に生成する額面別の手取り早見表 */
const bonusTable = buildBonusTable();

const faqs = [
  {
    question: "ボーナスからは何が引かれますか？",
    answer:
      "社会保険料（健康保険・厚生年金・雇用保険、40歳以上は介護保険も）と所得税（源泉徴収）が引かれます。住民税はボーナスからは引かれません。",
  },
  {
    question: "ボーナスの手取りは額面の何割くらいですか？",
    answer:
      "おおむね額面の8割前後が目安です。社会保険料の本人負担が約15%、これに所得税が加わります。年収が高いほど所得税率が上がり、手取り率は下がります。",
  },
  {
    question: "計算結果は給与明細と一致しますか？",
    answer:
      "社会保険料はほぼ一致しますが、所得税は概算です。実際の源泉徴収税額は「前月の給与」と扶養人数に応じた税率表で決まり、最終的な税額は年末調整で精算されます。",
  },
  {
    question: "ボーナス額面50万・70万・100万の手取りはいくらですか？",
    answer:
      "月給30万円（年収約360万円層）・40歳未満・扶養なしの目安で、額面50万円は約41万円、70万円は約57万円、100万円は約82万円が手取りになります（いずれも手取り率およそ82%）。ページ下部の早見表に額面20万〜200万円まで掲載しています。年収が高いほど所得税率が上がり手取り率は下がります。",
  },
];

export const metadata: Metadata = {
  title:
    "ボーナス手取り計算シミュレーター＆額面別早見表｜50万・70万・100万の手取り",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function BonusTakeHomePage() {
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
          社会保険料は協会けんぽ・全国平均的な料率での概算です。所得税は、賞与によって増える年間所得税額をもとにした概算で、給与天引きの源泉徴収額とは多少異なります。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <BonusTakeHomeTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" />

      <section className="mt-14">
        <h2 className="text-xl font-bold">ボーナス手取り 額面別早見表</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          ボーナス（賞与）の額面ごとに、社会保険料・所得税を引いた
          <strong className="text-foreground">手取り額と手取り率の目安</strong>
          をまとめた早見表です。月給
          {formatManYen(BONUS_TABLE_MONTHLY_SALARY, 0)}
          （年収約360万円層）・40歳未満・扶養なしを前提にしています。
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60">
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                  額面
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  社会保険料
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  所得税
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  手取り
                </th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  手取り率
                </th>
              </tr>
            </thead>
            <tbody>
              {bonusTable.map((row, i) => (
                <tr
                  key={row.amount}
                  className={i % 2 === 1 ? "bg-muted/30" : undefined}
                >
                  <th
                    scope="row"
                    className="px-3 py-2.5 text-left font-semibold whitespace-nowrap tabular-nums"
                  >
                    {formatManYen(row.amount, 0)}
                  </th>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap text-muted-foreground tabular-nums">
                    -{row.socialInsurance.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap text-muted-foreground tabular-nums">
                    -{row.incomeTax.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold whitespace-nowrap tabular-nums">
                    {row.netBonus.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap tabular-nums">
                    {row.netRate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          ※
          社会保険料は協会けんぽ・全国平均的な料率での概算、所得税は賞与によって増える年間所得税額からの概算です。手取り率は月給や年収・扶養で変わります。ご自身の条件は上のシミュレーターで計算してください。
        </p>
      </section>

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">ボーナスの手取りの計算方法</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              ボーナスの手取りは、
              <strong className="text-foreground">
                額面から社会保険料と所得税を差し引いた金額
              </strong>
              です。給与と違い、住民税はボーナスからは引かれません。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">社会保険料</h3>
              <p className="mt-1">
                健康保険・厚生年金・雇用保険（40歳以上は介護保険も）。会社と折半で、本人負担は概ね額面の約15%です。厚生年金は1回150万円、健康保険は年度累計573万円までが対象になります。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">所得税（源泉）</h3>
              <p className="mt-1">
                実際の給与天引きでは、前月の給与と扶養人数に応じた税率表で源泉徴収されます。本ツールでは、賞与によって増える年間の所得税額から概算しています。最終的な税額は年末調整で精算されます。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">標準賞与額</dt>
              <dd className="text-muted-foreground">
                社会保険料の計算のもとになる、賞与の1000円未満を切り捨てた額。上限がある。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">源泉徴収</dt>
              <dd className="text-muted-foreground">
                賞与や給与の支払時に、会社があらかじめ所得税を差し引いて納める仕組み。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">手取り率</dt>
              <dd className="text-muted-foreground">
                額面に対する手取りの割合。ボーナスはおおむね8割前後が目安。
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

        <RelatedTools excludeId="bonus-take-home" />

        <ToolMeta
          updated="2026年8月8日"
          taxBasis
          basis="社会保険料は協会けんぽ・全国平均的な料率での概算です。所得税は賞与による年間所得税の増加分をもとにした概算で、給与天引きの源泉徴収額とは多少異なります。"
        />
      </div>
    </Container>
  );
}
