import Link from "next/link";
import { ArrowRight, BookOpen, Gift, ShieldCheck } from "lucide-react";

import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { ToolCard } from "@/components/common/ToolCard";
import { buttonVariants } from "@/components/ui/button";
import { webApplicationJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById, tools } from "@/lib/tools-registry";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "プライバシー重視",
    body: "計算はすべてブラウザ内で完結。入力した収入・経費は外部に送信・保存しません。",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Gift,
    title: "登録不要・完全無料",
    body: "会員登録もログインも不要。開いてすぐ、何度でも無料で使えます。",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: BookOpen,
    title: "根拠と解説つき",
    body: "計算の内訳や用語解説を掲載。「なぜその金額？」まで納得して使えます。",
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
];

const heroStats = [
  { label: "手取り率", value: "62%" },
  { label: "LTV/CAC", value: "4.0倍" },
  { label: "実質利回り", value: "6.4%" },
];

export default function Home() {
  const featured = getToolById("freelance-tax");

  return (
    <>
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd
        data={webApplicationJsonLd({
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
        })}
      />

      {/* ヒーロー */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/70 via-background to-background dark:from-indigo-950/20" />
          <div className="hero-grid absolute inset-0" />
          <div className="absolute -top-32 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/25" />
        </div>

        <Container className="py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden />
            登録不要・入力はブラウザ内で完結
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            お金の「？」を、
            <br className="hidden sm:block" />
            その場で
            <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              「！」
            </span>
            に。
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            税金・経営・不動産——フリーランスの「いくら？」を、まとめて無料で。
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {featured && (
              <Link
                href={featured.href}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {featured.shortTitle}を使う
                <ArrowRight className="size-4" />
              </Link>
            )}
            <Link
              href="/tools"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              すべてのツール
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {heroStats.map((stat) => (
              <span
                key={stat.label}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1.5 text-xs backdrop-blur"
              >
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {stat.value}
                </span>
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* 特長 */}
      <section className="py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl",
                      feature.color,
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="mt-4 font-semibold text-foreground">
                    {feature.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ツール一覧 */}
      <section className="pb-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">ツール一覧</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                目的に合わせて選べる計算・シミュレーション
              </p>
            </div>
            <Link
              href="/tools"
              className="hidden text-sm font-medium text-primary hover:underline sm:inline"
            >
              すべて見る →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
