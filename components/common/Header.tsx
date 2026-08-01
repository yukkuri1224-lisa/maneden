import Link from "next/link";
import { Calculator } from "lucide-react";

import { Container } from "@/components/common/Container";
import { HeaderNav } from "@/components/common/HeaderNav";
import { type MobileNavItem } from "@/components/common/MobileNav";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { liveTools } from "@/lib/tools-registry";
import { siteConfig } from "@/lib/site-config";

const navItems: MobileNavItem[] = [
  { href: "/tools", label: "ツール一覧" },
  ...liveTools.map((tool) => ({ href: tool.href, label: tool.shortTitle })),
];

/**
 * 全ページ共通ヘッダー。ロゴ・ナビ（現在地ハイライト）・テーマ切替。
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Calculator className="size-5 text-primary" aria-hidden />
          <span>{siteConfig.name}</span>
        </Link>

        <div className="flex items-center gap-1">
          <HeaderNav items={navItems} />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
