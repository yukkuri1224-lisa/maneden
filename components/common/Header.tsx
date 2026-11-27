import Link from "next/link";
import { JapaneseYen } from "lucide-react";

import { Container } from "@/components/common/Container";
import { HeaderNav } from "@/components/common/HeaderNav";
import { type MobileNavItem } from "@/components/common/MobileNav";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { siteConfig } from "@/lib/site-config";

const navItems: MobileNavItem[] = [
  { href: "/tools", label: "ツール一覧" },
  { href: "/guides", label: "ガイド" },
  { href: "/companies", label: "企業の年収" },
];

/**
 * 全ページ共通ヘッダー。ロゴマーク・ナビ（現在地ハイライト）・テーマ切替。
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <JapaneseYen className="size-4" aria-hidden />
          </span>
          <span className="font-heading text-lg">{siteConfig.name}</span>
        </Link>

        <div className="flex items-center gap-1">
          <HeaderNav items={navItems} />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
