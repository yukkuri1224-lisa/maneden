import type { MetadataRoute } from "next";

import { companies } from "@/lib/companies/data";
import { siteConfig } from "@/lib/site-config";
import { tools } from "@/lib/tools-registry";

/**
 * 動的サイトマップ生成。静的ページ + 全ツール + 企業ページを対象にする。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/tools", priority: 0.9 },
    { path: "/companies", priority: 0.8 },
    { path: "/about", priority: 0.3 },
    { path: "/privacy-policy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/contact", priority: 0.2 },
  ];

  const toolPages = tools.map((tool) => ({
    path: tool.href,
    priority: tool.sitemapPriority,
  }));

  const companyPages = companies.map((company) => ({
    path: `/companies/${company.slug}`,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...companyPages].map((page) => ({
    url: `${siteConfig.url}${page.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: page.priority,
  }));
}
