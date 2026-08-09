import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Sprout, TrendingUp } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { getGuideBySlug } from "@/lib/guides";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const guide = getGuideBySlug("ideco-vs-nisa")!;

const description =
  "iDeCoと新NISAの違いを比較表で整理し、どちらから始めるべきか、併用するメリットと注意点、会社員の使い分けまで解説。iDeCoの節税額と新NISAの将来額はシミュレーターで確かめられます。";

const faqs = [
  {
    question: "iDeCoと新NISA、結局どちらがお得ですか？",
    answer:
      "一概には言えません。新NISAは「いつでも引き出せる柔軟さ」、iDeCoは「掛金が全額所得控除になり“今の税金”も軽くなる」のが強みです。多くの会社員は、まず新NISA（つみたて投資枠）から始め、余裕があればiDeCoも併用するのが分かりやすい優先順位です。所得が高い人ほどiDeCoの節税メリットが大きくなります。",
  },
  {
    question: "iDeCoと新NISAは併用できますか？",
    answer:
      "できます。両方の非課税枠を同時に使えます。新NISAは運用益が非課税、iDeCoは運用益が非課税なうえに掛金が所得控除になります。役割分担として「新NISA＝いつでも使える資産形成」「iDeCo＝老後専用の器」と考えると整理しやすいです。",
  },
  {
    question: "会社員はどちらを優先すべきですか？",
    answer:
      "生活防衛資金（生活費の3〜6か月分）を確保したうえで、まず新NISAのつみたて投資枠から始めるのが一般的です。所得税率が高い（課税所得が大きい）方や、老後資金を確実に積み立てたい方は、iDeCoの優先度が上がります。",
  },
  {
    question: "両方を満額やるといくら必要ですか？",
    answer:
      "新NISAは年間360万円（月30万円）まで、iDeCoは加入区分により月1.2万〜6.8万円が上限です。合わせると相当な金額になるため、無理に満額を目指す必要はありません。まずは続けられる金額から始め、家計に余裕が出たら増やすのがおすすめです。",
  },
  {
    question: "iDeCoのデメリットは何ですか？",
    answer:
      "iDeCoの資産は原則60歳まで引き出せません。急な出費に使えない点は新NISAと大きく違います。また口座管理手数料がかかります。一方で「引き出せない＝強制的に老後資金を貯められる」という利点にもなります。",
  },
];

export const metadata: Metadata = {
  title:
    "iDeCoと新NISA、どっちから始める？併用のメリットと使い分け｜比較ガイド",
  description,
  alternates: { canonical: guide.href },
  openGraph: {
    type: "article",
    title: guide.title,
    description,
    url: `${siteConfig.url}${guide.href}`,
  },
};

const compareRows = [
  {
    label: "主な目的",
    nisa: "いつでも使える資産形成",
    ideco: "老後資金づくり",
  },
  {
    label: "税制メリット",
    nisa: "運用益が非課税",
    ideco: "運用益が非課税＋掛金が全額所得控除",
  },
  {
    label: "年間の上限",
    nisa: "360万円（つみたて120＋成長240）",
    ideco: "約14.4万〜81.6万円（区分による）",
  },
  {
    label: "引き出し",
    nisa: "いつでも可能",
    ideco: "原則60歳まで不可",
  },
  { label: "口座管理手数料", nisa: "基本なし", ideco: "あり" },
  {
    label: "向いている人",
    nisa: "柔軟に使いたい／初めての人",
    ideco: "所得が高い／老後資金を確実に貯めたい人",
  },
];

const toolCtas = [
  {
    href: "/tools/ideco",
    icon: TrendingUp,
    title: "iDeCoの節税額を計算",
    desc: "年収と掛金から年間・累計の節税額を試算",
  },
  {
    href: "/tools/nisa",
    icon: Sprout,
    title: "新NISAの将来額を計算",
    desc: "毎月の積立と利回りから将来の評価額を試算",
  },
  {
    href: "/tools/salary-take-home",
    icon: Calculator,
    title: "今の手取りを確認",
    desc: "会社員の手取りから、いくら回せるかを把握",
  },
];

export default function IdecoVsNisaGuide() {
  const url = `${siteConfig.url}${guide.href}`;

  return (
    <Container className="py-8">
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

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ガイド", href: "/guides" },
          { name: guide.shortTitle, href: guide.href },
        ]}
      />

      <article className="mt-4">
        <h1 className="text-2xl font-bold sm:text-3xl">{guide.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          最終更新日: {guide.updated}
        </p>
        <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>

        {/* 結論先出し */}
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <p className="text-sm font-semibold text-foreground">
            結論から言うと
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            多くの会社員は、
            <strong className="text-foreground">
              まず新NISA（つみたて投資枠）から始め、家計に余裕があればiDeCoも併用
            </strong>
            するのが分かりやすい順番です。新NISAは
            <strong className="text-foreground">
              いつでも引き出せる柔軟さ
            </strong>
            、iDeCoは
            <strong className="text-foreground">
              掛金が全額所得控除になり“今の税金”も軽くなる
            </strong>
            のが強み。所得が高い人ほどiDeCoの節税効果が大きくなります。
          </p>
        </div>

        <div className="mt-10 max-w-2xl space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground">
              iDeCoと新NISAの違い（比較表）
            </h2>
            <p className="mt-3">
              どちらも「運用益が非課税」という共通点がありますが、目的・引き出しやすさ・税メリットが異なります。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-3 text-left font-semibold text-foreground"></th>
                    <th className="px-3 py-2 text-left font-semibold text-foreground">
                      新NISA
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-foreground">
                      iDeCo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.label} className="border-b align-top">
                      <th className="py-3 pr-3 text-left font-medium text-foreground">
                        {row.label}
                      </th>
                      <td className="px-3 py-3">{row.nisa}</td>
                      <td className="px-3 py-3">{row.ideco}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">
              どっちから始める？
            </h2>
            <p className="mt-3">迷ったら、次の順番が基本です。</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">
                  ① 生活防衛資金を確保
                </strong>
                （生活費の3〜6か月分。投資より先に）
              </li>
              <li>
                <strong className="text-foreground">
                  ② 新NISA（つみたて投資枠）
                </strong>
                で少額から積立を始める
              </li>
              <li>
                <strong className="text-foreground">③ 余裕が出たらiDeCo</strong>
                も併用して、老後資金と節税を上乗せ
              </li>
            </ul>
            <p className="mt-3">
              ただし、
              <strong className="text-foreground">
                所得税率が高い方や、老後資金を確実に積み立てたい方
              </strong>
              は、iDeCoの優先度が上がります。iDeCoは60歳まで引き出せないぶん、「強制的に老後資金を貯められる」という利点にもなります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">
              併用するメリット
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                両方の非課税枠を同時に使い、運用益への課税をどちらも回避できる
              </li>
              <li>
                iDeCoの掛金は所得控除になるため、
                <strong className="text-foreground">
                  今払っている税金も軽く
                </strong>
                なる（新NISAにはないメリット）
              </li>
              <li>
                新NISAはいつでも引き出せるので、急な出費に対応しつつ、iDeCoで老後資金を確実に確保できる
              </li>
              <li>
                役割分担：
                <strong className="text-foreground">
                  新NISA＝いつでも使える資産／iDeCo＝老後専用の器
                </strong>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">併用の注意点</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                iDeCoは
                <strong className="text-foreground">
                  原則60歳まで引き出せない
                </strong>
                。無理な掛金は家計を圧迫するので、続けられる額に
              </li>
              <li>iDeCoは口座管理手数料がかかる</li>
              <li>掛金には上限がある（iDeCoは加入区分で異なる）</li>
              <li>
                いきなり両方“満額”を目指さず、少額から始めて徐々に増やすのが無理がない
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">
              数字で確かめる
            </h2>
            <p className="mt-3">
              「自分の場合はいくら得になるのか」は、実際に計算するのがいちばんです。無料・登録不要で試せます。
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {toolCtas.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group rounded-xl border p-4 transition-colors hover:border-primary/50 hover:bg-muted/40"
                >
                  <c.icon className="size-5 text-primary" aria-hidden />
                  <p className="mt-2 font-semibold text-foreground group-hover:text-primary">
                    {c.title}
                  </p>
                  <p className="mt-1 text-xs">{c.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">
              よくあるご質問
            </h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-foreground">
                    {faq.question}
                  </dt>
                  <dd className="mt-1">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-foreground">
            ⚠️
            本記事は一般的な情報提供を目的とした解説で、特定の金融商品を推奨するものではありません。制度の詳細や最新の条件は公式情報をご確認のうえ、ご自身の判断で行ってください。
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/guides"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            ほかのガイドを見る
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </article>
    </Container>
  );
}
