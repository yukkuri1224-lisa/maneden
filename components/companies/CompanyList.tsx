"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Company } from "@/lib/companies/types";
import { formatManYen } from "@/lib/format";
import { cn } from "@/lib/utils";

const PER_PAGE = 30;

export function CompanyList({ companies }: { companies: Company[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(companies.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const items = companies.slice(start, start + PER_PAGE);

  return (
    <div>
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

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            前へ
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "size-9 rounded-md text-sm tabular-nums transition-colors",
                p === page
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {p}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
}
