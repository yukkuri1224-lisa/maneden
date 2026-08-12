import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolMeta } from "@/components/common/ToolMeta";
import { InheritanceTaxTool } from "@/components/tools/inheritance-tax/InheritanceTaxTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("inheritance-tax")!;

const description =
  "相続税が、遺産総額と法定相続人（配偶者・子）からいくらかかるかを無料で計算。基礎控除、法定相続分による按分、配偶者の税額軽減まで反映して、相続税の総額と実際の負担の目安がわかります。登録不要。";

const faqs = [
  {
    question: "相続税はいくらからかかりますか？",
    answer:
      "遺産の総額が「基礎控除」を超えると相続税がかかります。基礎控除は「3,000万円 ＋ 600万円 × 法定相続人の数」です。例えば法定相続人が3人なら4,800万円までは非課税です。ただし配偶者の税額軽減などの特例で税額が0になる場合でも、特例を使うには申告が必要です。",
  },
  {
    question: "相続税の計算方法は？",
    answer:
      "①遺産総額から基礎控除を引いて課税遺産総額を出す ②それを法定相続分で按分した各人の取得額に速算表の税率をかけて合計する（＝相続税の総額）③実際に取得した割合で各人に配分する、という順で計算します。本ツールは①〜②を自動で計算します。",
  },
  {
    question: "配偶者がいると相続税は安くなりますか？",
    answer:
      "はい。「配偶者の税額軽減」により、配偶者が取得した遺産は、法定相続分か1億6,000万円のいずれか多い方まで相続税がかかりません。本ツールでは、配偶者が法定相続分を相続した場合の負担額も表示します。",
  },
  {
    question: "土地や家がある場合はどう計算しますか？",
    answer:
      "土地は路線価方式など、建物は固定資産税評価額で評価し、その評価額を遺産総額に含めて計算します。自宅の土地などには評価額を大きく減らせる「小規模宅地等の特例」もあります。評価は複雑なので、正確な金額は税理士にご確認ください。",
  },
  {
    question: "自分で相続税を計算できますか？",
    answer:
      "基礎控除内かどうかや、おおよその税額は本ツールで確認できます。ただし、生命保険・退職金の非課税枠、各種特例、財産の評価などは複雑なため、実際の申告は税理士に相談することをおすすめします。",
  },
];

export const metadata: Metadata = {
  title: "相続税の計算シミュレーター｜いくらかかる？基礎控除・早見表で無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function InheritanceTaxPage() {
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
          配偶者・子が相続人となる場合の概算です。父母・兄弟姉妹が相続人となるケース、生命保険等の非課税枠、2割加算、小規模宅地等の特例、財産の評価は考慮していません。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <InheritanceTaxTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">相続税の計算方法</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              相続税は、
              <strong className="text-foreground">
                遺産総額から基礎控除を引いた金額
              </strong>
              に対してかかります。基礎控除は「3,000万円 ＋ 600万円 ×
              法定相続人の数」です。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">
                法定相続分で按分して計算
              </h3>
              <p className="mt-1">
                課税遺産総額を、実際の分け方ではなく
                <strong className="text-foreground">法定相続分</strong>
                でいったん按分し、各人の取得額に速算表の税率をかけて合計します。これが「相続税の総額」で、その後に実際に取得した割合で各相続人に配分されます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                配偶者の税額軽減
              </h3>
              <p className="mt-1">
                配偶者が取得した遺産は、法定相続分または1億6,000万円のいずれか多い方まで相続税がかかりません。そのため配偶者がいると、家族全体の負担は大きく下がります。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">基礎控除</dt>
              <dd className="text-muted-foreground">
                相続税がかからない枠。3,000万円 ＋ 600万円 ×
                法定相続人の数で計算する。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">法定相続分</dt>
              <dd className="text-muted-foreground">
                民法が定める相続割合。配偶者と子なら配偶者1/2・子で1/2など。相続税の総額の計算に使う。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">配偶者の税額軽減</dt>
              <dd className="text-muted-foreground">
                配偶者が取得した遺産のうち、法定相続分か1.6億円まで相続税を非課税にする制度。
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

        <RelatedTools excludeId="inheritance-tax" />

        <ToolMeta
          toolId="inheritance-tax"
          updated="2026年8月10日"
          taxBasis
          basis="配偶者・子が相続人となる場合の概算です。父母・兄弟姉妹が相続人のケース、生命保険・退職金の非課税枠、2割加算、小規模宅地等の特例、財産の評価は考慮していません。実際の申告は税理士にご相談ください。"
        />
      </div>
    </Container>
  );
}
