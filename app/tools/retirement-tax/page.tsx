import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolMeta } from "@/components/common/ToolMeta";
import { RetirementTaxTool } from "@/components/tools/retirement-tax/RetirementTaxTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("retirement-tax")!;

const description =
  "退職金の額と勤続年数から、退職所得控除・所得税・住民税を計算し、手取り額の目安を算出。勤続年数が長いほど税負担が軽くなる仕組みもわかります。登録不要・無料。";

const faqs = [
  {
    question: "退職金には税金がかかりますか？",
    answer:
      "退職所得控除を超えた部分にかかります。勤続年数が長いほど控除が大きく、控除の範囲内であれば税金はかかりません。",
  },
  {
    question: "退職所得控除はいくらですか？",
    answer:
      "勤続20年までは1年あたり40万円（最低80万円）、20年を超える部分は1年あたり70万円です。例えば勤続30年なら、800万円＋70万円×10年＝1,500万円になります。",
  },
  {
    question: "なぜ退職金は税負担が軽いのですか？",
    answer:
      "退職金は長年の勤労に対する報償的な性格があるため、退職所得控除を引いたあと、さらに1/2にした「退職所得」に課税されます（勤続5年以下の役員等を除く）。",
  },
];

export const metadata: Metadata = {
  title:
    "退職金の税金・手取り計算シミュレーター｜退職所得控除から手取りを無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function RetirementTaxPage() {
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
          退職所得の分離課税による概算です。他の所得との合算や、住民税の細かな調整は反映していません。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <RetirementTaxTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">退職金の税金の計算方法</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              退職金は給与などとは分けて計算する
              <strong className="text-foreground">分離課税</strong>
              で、税負担が軽くなるよう配慮されています。手順は次のとおりです。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">
                ① 退職所得控除を引く
              </h3>
              <p className="mt-1">
                勤続20年までは1年あたり40万円（最低80万円）、20年超の部分は1年あたり70万円を、退職金から差し引きます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">② 1/2にする</h3>
              <p className="mt-1">
                控除後の金額をさらに1/2にした額が「退職所得」です。ここに所得税・住民税がかかります（勤続5年以下の役員等などは1/2の対象外）。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                ③ 所得税・住民税を計算
              </h3>
              <p className="mt-1">
                退職所得に、所得税（累進税率＋復興特別所得税）と住民税（約10%）がかかります。控除の範囲内なら税金はかかりません。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">退職所得控除</dt>
              <dd className="text-muted-foreground">
                退職金から差し引ける控除。勤続年数が長いほど大きくなる。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">退職所得</dt>
              <dd className="text-muted-foreground">
                （退職金 − 退職所得控除）× 1/2。この金額に課税される。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">分離課税</dt>
              <dd className="text-muted-foreground">
                他の所得と合算せず、単独で税額を計算する方式。退職所得はこれにあたる。
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

        <RelatedTools excludeId="retirement-tax" />

        <ToolMeta
          updated="2026年8月7日"
          taxBasis
          basis="退職所得の分離課税による概算です。同一年に複数の退職金がある場合や、住民税の細かな調整は反映していません。"
        />
      </div>
    </Container>
  );
}
