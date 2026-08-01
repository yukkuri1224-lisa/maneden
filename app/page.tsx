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
  },
  {
    icon: Gift,
    title: "登録不要・完全無料",
    body: "会員登録もログインも不要。開いてすぐ、何度でも無料で使えます。",
  },
  {
    icon: BookOpen,
    title: "根拠と解説つき",
    body: "計算の内訳や用語解説を掲載。「なぜその金額？」まで納得して使えます。",
  },
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
      <section className="border-b bg-gradient-to-b from-indigo-50 to-background dark:from-indigo-950/30">
        <Container className="py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden />
            登録不要・入力はブラウザ内で完結
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            ビジネスの
            <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              「いくら？」
            </span>
            を、その場で。
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {siteConfig.description}
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
        </Container>
      </section>

      {/* 特長 */}
      <section className="py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-xl border p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="mt-3 font-semibold text-foreground">
                    {feature.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ツール一覧 */}
      <section className="pb-16">
        <Container>
          <h2 className="text-xl font-semibold">ツール一覧</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            目的に合わせて選べる計算・シミュレーションツール
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
