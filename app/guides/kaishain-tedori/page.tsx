import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Coins, Wallet } from "lucide-react";

import { GuideArticle } from "@/components/guides/GuideArticle";
import { GuideSection } from "@/components/guides/GuideSection";
import { JsonLd } from "@/components/common/JsonLd";
import { getGuideBySlug } from "@/lib/guides";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";

const guide = getGuideBySlug("kaishain-tedori")!;

const description =
  "額面（年収）と手取りの違い、給料から引かれる社会保険料・所得税・住民税の中身、手取りの目安、手取りを増やす方法をやさしく解説。自分の手取りはシミュレーターで計算できます。";

const toc = [
  { id: "chigai", label: "額面と手取りの違い" },
  { id: "hikareru", label: "給料から引かれるもの" },
  { id: "fuyasu", label: "手取りを増やすには" },
  { id: "keisan", label: "自分の手取りを計算する" },
  { id: "faq", label: "よくあるご質問" },
];

const faqs = [
  {
    question: "手取りは額面の何割くらいですか？",
    answer:
      "年収にもよりますが、おおむね額面の75〜85%程度が目安です。社会保険料が額面の約15%、これに所得税・住民税が加わります。所得税は累進課税のため、年収が高くなるほど手取りの割合は下がっていきます。正確な金額は手取り計算ツールで確認できます。",
  },
  {
    question: "ボーナスの手取りはどうなりますか？",
    answer:
      "ボーナスからも社会保険料と所得税が引かれます（住民税は引かれません）。手取りはおおむね額面の8割前後が目安です。詳しくはボーナス手取り計算ツールで確認できます。",
  },
  {
    question: "住民税はなぜ翌年から引かれるのですか？",
    answer:
      "住民税は前年の所得をもとに計算され、その翌年（6月〜翌年5月）に納めるためです。新社会人の1年目は住民税が引かれず、2年目から引かれ始めるので、手取りが減ったように感じることがあります。",
  },
  {
    question: "手取りを増やすにはどうすればいいですか？",
    answer:
      "iDeCoの掛金は全額が所得控除になり、所得税・住民税が軽くなります。ふるさと納税は実質2,000円の負担で返礼品を受け取れます。配偶者控除・扶養控除・医療費控除など、使える控除を漏らさないことも大切です。",
  },
  {
    question: "転職では額面と手取り、どちらで比べるべきですか？",
    answer:
      "生活に使えるお金は手取りなので、手取りベースで比較するのが実感に近くなります。額面が同じでも、社会保険料や住民税、家族構成によって手取りは変わります。求人の額面をもとに、手取りの目安を計算してから判断するのがおすすめです。",
  },
];

export const metadata: Metadata = {
  title: "会社員の手取りはどう決まる？額面との違いと計算方法を解説｜まねでん",
  description,
  alternates: { canonical: guide.href },
  openGraph: {
    type: "article",
    title: guide.title,
    description,
    url: `${siteConfig.url}${guide.href}`,
  },
};

const deductions = [
  {
    title: "① 社会保険料",
    body: "健康保険・厚生年金・雇用保険（40歳以上は介護保険も）。会社と折半で、本人負担は概ね額面の約15%です。",
  },
  {
    title: "② 所得税",
    body: "課税所得に累進税率（5〜45%）をかけて計算。年収が高いほど税率が上がります。毎月の給与から源泉徴収され、年末調整で精算されます。",
  },
  {
    title: "③ 住民税",
    body: "所得に対して概ね一律10%。前年の所得をもとに計算され、翌年6月から給与天引きされます。",
  },
];

const toolCtas = [
  {
    href: "/tools/salary-take-home",
    icon: Wallet,
    title: "会社員の手取りを計算",
    desc: "年収から社会保険料・税金・手取りを試算",
  },
  {
    href: "/tools/bonus-take-home",
    icon: Coins,
    title: "ボーナスの手取りを計算",
    desc: "賞与の額面から手取りと手取り率を試算",
  },
  {
    href: "/tools/hourly-wage",
    icon: Clock,
    title: "時給・年収を変換",
    desc: "時給から年収、年収から時給を相互に換算",
  },
];

export default function KaishainTedoriGuide() {
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
            手取りとは、
            <strong className="font-semibold text-foreground">
              額面（年収・総支給）から社会保険料と税金（所得税・住民税）を引いた、実際に使えるお金
            </strong>
            のことです。手取りはおおむね額面の
            <strong className="font-semibold text-foreground">75〜85%</strong>
            が目安で、年収が高くなるほど（所得税率が上がるため）その割合は下がっていきます。
          </p>
        </div>

        <GuideSection id="chigai" title="額面と手取りの違い">
          <p>
            求人票や給与明細に載る<strong>「額面（総支給）」</strong>
            は、税金や社会保険料を引く前の金額です。そこから天引きされたあとに、実際に口座へ振り込まれるのが
            <strong>「手取り」</strong>
            です。生活に使えるのは手取りなので、家計や転職の判断は手取りで見るのが実感に近くなります。
          </p>
        </GuideSection>

        <GuideSection id="hikareru" title="給料から引かれるもの">
          <div className="space-y-3">
            {deductions.map((d) => (
              <div key={d.title} className="rounded-xl border p-4">
                <p className="font-semibold text-foreground">{d.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d.body}</p>
              </div>
            ))}
          </div>
          <p>
            これらを合計したものが額面から引かれ、残りが手取りになります。社会保険料は年齢（40歳以上は介護保険）や年収で、税金は課税所得や家族構成で変わります。
          </p>
        </GuideSection>

        <GuideSection id="fuyasu" title="手取りを増やすには">
          <p>
            使える控除を活用すると、同じ額面でも手取り（正確には手元に残るお金）を増やせます。
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>iDeCo</strong>
              ：掛金が全額所得控除になり、所得税・住民税が軽くなる
            </li>
            <li>
              <strong>ふるさと納税</strong>
              ：実質2,000円の負担で返礼品を受け取れる
            </li>
            <li>
              配偶者控除・扶養控除・医療費控除など、使える控除を漏らさない
            </li>
          </ul>
          <p>
            くわしくは
            <Link
              href="/guides/ideco-vs-nisa"
              className="font-medium text-primary underline underline-offset-2"
            >
              iDeCoと新NISAの使い分けガイド
            </Link>
            や
            <Link
              href="/guides/furusato-nouzei"
              className="font-medium text-primary underline underline-offset-2"
            >
              ふるさと納税の仕組みガイド
            </Link>
            もあわせてご覧ください。
          </p>
        </GuideSection>

        <GuideSection id="keisan" title="自分の手取りを計算する">
          <p>
            手取りは年収・年齢・家族構成で変わります。自分の場合の金額は、無料・登録不要のツールで確認できます。
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {toolCtas.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <c.icon className="size-5 text-primary" aria-hidden />
                <p className="mt-2 font-semibold text-foreground group-hover:text-primary">
                  {c.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              </Link>
            ))}
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
          本記事は一般的な情報提供を目的とした解説です。手取りの割合はあくまで目安で、実際の金額は各人の年収・年齢・家族構成・お住まいの自治体により異なります。
        </p>
      </GuideArticle>
    </>
  );
}
