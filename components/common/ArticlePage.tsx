import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";

/**
 * 記事・法務ページ用の共通レイアウト（パンくず＋見出し＋本文タイポグラフィ）。
 */
export function ArticlePage({
  title,
  href,
  updated,
  children,
}: {
  title: string;
  href: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: title, href },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      {updated && (
        <p className="mt-1 text-xs text-muted-foreground">
          最終更新日: {updated}
        </p>
      )}
      <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </Container>
  );
}
