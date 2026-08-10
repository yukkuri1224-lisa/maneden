import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { guides } from "@/lib/guides";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";

const description =
  "税金・節税・資産形成のポイントを、まねでんの計算ツールで数字を確かめながら学べる解説記事。iDeCoと新NISAの使い分け、ふるさと納税の仕組み、会社員の手取りなど。";

export const metadata: Metadata = {
  title: "お金のガイド",
  description,
  alternates: { canonical: "/guides" },
  openGraph: {
    title: `お金のガイド | ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/guides`,
  },
};

export default function GuidesPage() {
  const [featured, ...rest] = guides;

  return (
    <>
      <div className="border-b bg-gradient-to-b from-primary/[0.08] via-primary/[0.03] to-background">
        <Container className="py-8 sm:py-10">
          <Breadcrumb
            items={[
              { name: "ホーム", href: "/" },
              { name: "ガイド", href: "/guides" },
            ]}
          />
          <div className="mt-5 flex items-center gap-2 text-primary">
            <BookOpen className="size-5" aria-hidden />
            <span className="text-xs font-semibold tracking-wide uppercase">
              お金のガイド
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            お金のガイド
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <JsonLd
          data={itemListJsonLd(
            guides.map((g) => ({
              name: g.title,
              url: `${siteConfig.url}${g.href}`,
            })),
          )}
        />

        {/* 注目記事（1本目を大きく） */}
        {featured && (
          <Link
            href={featured.href}
            className="group block overflow-hidden rounded-3xl border transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <div className="grid gap-0 sm:grid-cols-[1.1fr_1fr]">
              <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-indigo-500/15 via-sky-400/10 to-transparent p-8 sm:aspect-auto">
                <BookOpen
                  className="size-16 text-primary/70 transition-transform group-hover:scale-105"
                  aria-hidden
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-medium text-primary">
                  注目のガイド · 約{featured.readingMinutes}分
                </p>
                <h2 className="mt-2 text-xl leading-snug font-bold group-hover:text-primary sm:text-2xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {featured.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  読む
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {rest.map((g) => (
              <Link
                key={g.slug}
                href={g.href}
                className="group flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  <Clock className="size-3.5" aria-hidden />約{g.readingMinutes}
                  分
                </p>
                <h2 className="mt-2 leading-snug font-bold group-hover:text-primary">
                  {g.title}
                </h2>
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
        )}
      </Container>
    </>
  );
}
