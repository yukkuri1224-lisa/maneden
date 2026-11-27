import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const DEFAULT_OG_IMAGE = "/opengraph-image";

export interface PageMetadataParams {
  /** <title> 用（テンプレートで「 | まねでん」が付く） */
  title: string;
  description: string;
  /** "/" 始まり。canonical と og:url に使う */
  path: string;
  /** 省略時は title */
  ogTitle?: string;
  type?: "website" | "article";
  /** article のとき ISO 日付 */
  publishedTime?: string;
  modifiedTime?: string;
  /** OGP 画像のパス。省略時は /tools/<id>・/guides/<slug> なら同階層の opengraph-image、それ以外は共通画像 */
  image?: string;
}

/** ページ固有の opengraph-image（file convention）が存在するパスか */
const SEGMENT_OG_PATH = /^\/(?:tools|guides)\/[^/]+$/;

function resolveOgImage(p: PageMetadataParams): string {
  if (p.image) return p.image;
  return SEGMENT_OG_PATH.test(p.path)
    ? `${p.path}/opengraph-image`
    : DEFAULT_OG_IMAGE;
}

/**
 * ページ用メタデータを組み立てる。
 * Next.js は openGraph を指定したページでルートの openGraph を丸ごと置換するため、
 * og:image / site_name / locale / url を各ページで必ず補う。
 */
export function pageMetadata(p: PageMetadataParams): Metadata {
  const ogTitle = p.ogTitle ?? p.title;
  const type = p.type ?? "website";
  const image = resolveOgImage(p);
  const url = siteConfig.url + (p.path === "/" ? "" : p.path);

  const openGraph = {
    type,
    locale: "ja_JP",
    siteName: siteConfig.name,
    url,
    title: ogTitle,
    description: p.description,
    images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    ...(p.publishedTime ? { publishedTime: p.publishedTime } : {}),
    ...(p.modifiedTime ? { modifiedTime: p.modifiedTime } : {}),
  } as NonNullable<Metadata["openGraph"]>;

  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: p.description,
      images: [image],
    },
  };
}
