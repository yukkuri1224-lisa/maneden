import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolHighlights } from "@/components/common/ToolHighlights";
import { ToolMeta } from "@/components/common/ToolMeta";
import { WorkedExamples } from "@/components/common/WorkedExamples";
import { HourlyWageTool } from "@/components/tools/hourly-wage/HourlyWageTool";
import { calculateHourlyWage } from "@/lib/calculators/hourly-wage";
import { formatManYen } from "@/lib/format";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("hourly-wage")!;

/** 具体例（サーバー側で実際の計算関数から算出した概算） */
const hourlyExamples = [1_200, 1_500, 2_000].map((hourlyWage) => {
  const r = calculateHourlyWage({
    mode: "hourly-to-annual",
    hourlyWage,
    annualIncome: 0,
    hoursPerDay: 8,
    daysPerWeek: 5,
  });
  return {
    title: `時給${hourlyWage.toLocaleString("ja-JP")}円`,
    note: "1日8時間・週5日・年52週で換算（額面）",
    rows: [
      {
        label: "月収",
        value: `約${Math.round(r.monthlyWage).toLocaleString("ja-JP")}円`,
      },
      {
        label: "年収（額面）",
        value: `約${formatManYen(r.annualIncome, 0)}`,
        strong: true,
      },
      {
        label: "年間労働時間",
        value: `${r.annualHours.toLocaleString("ja-JP")}時間`,
      },
    ],
  };
});

const description =
  "時給から年収、年収から時給を相互に換算。1日の労働時間と週の労働日数を入れるだけで、日給・週給・月収・年収の目安をまとめて計算します。登録不要・無料。";

const faqs = [
  {
    question: "時給から年収はどう計算しますか？",
    answer:
      "「時給 × 1日の労働時間 × 週の労働日数 × 52週」で概算します。例えば時給1,200円・1日8時間・週5日なら、1,200×8×5×52＝約250万円です。",
  },
  {
    question: "ここでの年収は手取りですか？",
    answer:
      "いいえ。すべて額面（税金・社会保険料を差し引く前）の金額です。手取り額は「会社員の手取り計算」で確認できます。",
  },
  {
    question: "ボーナスは含まれますか？",
    answer:
      "時給から計算する場合、賞与は含まれません。賞与込みの実質時給を知りたいときは「年収→時給」に切り替え、額面年収を入力してください。",
  },
  {
    question: "時給1,000円・1,200円・1,500円だと年収はいくらですか？",
    answer:
      "1日8時間・週5日（年52週＝年2,080時間）で働いた場合、時給1,000円で約208万円、1,200円で約250万円、1,500円で約312万円が年収（額面）の目安です。実際は祝日・有給・シフトで労働時間が変わるため、上のツールで日数・時間を調整してください。",
  },
  {
    question: "この年収は手取りですか、額面ですか？",
    answer:
      "このツールが表示する年収は「額面」（税・社会保険料を引く前）です。手取りが知りたい場合は、算出した年収を会社員の手取り計算ツールに入力すると、社会保険料・所得税・住民税を差し引いた手取り額を確認できます。",
  },
];

export const metadata: Metadata = {
  title: "時給・年収の変換シミュレーター｜時給から年収・年収から時給を無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function HourlyWagePage() {
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
          年間52週・入力した労働時間をもとにした概算です。金額はすべて額面（税・社会保険を引く前）です。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <HourlyWageTool />
        </Suspense>
      </div>

      <ToolHighlights
        items={[
          "時給から年収、年収から時給を相互に換算できます。",
          "労働時間・週の日数を指定して、日給・週給・月収・年収をまとめて計算できます。",
          "パート・アルバイト・派遣・フルタイムなど、働き方に合わせて年収の目安を確認できます。",
        ]}
      />

      <AdSlot className="mt-10" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">時給と年収の換算方法</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              時給と年収は、
              <strong className="text-foreground">年間の労働時間</strong>
              を介して相互に換算できます。年間労働時間は「1日の労働時間 ×
              週の労働日数 × 52週」で概算します。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">時給 → 年収</h3>
              <p className="mt-1">
                時給 × 年間労働時間
                で年収（額面）を求めます。例：時給1,500円・1日8時間・週5日 →
                1,500 × 2,080時間 ＝ 312万円。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">年収 → 時給</h3>
              <p className="mt-1">
                年収（額面）÷ 年間労働時間
                で実質時給を求めます。残業や休日の多さを労働時間に反映すると、より実態に近づきます。
              </p>
            </div>
            <p>
              ここで扱う金額はすべて
              <strong className="text-foreground">額面</strong>
              です。手取り（税・社会保険料を引いた後）は
              <a
                href="/tools/salary-take-home"
                className="text-primary underline"
              >
                会社員の手取り計算
              </a>
              で確認できます。
            </p>
          </div>
        </section>

        <WorkedExamples
          description="時給別に、1日8時間・週5日で働いた場合の年収の目安です（額面。税・社会保険を引く前の金額）。"
          examples={hourlyExamples}
        />

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">額面</dt>
              <dd className="text-muted-foreground">
                税金・社会保険料が引かれる前の総支給額。求人の「月給」「年収」は通常この額面。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">年間労働時間</dt>
              <dd className="text-muted-foreground">
                1年間に働く合計時間。ここでは「1日の労働時間 × 週の労働日数 ×
                52週」で概算。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">実質時給</dt>
              <dd className="text-muted-foreground">
                年収を実際の労働時間で割った時給。残業が多いほど実質時給は下がる。
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

        <RelatedTools excludeId="hourly-wage" />

        <ToolMeta
          toolId="hourly-wage"
          updated="2026年8月7日"
          basis="年間52週・入力した労働時間をもとにした概算です。金額はすべて額面（税・社会保険を引く前）で、手取りではありません。"
        />
      </div>
    </Container>
  );
}
