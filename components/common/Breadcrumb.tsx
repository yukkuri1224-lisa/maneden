import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/common/JsonLd";

export interface Crumb {
  name: string;
  /** サイト内パス（例: "/tools"） */
  href: string;
}

/**
 * パンくずリスト。視覚表示と BreadcrumbList(JSON-LD) を同期して出力する。
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const jsonLd = breadcrumbJsonLd(
    items.map((crumb) => ({
      name: crumb.name,
      url: `${siteConfig.url}${crumb.href}`,
    })),
  );

  return (
    <nav aria-label="パンくずリスト">
      <JsonLd data={jsonLd} />
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-foreground"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
