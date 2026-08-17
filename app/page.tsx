import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Gift,
  Lock,
  MousePointerClick,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { ToolCard } from "@/components/common/ToolCard";
import { buttonVariants } from "@/components/ui/button";
import {
  faqJsonLd,
  itemListJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById, toolCategories, tools } from "@/lib/tools-registry";
import { guides } from "@/lib/guides";
import { companies } from "@/lib/companies/data";
import { formatManYen } from "@/lib/format";
import { cn } from "@/lib/utils";

// トップは最重要 URL。canonical と、SERPスニペットを使い切る説明文を明示する。
export const metadata: Metadata = {
  description:
    "年収の手取り・ふるさと納税の上限・退職金や贈与税まで、税金とお金の計算が登録不要・完全無料で完結。会社員もフリーランスも使えるシミュレーター14種と、上場企業の平均年収データを収録。",
  alternates: { canonical: "/" },
};

const trustPoints = [
  { icon: Gift, label: "完全無料" },
  { icon: Lock, label: "登録不要" },
  { icon: ShieldCheck, label: "データ送信なし" },
  { icon: Sparkles, label: `${tools.length}種類のツール` },
];

const features = [
  {
    icon: ShieldCheck,
    title: "プライバシー最優先",
    body: "計算はすべてブラウザ内で完結。入力した収入や経費は、どこにも送信・保存されません。",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: Gift,
    title: "登録不要・完全無料",
    body: "会員登録もログインも不要。開いた瞬間から、何度でも無料で使えます。",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: BookOpen,
    title: "根拠と解説つき",
    body: "計算の内訳・用語・よくある質問まで掲載。「なぜその金額？」に答えます。",
    color: "from-sky-500 to-cyan-500",
  },
];

const steps = [
  {
    icon: MousePointerClick,
    title: "入力する",
    body: "スライダーや数値を動かすだけ。むずかしい設定は要りません。",
  },
  {
    icon: Sparkles,
    title: "その場で計算",
    body: "入力と同時に、結果とグラフがリアルタイムで更新されます。",
  },
  {
    icon: Share2,
    title: "保存・共有",
    body: "結果はURLに保存。そのままリンクやXでシェアできます。",
  },
];

const faqs = [
  {
    question: "まねでんは本当に無料ですか？",
    answer:
      "はい。すべてのツールが登録不要・無料です。開いてすぐ使え、利用回数の制限もありません。",
  },
  {
    question: "入力した金額は保存されますか？",
    answer:
      "いいえ。計算はすべてお使いのブラウザ内で行われ、収入や経費などの情報が外部のサーバーに送信・保存されることはありません。",
  },
  {
    question: "どんな計算ができますか？",
    answer:
      "フリーランス・会社員の手取りや税金、ふるさと納税の上限、iDeCoの節税や新NISAの積立、退職金やボーナスの手取り、贈与税・相続税、住宅ローンや不動産の利回りまで、幅広いお金の計算ができます。iDeCoと新NISAの使い分けなどのガイド記事も掲載しています。",
  },
];

const heroLegend = [
  { label: "手取り", value: "62%", color: "#4f46e5" },
  { label: "税金", value: "16%", color: "#38bdf8" },
  { label: "社会保険", value: "22%", color: "#94a3b8" },
];

export default function Home() {
  const featured = getToolById("freelance-tax");
  const topCompanies = companies.slice(0, 6);

  return (
    <>
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={webApplicationJsonLd({
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={itemListJsonLd(
          tools.map((tool) => ({
            name: tool.title,
            url: `${siteConfig.url}${tool.href}`,
          })),
        )}
      />

      {/* ===== ヒーロー ===== */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="brand-mesh pointer-events-none absolute inset-0 -z-10"
        />
        <div
          aria-hidden
          className="hero-grid pointer-events-none absolute inset-0 -z-10"
        />

        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-10">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              登録不要・完全無料・ブラウザ内で完結
            </span>

            <h1 className="mt-6 text-4xl leading-[1.15] font-black tracking-tight sm:text-5xl lg:text-6xl">
              税金や手取りの計算を、
              <br />
              <span className="text-gradient">まとめて無料で。</span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg lg:mx-0">
              フリーランス・個人事業主・会社員向けの計算ツールをそろえました。確定申告や手取り、ふるさと納税、不動産まで、登録なしでその場で試せます。
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {featured && (
                <Link
                  href={featured.href}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "shadow-lg shadow-indigo-500/25",
                  )}
                >
                  {featured.shortTitle}を使う
                  <ArrowRight className="size-4" />
                </Link>
              )}
              <Link
                href="/tools"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                すべてのツール
              </Link>
            </div>
          </div>

          {/* プロダクト・プレビュー */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-indigo-500/20 via-sky-500/10 to-transparent blur-2xl"
            />
            <div className="rounded-2xl border bg-card/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  年間手取り額（概算）
                </p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  例
                </span>
              </div>
              <p className="text-gradient mt-1 text-4xl font-black tracking-tight tabular-nums">
                ¥3,069,100
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                手取り率{" "}
                <span className="font-semibold text-foreground">61.4%</span> ・
                月あたり約{" "}
                <span className="font-semibold text-foreground">25.6万円</span>
              </p>

              <div className="mt-6 flex items-center gap-5">
                <div
                  className="grid size-24 shrink-0 place-items-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#4f46e5 0 62%, #38bdf8 62% 78%, #94a3b8 78% 100%)",
                  }}
                  aria-hidden
                >
                  <div className="size-14 rounded-full bg-card" />
                </div>
                <ul className="flex-1 space-y-2 text-xs">
                  {heroLegend.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block size-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                          aria-hidden
                        />
                        {item.label}
                      </span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>

        {/* 信頼バー */}
        <div className="border-t bg-background/50 backdrop-blur">
          <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <span
                  key={point.label}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <Icon className="size-4 text-primary" aria-hidden />
                  {point.label}
                </span>
              );
            })}
          </Container>
        </div>
      </section>

      {/* ===== ツール ===== */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {tools.length}種類の計算ツール
            </h2>
            <p className="mt-3 text-muted-foreground">
              確定申告の手取りから、ふるさと納税の上限、補助金、不動産の利回りまで。用途に合わせて選べます。
            </p>
          </div>
          <div className="mt-12 space-y-12">
            {toolCategories.map((category) => {
              const categoryTools = tools.filter(
                (tool) => tool.category === category.id,
              );
              if (categoryTools.length === 0) return null;
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {categoryTools.length}ツール
                    </span>
                    <span className="h-px flex-1 bg-border" aria-hidden />
                  </div>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ===== お金のガイド ===== */}
      <section className="border-t bg-muted/30 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              お金のガイド
            </h2>
            <p className="mt-3 text-muted-foreground">
              税金・節税・資産形成のポイントを、まねでんの計算ツールで数字を確かめながら学べる解説記事です。
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={g.href}
                className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  <BookOpen className="size-3.5" aria-hidden />
                  お金のガイド · 約{g.readingMinutes}分
                </p>
                <h3 className="mt-2 leading-snug font-bold group-hover:text-primary">
                  {g.shortTitle}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {g.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  読む
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/guides"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              すべてのガイドを見る
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ===== 企業の平均年収 ===== */}
      <section className="border-t py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              企業の平均年収を調べる
            </h2>
            <p className="mt-3 text-muted-foreground">
              上場企業{companies.length.toLocaleString("ja-JP")}
              社の平均年収を、有価証券報告書のデータから掲載しています。気になる企業の手取り額も、その場で計算できます。
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topCompanies.map((company) => (
              <Link
                key={company.slug}
                href={`/companies/${company.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{company.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {company.industry}
                  </p>
                </div>
                <p className="text-gradient shrink-0 font-bold tabular-nums">
                  {formatManYen(company.averageSalary, 0)}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/companies"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              企業の年収ランキングを見る
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ===== 選ばれる理由 ===== */}
      <section className="border-y bg-muted/30 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              安心して使える理由
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border bg-card p-7"
                >
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                      feature.color,
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ===== 使い方 ===== */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              使い方は、3ステップ
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative overflow-hidden rounded-2xl border bg-card p-7"
                >
                  <span className="absolute top-5 right-6 text-5xl font-black text-muted/70">
                    {index + 1}
                  </span>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-t bg-muted/30 py-20">
        <Container className="max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              よくあるご質問
            </h2>
          </div>
          <dl className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border bg-card p-6">
                <dt className="font-semibold">{faq.question}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 px-8 py-16 text-center text-white shadow-2xl shadow-indigo-500/25">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              まずは手取りの計算から
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/85">
              登録不要・無料で使えます。手取り＆税金シミュレーターから試してみてください。
            </p>
            {featured && (
              <div className="mt-8">
                <Link
                  href={featured.href}
                  className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-white px-6 text-sm font-semibold text-indigo-700 shadow-lg transition-transform hover:scale-105"
                >
                  無料でシミュレーション
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
