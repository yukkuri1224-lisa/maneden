import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { BreakdownBar } from "@/components/common/BreakdownBar";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { TAX_TABLES, TAX_YEAR } from "@/lib/constants/tax-tables";
import { formatManYen } from "@/lib/format";
import {
  adjacentLevels,
  getIncomeLevel,
  INCOME_LEVELS,
  TAKE_HOME_NOTES,
} from "@/lib/longtail/levels";
import { articleJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return INCOME_LEVELS.map((l) => ({ income: l.slug }));
}

const PUBLISHED = "2026-08-13T00:00:00+09:00";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ income: string }>;
}): Promise<Metadata> {
  const { income } = await params;
  const level = getIncomeLevel(income);
  if (!level) return {};

  const r = calculateSalaryTakeHome({
    income: level.income,
    isOver40: false,
    hasSpouse: false,
    dependents: 0,
  });
  const title = `年収${level.man}万円の手取りはいくら？月収・税金の内訳まで解説`;
  const description = `年収${level.man}万円（額面）の手取りは約${formatManYen(
    r.netIncome,
    0,
  )}（手取り率約${r.netIncomeRate.toFixed(
    0,
  )}%）。社会保険料・所得税・住民税の内訳と、月あたりの手取り、家族構成による違いまで解説します。`;

  return {
    title,
    description,
    alternates: { canonical: `/take-home/${income}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/take-home/${income}`,
    },
  };
}

export default async function TakeHomeLevelPage({
  params,
}: {
  params: Promise<{ income: string }>;
}) {
  const { income } = await params;
  const level = getIncomeLevel(income);
  if (!level) notFound();

  const r = calculateSalaryTakeHome({
    income: level.income,
    isOver40: false,
    hasSpouse: false,
    dependents: 0,
  });
  const monthly = r.netIncome / 12;
  const note = TAKE_HOME_NOTES[level.man];
  const { prev, next } = adjacentLevels(level.man);

  // ページ固有のユニークデータ（近似重複回避＋AI引用向け）：限界税率・隣接年収帯との手取り率差
  const marginalRate =
    TAX_TABLES.incomeTax.brackets.find(
      (b) => r.taxableIncomeIncomeTax <= b.upTo,
    )?.rate ?? 0;
  const rateOf = (man?: number) =>
    man == null
      ? null
      : calculateSalaryTakeHome({
          income: man * 10_000,
          isOver40: false,
          hasSpouse: false,
          dependents: 0,
        }).netIncomeRate;
  const prevRate = rateOf(prev?.man);
  const nextRate = rateOf(next?.man);

  const yen = (v: number) => `${Math.round(v).toLocaleString("ja-JP")}円`;

  const faqs = [
    {
      question: `年収${level.man}万円の手取りは月いくらですか？`,
      answer: `年収${level.man}万円（独身・扶養なしの概算）の年間手取りは約${formatManYen(
        r.netIncome,
        0,
      )}で、12で割ると月あたり約${formatManYen(
        monthly,
        1,
      )}です。実際の毎月の給与にはボーナスの有無や月ごとの変動があるため、あくまで平均的な目安です。`,
    },
    {
      question: `年収${level.man}万円の手取り率は何%ですか？`,
      answer: `約${r.netIncomeRate.toFixed(
        1,
      )}%です。額面のうち社会保険料が約${formatManYen(
        r.socialInsurance,
        0,
      )}、所得税が約${formatManYen(r.incomeTax, 0)}、住民税が約${formatManYen(
        r.residentTax,
        0,
      )}引かれます。年収が上がるほど税・社会保険の負担率が増え、手取り率は下がる傾向です。`,
    },
    {
      question: `年収${level.man}万円で税金・社会保険はいくら引かれますか？`,
      answer: `社会保険料（健康保険・厚生年金・雇用保険）が約${formatManYen(
        r.socialInsurance,
        0,
      )}、所得税が約${formatManYen(r.incomeTax, 0)}、住民税が約${formatManYen(
        r.residentTax,
        0,
      )}で、合計の控除は約${formatManYen(
        r.socialInsurance + r.incomeTax + r.residentTax,
        0,
      )}です。`,
    },
    {
      question: "扶養家族がいると手取りは変わりますか？",
      answer:
        "変わります。配偶者控除や扶養控除があると課税所得が下がり、所得税・住民税が軽くなるため手取りは増えます。このページは独身・扶養なしの概算のため、家族構成を反映した金額は手取り計算ツールでご確認ください。",
    },
    {
      question: "この手取りは正確ですか？",
      answer: `${TAX_YEAR}年度の税制・東京都の協会けんぽ料率と標準報酬月額の等級表をもとにした概算です。加入する健康保険や都道府県、各種控除により実額は変わります。正確な金額は給与明細や勤務先の担当部署でご確認ください。`,
    },
  ];

  return (
    <Container className="py-10">
      <JsonLd
        data={articleJsonLd({
          headline: `年収${level.man}万円の手取りはいくら？`,
          description: `年収${level.man}万円の手取り額・手取り率と、社会保険料・所得税・住民税の内訳の解説。`,
          url: `${siteConfig.url}/take-home/${income}`,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "年収別の手取り", href: "/take-home" },
          { name: `年収${level.man}万円`, href: `/take-home/${income}` },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          令和{TAX_YEAR - 2018}年度（{TAX_YEAR}年）税制で計算
        </span>
        <span className="text-xs text-muted-foreground">
          最終更新：2026年8月13日
        </span>
      </div>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
        年収{level.man}万円の手取りはいくら？
      </h1>
      {/* AEO: H1直下に直接回答＋引用可能な数値 */}
      <p className="mt-3 max-w-2xl text-[15px] leading-7">
        <strong className="text-foreground">
          年収{level.man}万円の手取りは約{formatManYen(r.netIncome, 0)}
          （月あたり約{formatManYen(monthly, 1)}・手取り率
          {r.netIncomeRate.toFixed(1)}%）です。
        </strong>{" "}
        額面から社会保険料 約{formatManYen(r.socialInsurance, 0)}・所得税 約
        {formatManYen(r.incomeTax, 0)}・住民税 約
        {formatManYen(r.residentTax, 0)}
        が差し引かれます（東京都・独身・扶養なし・協会けんぽ令和8年度の概算）。
      </p>

      {/* 結論 */}
      <div className="mt-6 rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm text-muted-foreground">年間の手取り（目安）</p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-5xl">
          約{formatManYen(r.netIncome, 0)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          月あたり約{formatManYen(monthly, 1)}／手取り率 約
          {r.netIncomeRate.toFixed(1)}%
        </p>
      </div>

      {/* 内訳表 */}
      <h2 className="mt-10 text-lg font-bold">
        年収{level.man}万円の手取りの内訳
      </h2>
      <div className="mt-3 overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-b">
              <th scope="row" className="px-4 py-3 text-left font-medium">
                額面年収
              </th>
              <td className="px-4 py-3 text-right tabular-nums">
                {yen(level.income)}
              </td>
            </tr>
            <tr className="border-b">
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                社会保険料（健保・厚年・雇用）
              </th>
              <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                −{yen(r.socialInsurance)}
              </td>
            </tr>
            <tr className="border-b">
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                所得税（復興特別所得税含む）
              </th>
              <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                −{yen(r.incomeTax)}
              </td>
            </tr>
            <tr className="border-b">
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                住民税
              </th>
              <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                −{yen(r.residentTax)}
              </td>
            </tr>
            <tr className="bg-muted/40">
              <th scope="row" className="px-4 py-3 text-left font-bold">
                手取り
              </th>
              <td className="px-4 py-3 text-right font-bold tabular-nums">
                約{yen(r.netIncome)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  （月あたり約{formatManYen(monthly, 1)}）
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 額面に占める内訳を色分けバーで可視化 */}
      <div className="mt-4 rounded-xl border p-4">
        <BreakdownBar
          formatValue={(v) => formatManYen(v, 0)}
          segments={[
            {
              label: "手取り",
              value: r.netIncome,
              colorClass: "bg-emerald-500",
            },
            {
              label: "社会保険料",
              value: r.socialInsurance,
              colorClass: "bg-sky-500",
            },
            { label: "所得税", value: r.incomeTax, colorClass: "bg-amber-500" },
            {
              label: "住民税",
              value: r.residentTax,
              colorClass: "bg-violet-500",
            },
          ]}
        />
      </div>

      {/* 数字で見る（ページ固有のユニークデータ） */}
      <h3 className="mt-8 text-base font-bold">
        数字で見る年収{level.man}万円
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">手取り率</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {r.netIncomeRate.toFixed(1)}%
          </p>
          {(prevRate != null || nextRate != null) && (
            <p className="mt-1 text-xs text-muted-foreground tabular-nums">
              {prev && prevRate != null
                ? `${prev.man}万→${prevRate.toFixed(1)}% `
                : ""}
              {next && nextRate != null
                ? `／${next.man}万→${nextRate.toFixed(1)}%`
                : ""}
            </p>
          )}
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">所得税の限界税率</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {Math.round(marginalRate * 100)}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            課税所得が属する税率帯
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">月あたりの手取り</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            約{formatManYen(monthly, 1)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            賞与込み・12等分の目安
          </p>
        </div>
      </div>

      {/* 年収帯特有の注意点 */}
      {note && (
        <div className="mt-4 rounded-xl border-l-4 border-primary bg-muted/30 p-4">
          <p className="text-sm font-semibold">
            年収{level.man}万円の帯で押さえておきたいポイント
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{note}</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={`/tools/salary-take-home?inc=${level.income}`}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          扶養・年齢を変えて手取りを計算する
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={`/furusato/${income}`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          年収{level.man}万円のふるさと納税上限額を見る
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* 解説 */}
      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">
            年収{level.man}万円の手取りの計算方法
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              会社員の手取りは、
              <strong className="text-foreground">
                額面年収から社会保険料と税金（所得税・住民税）を差し引いた金額
              </strong>
              です。年収{level.man}
              万円の場合、まず健康保険・厚生年金・雇用保険の社会保険料（本人負担・約
              {formatManYen(r.socialInsurance, 0)}）が引かれます。
            </p>
            <p>
              次に、年収から給与所得控除を引いた「給与所得」から、基礎控除や社会保険料控除などを差し引いた
              <strong className="text-foreground">課税所得</strong>
              に対して、所得税（累進税率）と住民税（所得割・標準10%）がかかります。年収
              {level.man}万円では、所得税が約{formatManYen(r.incomeTax, 0)}
              、住民税が約{formatManYen(r.residentTax, 0)}が目安です。
            </p>
            <p>
              この結果、年収{level.man}万円の手取りは約
              {formatManYen(r.netIncome, 0)}、手取り率は約
              {r.netIncomeRate.toFixed(1)}%になります。月あたりにすると約
              {formatManYen(monthly, 1)}
              ですが、実際にはボーナスの有無や月ごとの変動があるため平均的な目安と考えてください。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">額面と手取りはなぜ差が出るのか</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              求人票や契約書に書かれる「年収」は通常
              <strong className="text-foreground">額面</strong>
              （税・社会保険料を引く前）です。ここから、会社と折半で負担する社会保険料（本人負担は概ね額面の約15%）と、所得税・住民税が差し引かれるため、実際に受け取る手取りは額面より2〜3割少なくなります。
            </p>
            <p>
              社会保険料には上限（標準報酬月額・標準賞与額の上限）があり、住民税は前年の所得に対して翌年課税される点も、額面と手取りの感覚がずれる理由です。年収
              {level.man}
              万円の内訳は上の表のとおりで、家族構成や加入する健康保険によって実額は変わります。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">
            家族構成で年収{level.man}万円の手取りはどう変わる？
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              このページは
              <strong className="text-foreground">独身・扶養なし</strong>
              を前提とした概算です。配偶者控除の対象となる配偶者がいる場合や、16歳以上の扶養家族がいる場合は、課税所得が下がって所得税・住民税が軽くなり、手取りは増えます。
            </p>
            <p>
              逆に40歳以上になると介護保険料が上乗せされ、社会保険料が増えます。ご自身の条件での手取りは、
              <Link
                href={`/tools/salary-take-home?inc=${level.income}`}
                className="text-primary underline"
              >
                会社員の手取り計算ツール
              </Link>
              に年齢や家族構成を入れて計算してください。
            </p>
          </div>
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

        {/* 前後の年収 */}
        <nav
          aria-label="他の年収の手取り"
          className="flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm"
        >
          {prev ? (
            <Link
              href={`/take-home/${prev.slug}`}
              className="font-medium text-primary hover:underline"
            >
              ← 年収{prev.man}万円の手取り
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/take-home"
            className="text-muted-foreground hover:underline"
          >
            年収別の手取り一覧
          </Link>
          {next ? (
            <Link
              href={`/take-home/${next.slug}`}
              className="font-medium text-primary hover:underline"
            >
              年収{next.man}万円の手取り →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <section
          aria-label="計算の前提と出典"
          className="rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground"
        >
          <p>
            本ページは{TAX_YEAR}
            年度の税制・東京都の協会けんぽ令和8年度料率をもとにした、独身・扶養なし・40歳未満の会社員の概算です。加入する健康保険・都道府県・各種控除により実額は異なります。
          </p>
          <p className="mt-1">
            計算根拠：
            <a
              href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              国税庁 No.1410 給与所得控除
            </a>
            ／
            <a
              href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              No.2260 所得税の税率
            </a>
            。詳しくは
            <Link href="/disclaimer" className="underline">
              免責事項
            </Link>
            をご確認ください。
          </p>
        </section>
      </div>
    </Container>
  );
}
