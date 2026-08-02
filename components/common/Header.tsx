import Link from "next/link";
import { JapaneseYen } from "lucide-react";

import { Container } from "@/components/common/Container";
import { HeaderNav } from "@/components/common/HeaderNav";
import { type MobileNavItem } from "@/components/common/MobileNav";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { siteConfig } from "@/lib/site-config";

const navItems: MobileNavItem[] = [{ href: "/tools", label: "ツール一覧" }];

/**
 * 全ページ共通ヘッダー。グラス調・ロゴマーク・ナビ（現在地ハイライト）・テーマ切替。
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-sm shadow-indigo-500/30">
            <JapaneseYen className="size-4" aria-hidden />
          </span>
          <span className="text-base tracking-tight">{siteConfig.name}</span>
        </Link>

        <div className="flex items-center gap-1">
          <HeaderNav items={navItems} />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
