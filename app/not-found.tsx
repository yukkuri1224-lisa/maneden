import Link from "next/link";

import { Container } from "@/components/common/Container";
import { liveTools } from "@/lib/tools-registry";

/**
 * カスタム 404 ページ。
 * 存在しない URL でも適切に 404 を返しつつ、主要ツール・一覧への導線を示して離脱を防ぐ。
 */
export default function NotFound() {
  const picks = liveTools.slice(0, 6);

  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          ページが見つかりませんでした
        </h1>
        <p className="mt-4 text-muted-foreground">
          お探しのページは移動または削除された可能性があります。URL
          をご確認いただくか、以下からお進みください。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            トップページへ
          </Link>
          <Link
            href="/tools"
            className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            計算ツール一覧
          </Link>
          <Link
            href="/companies"
            className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            企業の平均年収
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-center text-sm font-semibold text-muted-foreground">
          よく使われる計算ツール
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((tool) => (
            <li key={tool.id}>
              <Link
                href={tool.href}
                className="block rounded-xl border p-4 transition-colors hover:bg-muted"
              >
                <span className="text-sm font-semibold">{tool.shortTitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
