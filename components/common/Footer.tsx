import Link from "next/link";

import { Container } from "@/components/common/Container";
import { tools } from "@/lib/tools-registry";
import { siteConfig } from "@/lib/site-config";

const siteLinks = [
  { href: "/about", label: "運営者情報・免責事項" },
  { href: "/privacy-policy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/contact", label: "お問い合わせ" },
];

/**
 * 全ページ共通フッター。全ツール一覧・サイト情報・免責事項を常設表示する。
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold">{siteConfig.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">ツール</p>
            <ul className="mt-2 space-y-1 text-sm">
              {tools.map((tool) => (
                <li key={tool.id}>
                  {tool.status === "live" ? (
                    <Link
                      href={tool.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {tool.shortTitle}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground/60">
                      {tool.shortTitle}（準備中）
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium">サイト情報</p>
            <ul className="mt-2 space-y-1 text-sm">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          本サイトの計算結果はすべて概算であり、正確な税額・金額を保証するものではありません。実際の申告・手続きは税理士等の専門家にご相談ください。
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </Container>
    </footer>
  );
}
