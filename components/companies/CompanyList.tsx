"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Company } from "@/lib/companies/types";
import { formatManYen } from "@/lib/format";

const PER_PAGE = 30;

export function CompanyList({
  companies,
  filterable = false,
}: {
  companies: Company[];
  /** 業種フィルタ＋社名検索の UI を表示するか（一覧トップ用） */
  filterable?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");

  // 業種の選択肢（社数の多い順）
  const industryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of companies)
      counts.set(c.industry, (counts.get(c.industry) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [companies]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return companies.filter(
      (c) =>
        (industry === "" || c.industry === industry) &&
        (q === "" || c.name.includes(q)),
    );
  }, [companies, query, industry]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  // フィルタで件数が減ってもページ番号が範囲外にならないようクランプする
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const items = filtered.slice(start, start + PER_PAGE);

  return (
    <div>
      {filterable && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="会社名で検索"
              aria-label="会社名で検索"
              className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </div>
          <select
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              setPage(1);
            }}
            aria-label="業種で絞り込む"
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-64"
          >
            <option value="">すべての業種（{companies.length}社）</option>
            {industryOptions.map(([name, count]) => (
              <option key={name} value={name}>
                {name}（{count}）
              </option>
            ))}
          </select>
        </div>
      )}

      {filterable && (
        <p className="mb-4 text-sm text-muted-foreground">
          {filtered.length.toLocaleString("ja-JP")}社を表示
          {industry ? `（${industry}）` : ""}
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          条件に合う企業が見つかりませんでした。
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((company, index) => (
            <Link
              key={company.slug}
              href={`/companies/${company.slug}`}
              className="group block h-full"
            >
              <div className="relative flex h-full flex-col rounded-xl border p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
                <span className="absolute top-4 right-4 text-xs font-semibold text-muted-foreground tabular-nums">
                  #{start + index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {company.industry}
                  </span>
                </div>
                <h2 className="mt-3 pr-6 font-semibold">{company.name}</h2>
                <p className="text-gradient mt-2 text-2xl font-bold tabular-nums">
                  {formatManYen(company.averageSalary, 0)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  詳しく見る
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
          >
            前へ
          </Button>
          <span className="px-2 text-sm text-muted-foreground tabular-nums">
            {safePage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
}
