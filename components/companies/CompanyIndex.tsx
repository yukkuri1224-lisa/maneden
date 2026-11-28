import Link from "next/link";

import type { CompanyListItem } from "@/lib/companies/types";
import { formatManYen } from "@/lib/format";

/**
 * 全社リンク一覧（サーバーコンポーネント）。
 * CompanyList はクライアント側でページ送りするため、静的 HTML には先頭30社しか
 * 含まれない。クローラが全企業ページへ辿れるよう、全社を通常リンクで出力する。
 */
export function CompanyIndex({
  companies,
  heading,
}: {
  companies: CompanyListItem[];
  heading: string;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold">{heading}</h2>
      <ul className="mt-4 gap-x-6 text-sm sm:columns-2 lg:columns-3">
        {companies.map((c) => (
          <li key={c.slug} className="break-inside-avoid py-1">
            <Link
              href={`/companies/${c.slug}`}
              className="text-muted-foreground hover:text-primary hover:underline"
            >
              {c.name}（{formatManYen(c.averageSalary, 0)}）
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
