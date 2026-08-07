import Link from "next/link";
import { JapaneseYen } from "lucide-react";

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
 * 全ページ共通フッター。ブランド・ツール・サイト情報・連絡先・免責。
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t bg-muted/30">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-bold">
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
                <JapaneseYen className="size-4" aria-hidden />
              </span>
              <span>{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">ツール</p>
            <ul className="mt-4 space-y-2.5 text-sm">
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

            <p className="mt-6 text-sm font-semibold">データ</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/companies"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  企業の平均年収ランキング
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">サイト情報</p>
            <ul className="mt-4 space-y-2.5 text-sm">
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

          <div>
            <p className="text-sm font-semibold">お問い合わせ</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            本サイトの計算結果はすべて概算であり、正確な税額・金額を保証するものではありません。実際の申告・手続きは税理士等の専門家にご相談ください。
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
