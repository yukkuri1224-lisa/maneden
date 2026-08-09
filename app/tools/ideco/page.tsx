import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { RelatedTools } from "@/components/common/RelatedTools";
import { ToolMeta } from "@/components/common/ToolMeta";
import { IdecoTool } from "@/components/tools/ideco/IdecoTool";
import { faqJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById } from "@/lib/tools-registry";

const tool = getToolById("ideco")!;

const description =
  "iDeCo（イデコ）の掛金でいくら節税できるかを、年収と毎月の掛金から概算。所得税・住民税の年間軽減額と、60歳までの累計節税額がわかります。会社員・公務員向け、登録不要・無料。";

const faqs = [
  {
    question: "iDeCoで節税できるのはなぜですか？",
    answer:
      "掛金が全額「小規模企業共済等掛金控除」として所得控除になり、課税所得がその分下がるためです。結果として所得税と住民税が軽くなります。運用益が非課税になるメリットもありますが、本ツールでは掛金の所得控除による節税額のみを概算します。",
  },
  {
    question: "誰でも同じ金額だけ節税できますか？",
    answer:
      "いいえ。所得税は累進課税のため、年収（正確には課税所得）が高い人ほど1円あたりの節税効果が大きくなります。本ツールは年収から所得税率を判定して計算します。住民税ぶんは概ね一律10%です。",
  },
  {
    question: "掛金の上限はいくらですか？",
    answer:
      "加入区分で変わります。会社員（企業年金なし）は月2.3万円、企業型DC加入者は月2.0万円、確定給付企業年金（DB）併用や公務員は月1.2万円です。本ツールは会社員・公務員（給与所得者）向けです。",
  },
  {
    question: "注意点はありますか？",
    answer:
      "iDeCoの資産は原則60歳まで引き出せません。また口座管理手数料がかかります。本ツールの節税額は概算で、配偶者控除・扶養控除などは考慮していません。実際の控除額は年末調整や確定申告で確定します。",
  },
];

export const metadata: Metadata = {
  title: "iDeCo（イデコ）節税シミュレーター｜掛金の節税効果はいくらか無料計算",
  description,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.title,
    description,
    url: `${siteConfig.url}${tool.href}`,
  },
};

export default function IdecoPage() {
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
          会社員・公務員（給与所得者）向けの概算です。配偶者控除・扶養控除等は考慮していません。運用益や受取時の課税、口座管理手数料は含みません。
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
          }
        >
          <IdecoTool />
        </Suspense>
      </div>

      <AdSlot className="mt-10" />

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold">iDeCoで節税できる仕組み</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              iDeCoの掛金は
              <strong className="text-foreground">
                全額が所得控除（小規模企業共済等掛金控除）
              </strong>
              になります。課税所得が掛金の分だけ下がるため、その分の所得税と住民税がかからなくなる＝節税になります。
            </p>
            <div>
              <h3 className="font-semibold text-foreground">所得税の軽減</h3>
              <p className="mt-1">
                所得税は累進課税で、課税所得が高いほど税率も高くなります（5%〜45%）。そのため
                <strong className="text-foreground">
                  年収が高い人ほど、同じ掛金でも節税額は大きく
                </strong>
                なります。本ツールは年収から税率を判定し、復興特別所得税（2.1%）も含めて計算します。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">住民税の軽減</h3>
              <p className="mt-1">
                住民税の所得割は概ね一律10%です。掛金の10%分が住民税から軽くなります（＝掛金
                × 10%）。
              </p>
            </div>
            <p>
              つまり節税額は「掛金 ×（所得税率 ＋
              約10%）」が目安です。手取り全体は
              <a
                href="/tools/salary-take-home"
                className="text-primary underline"
              >
                会社員の手取り計算
              </a>
              でも確認できます。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">用語集</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">小規模企業共済等掛金控除</dt>
              <dd className="text-muted-foreground">
                iDeCoやiDeCo＋、小規模企業共済などの掛金を全額差し引ける所得控除。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">所得控除</dt>
              <dd className="text-muted-foreground">
                税金の計算前に所得から差し引ける金額。控除が増えるほど課税所得が下がり税額も減る。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">限界税率</dt>
              <dd className="text-muted-foreground">
                所得が1円増えたときにかかる税率。控除で減る税額はこの税率で決まる。
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

        <RelatedTools excludeId="ideco" />

        <ToolMeta
          updated="2026年8月9日"
          taxBasis
          basis="掛金の所得控除による節税額のみの概算です。会社員・公務員（給与所得者）向けで、配偶者控除・扶養控除等は考慮していません。運用益や受取時の課税、口座管理手数料は含みません。"
        />
      </div>
    </Container>
  );
}
