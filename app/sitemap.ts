import type { MetadataRoute } from "next";

import { companies } from "@/lib/companies/data";
import { INDUSTRY_SLUGS, NO_HUB_INDUSTRIES } from "@/lib/companies/industries";
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

  const industryPages = Object.entries(INDUSTRY_SLUGS)
    .filter(([name]) => !NO_HUB_INDUSTRIES.has(name))
    .map(([, slug]) => ({
      path: `/companies/industry/${slug}`,
      priority: 0.7,
    }));

  const companyPages = companies.map((company) => ({
    path: `/companies/${company.slug}`,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...industryPages, ...companyPages].map(
    (page) => ({
      url: `${siteConfig.url}${page.path}`,
      lastModified,
      changeFrequency: "weekly",
      priority: page.priority,
    }),
  );
}
