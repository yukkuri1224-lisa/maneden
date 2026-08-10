import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { guides } from "@/lib/guides";

/** 記事下部に表示する「ほかのガイド」カード。 */
export function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const others = guides.filter((g) => g.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section className="mt-16 border-t pt-10">
      <h2 className="text-xl font-bold">ほかのガイドを読む</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {others.map((g) => (
          <Link
            key={g.slug}
            href={g.href}
            className="group flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
          >
            <p className="text-xs font-medium text-primary">
              お金のガイド · 約{g.readingMinutes}分
            </p>
            <h3 className="mt-2 leading-snug font-bold group-hover:text-primary">
              {g.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {g.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              読む
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
