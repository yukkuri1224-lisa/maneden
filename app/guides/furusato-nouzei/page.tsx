import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Gift } from "lucide-react";

import { GuideArticle } from "@/components/guides/GuideArticle";
import { GuideSection } from "@/components/guides/GuideSection";
import { JsonLd } from "@/components/common/JsonLd";
import { getGuideBySlug } from "@/lib/guides";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const guide = getGuideBySlug("furusato-nouzei")!;

const description =
  "ふるさと納税の仕組み（実質2,000円で返礼品と税の控除）、限度額の決まり方、やり方（ワンストップ特例・確定申告）、注意点をやさしく解説。自分の上限額はシミュレーターで確認できます。";

const toc = [
  { id: "shikumi", label: "ふるさと納税の仕組み" },
  { id: "gendo", label: "限度額の決まり方" },
  { id: "yarikata", label: "やり方（4ステップ）" },
  { id: "onestop", label: "ワンストップ特例と確定申告" },
  { id: "chuui", label: "注意点" },
  { id: "keisan", label: "限度額を計算する" },
  { id: "faq", label: "よくあるご質問" },
];

const faqs = [
  {
    question: "「実質2,000円」とはどういう意味ですか？",
    answer:
      "ふるさと納税では、寄附した額のうち2,000円を超える部分が、原則として翌年の所得税・住民税から控除されます。つまり自己負担は2,000円だけで、その2,000円で返礼品を受け取れる、というのが「実質2,000円」の意味です。ただし控除には上限（限度額）があり、上限を超えた分は自己負担になります。",
  },
  {
    question: "限度額を超えて寄附するとどうなりますか？",
    answer:
      "限度額を超えた部分は税金から控除されず、まるごと自己負担になります。損をしないためには、事前に自分の限度額を確認し、その範囲内で寄附することが大切です。限度額は年収や家族構成で決まります。",
  },
  {
    question: "ワンストップ特例とは何ですか？",
    answer:
      "確定申告をしなくても寄附金控除が受けられる仕組みです。もともと確定申告が不要な給与所得者で、1年間の寄附先が5自治体以内の場合に使えます。各自治体に申請書を提出すると、翌年の住民税から控除されます。",
  },
  {
    question: "確定申告は必要ですか？",
    answer:
      "寄附先が6自治体以上ある場合や、もともと確定申告をする人（医療費控除や事業所得がある人など）は、確定申告でふるさと納税の寄附金控除を申告します。ワンストップ特例を使う場合は確定申告は不要です。",
  },
  {
    question: "いつまでにやればいいですか？",
    answer:
      "その年の控除に反映させるには、1月1日〜12月31日の間に寄附を完了する必要があります。ワンストップ特例を使う場合は、原則として翌年1月10日必着で各自治体に申請書を提出します。",
  },
  {
    question: "共働きの場合、限度額はどうなりますか？",
    answer:
      "限度額は「寄附する本人の年収・家族構成」で決まります。共働きの場合は夫婦それぞれが自分の名義・自分の限度額の範囲で寄附できます。配偶者を扶養に入れているかどうかでも変わるため、シミュレーターで各自の上限を確認するのが確実です。",
  },
];

export const metadata: Metadata = {
  title: "ふるさと納税とは？仕組み・限度額・やり方をやさしく解説｜まねでん",
  description,
  alternates: { canonical: guide.href },
  openGraph: {
    type: "article",
    title: guide.title,
    description,
    url: `${siteConfig.url}${guide.href}`,
  },
};

const steps = [
  {
    title: "① 限度額を調べる",
    desc: "年収と家族構成から、自己負担2,000円で済む寄附の上限額を確認します。",
  },
  {
    title: "② 寄附する",
    desc: "応援したい自治体に寄附し、返礼品と寄附の証明書（受領証）を受け取ります。",
  },
  {
    title: "③ 控除の手続き",
    desc: "ワンストップ特例の申請、または確定申告で寄附金控除を申告します。",
  },
  {
    title: "④ 税金が軽くなる",
    desc: "翌年の所得税の還付・住民税の控除という形で、寄附額（−2,000円）が戻ります。",
  },
];

const oneStopRows = [
  {
    label: "使える人",
    onestop: "確定申告が不要な給与所得者",
    tax: "自営業・医療費控除などで申告する人",
  },
  {
    label: "寄附先の数",
    onestop: "1年間で5自治体まで",
    tax: "6自治体以上でもOK",
  },
  {
    label: "手続き",
    onestop: "各自治体に申請書を提出",
    tax: "確定申告でまとめて申告",
  },
  {
    label: "控除される税金",
    onestop: "翌年の住民税から",
    tax: "所得税の還付＋住民税から",
  },
];

export default function FurusatoNouzeiGuide() {
  const url = `${siteConfig.url}${guide.href}`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: guide.title,
          description,
          url,
          datePublished: guide.publishedISO,
          dateModified: guide.updatedISO,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", url: `${siteConfig.url}/` },
          { name: "ガイド", url: `${siteConfig.url}/guides` },
          { name: guide.shortTitle, url },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <GuideArticle guide={guide} toc={toc}>
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
          <p className="text-sm font-bold text-primary">ひとことで言うと</p>
          <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
            ふるさと納税は、
            <strong className="font-semibold text-foreground">
              実質2,000円の自己負担で、応援したい自治体に寄附して返礼品を受け取れる
            </strong>
            制度です。寄附額のうち2,000円を超える部分は、原則として
            <strong className="font-semibold text-foreground">
              翌年の所得税・住民税から控除
            </strong>
            されます。ただし控除には上限があるため、
            <strong className="font-semibold text-foreground">
              自分の限度額の範囲内で寄附する
            </strong>
            のが鉄則です。
          </p>
        </div>

        <GuideSection id="shikumi" title="ふるさと納税の仕組み">
          <p>
            寄附をすると、<strong>寄附額 − 2,000円</strong>
            が、翌年の税金から差し引かれます。所得税は還付（またはその年の税額から控除）、住民税は翌年度の税額から控除される形です。結果として、実質2,000円の負担で返礼品を受け取れる、というわけです。
          </p>
          <p>
            つまり「税金が安くなる」というより、
            <strong>
              本来納める税金を先に別の自治体へ寄附し、その分を控除してもらう
            </strong>
            イメージです。返礼品のぶんだけお得になる、と考えると分かりやすいでしょう。
          </p>
        </GuideSection>

        <GuideSection id="gendo" title="限度額の決まり方">
          <p>
            自己負担2,000円で済む寄附の上限（限度額）は、
            <strong>年収と家族構成</strong>
            でおおよそ決まります。年収が高いほど限度額は大きく、扶養している家族が多いほど小さくなる傾向があります。iDeCoや医療費控除など、ほかの控除が多い年も限度額は下がります。
          </p>
          <p>
            限度額を超えた寄附は自己負担になってしまうため、寄附の前に必ず自分の上限を確認しましょう。
          </p>
        </GuideSection>

        <GuideSection id="yarikata" title="やり方（4ステップ）">
          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((s) => (
              <div key={s.title} className="rounded-xl border p-4">
                <p className="font-semibold text-foreground">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection id="onestop" title="ワンストップ特例と確定申告の違い">
          <p>控除の手続きには2つの方法があります。どちらか一方で申請します。</p>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-semibold text-foreground"></th>
                  <th className="p-3 text-left font-semibold text-foreground">
                    ワンストップ特例
                  </th>
                  <th className="p-3 text-left font-semibold text-foreground">
                    確定申告
                  </th>
                </tr>
              </thead>
              <tbody>
                {oneStopRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-t align-top",
                      i % 2 === 1 && "bg-muted/20",
                    )}
                  >
                    <th className="p-3 text-left font-medium text-foreground">
                      {row.label}
                    </th>
                    <td className="p-3">{row.onestop}</td>
                    <td className="p-3">{row.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GuideSection>

        <GuideSection id="chuui" title="注意点">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>限度額の超過に注意</strong>
              。超えた分は控除されず自己負担になる
            </li>
            <li>
              寄附はその年の<strong>12月31日まで</strong>
              に完了する（翌年の控除に反映）
            </li>
            <li>
              ワンストップ特例は原則<strong>翌年1月10日必着</strong>
              で申請書を提出する
            </li>
            <li>寄附は控除を受ける本人の名義で行う</li>
          </ul>
        </GuideSection>

        <GuideSection id="keisan" title="自分の限度額を計算する">
          <p>
            限度額は年収・家族構成で人それぞれ。まずは自分の上限を確認してから寄附するのが確実です。無料・登録不要で試せます。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/tools/furusato-tax"
              className="group rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
            >
              <Gift className="size-5 text-primary" aria-hidden />
              <p className="mt-2 font-semibold text-foreground group-hover:text-primary">
                ふるさと納税の限度額を計算
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                年収と家族構成から自己負担2,000円の上限額を試算
              </p>
            </Link>
            <Link
              href="/tools/salary-take-home"
              className="group rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
            >
              <Calculator className="size-5 text-primary" aria-hidden />
              <p className="mt-2 font-semibold text-foreground group-hover:text-primary">
                会社員の手取りを計算
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                年収から手取りと住民税の目安を確認
              </p>
            </Link>
          </div>
        </GuideSection>

        <GuideSection id="faq" title="よくあるご質問">
          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border bg-card p-4">
                <dt className="font-semibold text-foreground">
                  {faq.question}
                </dt>
                <dd className="mt-2">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>

        <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-7 text-muted-foreground">
          ⚠️
          本記事は一般的な情報提供を目的とした解説です。限度額はあくまで目安で、実際の控除額は各人の所得や他の控除により異なります。制度の詳細や最新の条件は、総務省やお住まいの自治体の公式情報をご確認ください。
        </p>
      </GuideArticle>
    </>
  );
}
