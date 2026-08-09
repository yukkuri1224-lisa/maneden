import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { guides } from "@/lib/guides";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";

const description =
  "税金・節税・資産形成のポイントを、まねでんの計算ツールで数字を確かめながら学べる解説記事。iDeCoと新NISAの使い分けなど。";

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
  return (
    <Container className="py-8">
      <JsonLd
        data={itemListJsonLd(
          guides.map((g) => ({
            name: g.title,
            url: `${siteConfig.url}${g.href}`,
          })),
        )}
      />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ガイド", href: "/guides" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold sm:text-3xl">お金のガイド</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          税金・節税・資産形成のポイントを、まねでんの計算ツールで数字を確かめながら学べる解説記事です。
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={g.href}
            className="group rounded-2xl border p-6 transition-colors hover:border-primary/50 hover:bg-muted/40"
          >
            <h2 className="font-bold group-hover:text-primary">{g.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {g.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              読む
              <ArrowRight className="size-4" />
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
