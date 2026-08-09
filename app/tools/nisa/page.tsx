import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolMeta } from "@/components/common/ToolMeta";
import { NisaTool } from "@/components/tools/nisa/NisaTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("nisa")!;

const description =
  "新NISA（旧つみたてNISA）で毎月いくら積み立てると将来いくらになるかを、複利でシミュレーション。初期一括にも対応し、運用益と非課税メリット（本来かかる約20%の税金）、年ごとの資産推移がわかります。登録不要・無料。";

const faqs = [
  {
    question: "つみたてNISA（積立NISA）とは違いますか？",
    answer:
      "2024年から制度が新しくなり、旧「つみたてNISA（積立NISA）」は「新NISA」に一本化されました。旧つみたてNISAの積立は新NISAの『つみたて投資枠』に引き継がれているため、毎月コツコツ積み立てる使い方は同じです。本ツールでそのままシミュレーションできます。",
  },
  {
    question: "新NISAの投資枠はいくらまでですか？",
    answer:
      "年間の投資枠は360万円（つみたて投資枠120万円＋成長投資枠240万円）、生涯の投資枠は合計1,800万円です。本ツールはこの年間・生涯の上限を反映し、枠を超える分は投資しないものとして計算します。",
  },
  {
    question: "一括投資と毎月の積立、どちらが有利ですか？",
    answer:
      "「初期投資額（一括）」の欄に入れれば一括分も合わせて試せます。理論上は早く多く投資するほど複利が長く効きますが、その分だけ高値づかみ（価格が高いときにまとめて買う）のリスクもあります。正解は一つではないため、両方を入力して比べてみてください。",
  },
  {
    question: "想定利回りは何％にすればよいですか？",
    answer:
      "全世界株（オルカン）やS&P500といった指数の長期実績は年5〜7％程度が目安とされますが、これは将来を保証する数字ではありません。年によっては大きく下がることもあります。保守的に見たいときは3％なども入れて、幅を持って確認するのがおすすめです。",
  },
  {
    question: "「NISAの非課税メリット」とは何ですか？",
    answer:
      "通常、投資の運用益には20.315％の税金がかかりますが、NISA口座内の運用益は非課税です。本ツールの「非課税メリット」は、もし課税口座で同じ運用益が出た場合に取られていたはずの税額（運用益 × 20.315％）の目安です。",
  },
  {
    question: "20年後・30年後はどうなりますか？",
    answer:
      "積立年数を変えると、各年の資産推移がグラフで確認できます。期間が長いほど複利の効果が大きくなり、評価額に占める運用益の割合が増えていきます。",
  },
];

export const metadata: Metadata = {
  title:
    "新NISA・つみたてNISA 積立シミュレーター｜毎月いくらで将来いくら？複利で無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function NisaPage() {
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
          想定利回りが一定で続くと仮定した概算です。実際の運用成績は変動し、元本割れの可能性もあります。特定の金融商品を推奨するものではありません。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <NisaTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">新NISAの複利と非課税の仕組み</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              積み立てたお金が運用で増え、その増えた分にもさらに利益がつく——これが
              <strong className="text-foreground">複利</strong>
              です。期間が長いほど雪だるま式に効いてきます。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">
                投資枠（年360万円・生涯1,800万円）
              </h3>
              <p className="mt-1">
                新NISAの年間投資枠は360万円（つみたて120万円＋成長240万円）、生涯では1,800万円までです。本ツールはこの上限を反映し、枠を超える積立は行わないものとして計算します。積立額が大きい場合は、生涯枠に到達する年も表示します。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                非課税のメリット
              </h3>
              <p className="mt-1">
                通常は運用益に20.315％の税金がかかりますが、NISA口座なら非課税です。長期・高利回りになるほど、この非課税メリットの金額は大きくなります。
              </p>
            </div>
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-foreground">
              ⚠️
              投資は元本が保証されません。想定利回りはあくまで仮定で、実際には値下がりする年もあります。余裕資金で、長期・分散を基本に、ご自身の判断で行ってください。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">複利</dt>
              <dd className="text-muted-foreground">
                運用で得た利益を再投資し、その利益にもさらに利益がつくこと。期間が長いほど効果が大きい。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">生涯投資枠</dt>
              <dd className="text-muted-foreground">
                新NISAで生涯に投資できる上限額（簿価で1,800万円）。年間は360万円まで。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">非課税</dt>
              <dd className="text-muted-foreground">
                通常20.315％かかる運用益への税金が、NISA口座ではかからないこと。
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

        <RelatedTools excludeId="nisa" />

        <ToolMeta
          updated="2026年8月10日"
          basis="想定利回りが一定で続くと仮定した複利の概算です。実際の運用成績は変動し、手数料・分配金・為替・税制改正等は考慮していません。元本割れの可能性があり、特定の金融商品を推奨するものではありません。投資はご自身の判断と責任で行ってください。"
        />
      </div>
    </Container>
  );
}
