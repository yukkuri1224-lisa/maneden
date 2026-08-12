import type { MetadataRoute } from "next";

import { INDUSTRY_SLUGS, NO_HUB_INDUSTRIES } from "@/lib/companies/industries";
import { guides } from "@/lib/guides";
import { siteConfig } from "@/lib/site-config";
import { tools } from "@/lib/tools-registry";

/**
 * 動的サイトマップ生成。静的ページ + 全ツール + 業種ハブを対象にする。
 *
 * 個別の企業ページ（/companies/[slug]・約1,555枚）は、あえてサイトマップに載せない。
 * テンプレート的で薄いため Google に「Crawled - currently not indexed」と判断されやすく、
 * 大量に送信するとクロール予算とサイト品質評価を薄めてしまうため。
 * これらは noindex ではなく（index 許可のまま）、企業一覧・業種ハブからの内部リンクで
 * 引き続きクロール可能で、価値があると判断されたページは自然にインデックスされる。
 * 年収データはより内容の厚い業種ハブ（33枚）と一覧に集約して露出させる。
 *
 * lastModified はビルド時刻ではなく「実際の更新日」を使う（毎回のビルドで無意味に変動させない）。
 * データやコンテンツを更新したら、下記の日付定数を更新すること。
 */
const SITE_UPDATED = new Date("2026-08-10"); // トップ・ツール・法務・サイトマップ構成など
const DATA_UPDATED = new Date("2026-08-06"); // 企業年収データ（一覧・業種ハブ）

type Entry = { path: string; priority: number; lastModified: Date };

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: Entry[] = [
    { path: "/", priority: 1.0, lastModified: SITE_UPDATED },
    { path: "/tools", priority: 0.9, lastModified: SITE_UPDATED },
    { path: "/companies", priority: 0.8, lastModified: DATA_UPDATED },
    { path: "/about", priority: 0.3, lastModified: SITE_UPDATED },
    { path: "/disclaimer", priority: 0.2, lastModified: SITE_UPDATED },
    { path: "/privacy-policy", priority: 0.2, lastModified: SITE_UPDATED },
    { path: "/terms", priority: 0.2, lastModified: SITE_UPDATED },
    { path: "/contact", priority: 0.2, lastModified: SITE_UPDATED },
  ];

  const toolPages: Entry[] = tools.map((tool) => ({
    path: tool.href,
    priority: tool.sitemapPriority,
    lastModified: SITE_UPDATED,
  }));

  const industryPages: Entry[] = Object.entries(INDUSTRY_SLUGS)
    .filter(([name]) => !NO_HUB_INDUSTRIES.has(name))
    .map(([, slug]) => ({
      path: `/companies/industry/${slug}`,
      priority: 0.7,
      lastModified: DATA_UPDATED,
    }));

  const guidePages: Entry[] = [
    { path: "/guides", priority: 0.6, lastModified: SITE_UPDATED },
    ...guides.map((g) => ({
      path: g.href,
      priority: 0.7,
      lastModified: new Date(g.updatedISO),
    })),
  ];

  return [...staticPages, ...toolPages, ...industryPages, ...guidePages].map(
    (page) => ({
      url: `${siteConfig.url}${page.path}`,
      lastModified: page.lastModified,
      changeFrequency: "weekly",
      priority: page.priority,
    }),
  );
}
