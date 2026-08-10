import type { ReactNode } from "react";
import { CalendarDays, Clock, PenLine } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { ShareBar } from "@/components/common/ShareBar";
import type { Guide } from "@/lib/guides";

import { GuideToc, type TocItem } from "./GuideToc";
import { RelatedGuides } from "./RelatedGuides";

/**
 * ガイド記事の共通レイアウト（ブログ体裁）。
 * ヒーロー（カテゴリ・タイトル・メタ）＋2カラム（本文＋追従目次）＋シェア＋関連記事。
 */
export function GuideArticle({
  guide,
  toc,
  children,
}: {
  guide: Guide;
  toc: TocItem[];
  children: ReactNode;
}) {
  return (
    <>
      <div className="border-b bg-gradient-to-b from-primary/[0.08] via-primary/[0.03] to-background">
        <Container className="py-8 sm:py-10">
          <Breadcrumb
            items={[
              { name: "ホーム", href: "/" },
              { name: "ガイド", href: "/guides" },
              { name: guide.shortTitle, href: guide.href },
            ]}
          />
          <div className="mt-5 max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              お金のガイド
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-black tracking-tight sm:text-[2.5rem]">
              {guide.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {guide.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden />
                更新: {guide.updated}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden />約{guide.readingMinutes}
                分で読めます
              </span>
              <span className="inline-flex items-center gap-1.5">
                <PenLine className="size-4" aria-hidden />
                まねでん編集部
              </span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
          <article className="min-w-0">
            <GuideToc items={toc} variant="inline" />
            <div className="max-w-2xl space-y-12">{children}</div>

            <div className="mt-14 max-w-2xl rounded-2xl border bg-muted/30 p-5">
              <p className="text-sm font-semibold text-foreground">
                この記事をシェア
              </p>
              <div className="mt-3">
                <ShareBar
                  shareText={`${guide.title}｜まねでん`}
                  hashtags={["まねでん", "お金の知識"]}
                />
              </div>
            </div>
          </article>

          <aside className="hidden lg:block">
            <GuideToc items={toc} variant="sticky" />
          </aside>
        </div>

        <RelatedGuides currentSlug={guide.slug} />
      </Container>
    </>
  );
}
