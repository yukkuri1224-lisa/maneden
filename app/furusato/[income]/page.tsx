import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { calculateFurusato } from "@/lib/calculators/furusato-tax";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { TAX_YEAR } from "@/lib/constants/tax-tables";
import { formatManYen } from "@/lib/format";
import {
  adjacentLevels,
  FURUSATO_NOTES,
  getIncomeLevel,
  INCOME_LEVELS,
} from "@/lib/longtail/levels";
import { articleJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return INCOME_LEVELS.map((l) => ({ income: l.slug }));
}

const PUBLISHED = "2026-08-13T00:00:00+09:00";

/** その年収（独身・扶養なし）でのふるさと納税上限額を、実社会保険料を用いて算出 */
function furusatoLimitFor(income: number): number {
  const s = calculateSalaryTakeHome({
    income,
    isOver40: false,
    hasSpouse: false,
    dependents: 0,
  });
  return calculateFurusato({
    incomeType: "salary",
    income,
    socialInsurance: s.socialInsurance,
    hasSpouse: false,
    dependents: 0,
  }).donationLimit;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ income: string }>;
}): Promise<Metadata> {
  const { income } = await params;
  const level = getIncomeLevel(income);
  if (!level) return {};

  const limit = furusatoLimitFor(level.income);
  const title = `年収${level.man}万円のふるさと納税上限額は？自己負担2,000円で寄付できる額`;
  const description = `年収${level.man}万円（独身・扶養なし）のふるさと納税の控除上限額は約${formatManYen(
    limit,
    0,
  )}が目安。自己負担2,000円で寄付できる金額の計算方法と、家族構成・控除による違いを解説します。`;

  return {
    title,
    description,
    alternates: { canonical: `/furusato/${income}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/furusato/${income}`,
    },
  };
}

export default async function FurusatoLevelPage({
  params,
}: {
  params: Promise<{ income: string }>;
}) {
  const { income } = await params;
  const level = getIncomeLevel(income);
  if (!level) notFound();

  const limit = furusatoLimitFor(level.income);
  const note = FURUSATO_NOTES[level.man];
  const { prev, next } = adjacentLevels(level.man);
  // ページ固有のユニークデータ（近似重複回避）：隣接年収帯の上限額
  const prevLimit = prev ? furusatoLimitFor(prev.man * 10_000) : null;
  const nextLimit = next ? furusatoLimitFor(next.man * 10_000) : null;

  const faqs = [
    {
      question: `年収${level.man}万円のふるさと納税の上限額はいくらですか？`,
      answer: `独身・扶養なしの場合で約${formatManYen(
        limit,
        0,
      )}が目安です。この範囲内で寄付すれば、自己負担は2,000円で済みます。配偶者控除や扶養、住宅ローン控除・医療費控除・iDeCoなどがあると上限は下がります。`,
    },
    {
      question: "上限額はどうやって決まりますか？",
      answer:
        "主に住民税の所得割額で決まります。おおまかには「住民税の所得割額 × 20% ÷（90%−所得税率×1.021）＋2,000円」で、自己負担2,000円で済む上限額が求められます。収入・家族構成・各種控除で所得割額が変わるため、上限も人によって異なります。",
    },
    {
      question: "上限額を超えて寄付するとどうなりますか？",
      answer:
        "上限を超えた分は控除されず、そのまま自己負担になります。年収の見込みが変わることもあるため、上限の8〜9割程度に抑えておくと安心です。",
    },
    {
      question: "いつの年収で計算しますか？",
      answer:
        "寄付した年（1〜12月）の所得に対する住民税・所得税から控除されるため、前年ではなく「寄付する年の見込み年収」で判断します。年の途中では確定しないため、直近の年収や見込みで計算します。",
    },
    {
      question: "確定申告は必要ですか？",
      answer:
        "寄付先が5自治体以内で、ほかに確定申告の必要がない給与所得者なら、ワンストップ特例制度を使えば確定申告は不要です。6自治体以上に寄付した場合や、医療費控除などで確定申告する場合は、寄附金控除として申告します。",
    },
  ];

  return (
    <Container className="py-10">
      <JsonLd
        data={articleJsonLd({
          headline: `年収${level.man}万円のふるさと納税上限額は？`,
          description: `年収${level.man}万円のふるさと納税の控除上限額の目安と、計算方法・注意点の解説。`,
          url: `${siteConfig.url}/furusato/${income}`,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "年収別ふるさと納税", href: "/furusato" },
          { name: `年収${level.man}万円`, href: `/furusato/${income}` },
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
        年収{level.man}万円のふるさと納税上限額は？
      </h1>
      {/* AEO: H1直下に直接回答＋引用可能な数値 */}
      <p className="mt-3 max-w-2xl text-[15px] leading-7">
        <strong className="text-foreground">
          年収{level.man}万円（独身・扶養なし）のふるさと納税の控除上限額は約
          {formatManYen(limit, 0)}が目安です。
        </strong>{" "}
        この金額までなら実質的な自己負担2,000円で寄付でき、超えた分は自己負担になります。配偶者控除や住宅ローン控除・iDeCoなどがあると上限は下がります。
      </p>

      {/* 結論 */}
      <div className="mt-6 rounded-2xl border bg-gradient-to-b from-primary/5 to-background p-6 text-center sm:p-8">
        <p className="text-sm text-muted-foreground">
          控除上限額の目安（自己負担2,000円）
        </p>
        <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums sm:text-5xl">
          約{formatManYen(limit, 0)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          独身・扶養なしの場合の目安
        </p>
        {(prevLimit != null || nextLimit != null) && (
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            {prev && prevLimit != null
              ? `年収${prev.man}万→約${formatManYen(prevLimit, 0)}`
              : ""}
            {prev && prevLimit != null && next && nextLimit != null
              ? " ／ "
              : ""}
            {next && nextLimit != null
              ? `年収${next.man}万→約${formatManYen(nextLimit, 0)}`
              : ""}
          </p>
        )}
      </div>

      {/* 年収帯特有の注意点 */}
      {note && (
        <div className="mt-6 rounded-xl border-l-4 border-primary bg-muted/30 p-4">
          <p className="text-sm font-semibold">
            年収{level.man}万円のふるさと納税で押さえておきたいポイント
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{note}</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={`/tools/furusato-tax?inc=${level.income}`}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          家族構成を入れて上限額を計算する
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={`/take-home/${income}`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          年収{level.man}万円の手取りを見る
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* 解説 */}
      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">
            年収{level.man}万円のふるさと納税上限の考え方
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              ふるさと納税は、自治体への寄付を通じて
              <strong className="text-foreground">
                寄付額から2,000円を引いた金額が所得税・住民税から控除
              </strong>
              される制度です。ただし控除には上限があり、これは主に
              <strong className="text-foreground">住民税の所得割額</strong>
              で決まります。年収{level.man}
              万円（独身・扶養なし）では、控除上限額は約
              {formatManYen(limit, 0)}が目安です。
            </p>
            <p>
              上限額は「住民税の所得割額 × 20% ÷（90% − 所得税率 × 1.021）＋
              2,000円」で概算できます。年収が上がるほど住民税の所得割額が増えるため上限も大きくなりますが、
              <strong className="text-foreground">
                住宅ローン控除・医療費控除・iDeCo
              </strong>
              などで住民税の所得割が下がると、ふるさと納税の上限も下がる点に注意が必要です。
            </p>
            <p>
              上限の範囲内で寄付すれば、実質的な自己負担は2,000円だけで各地の返礼品を受け取れます。上限を超えた分は控除されず自己負担になるため、年収の見込みがぶれることも考えて、上限の8〜9割程度に抑えるのが安心です。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">
            家族構成で年収{level.man}万円の上限はどう変わる？
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              上限額は住民税の所得割で決まるため、
              <strong className="text-foreground">
                控除が増えると上限は下がります
              </strong>
              。配偶者控除の対象となる配偶者や、16歳以上の扶養家族がいる場合は、その分だけ上限が小さくなります。共働きで配偶者控除を受けない場合は、独身とほぼ同じ上限になります。
            </p>
            <p>
              このページは独身・扶養なしの目安です。配偶者・扶養家族や社会保険料など、ご自身の条件を反映した上限額は、
              <Link
                href={`/tools/furusato-tax?inc=${level.income}`}
                className="text-primary underline"
              >
                ふるさと納税の上限額シミュレーター
              </Link>
              で計算してください。あわせて、
              <Link
                href={`/take-home/${income}`}
                className="text-primary underline"
              >
                年収{level.man}万円の手取り
              </Link>
              も確認しておくと、寄付にまわせる余裕を把握できます。
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
          aria-label="他の年収のふるさと納税上限額"
          className="flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm"
        >
          {prev ? (
            <Link
              href={`/furusato/${prev.slug}`}
              className="font-medium text-primary hover:underline"
            >
              ← 年収{prev.man}万円の上限額
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/furusato"
            className="text-muted-foreground hover:underline"
          >
            年収別ふるさと納税一覧
          </Link>
          {next ? (
            <Link
              href={`/furusato/${next.slug}`}
              className="font-medium text-primary hover:underline"
            >
              年収{next.man}万円の上限額 →
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
            年度の税制をもとに、独身・扶養なし・給与所得者を前提とした概算です。他の控除の有無や自治体により上限は変わります。正確な金額は寄付先ポータルや自治体でご確認ください。
          </p>
          <p className="mt-1">
            計算根拠：
            <a
              href="https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              総務省 ふるさと納税ポータル（控除の仕組み）
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
