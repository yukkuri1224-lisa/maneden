import type { ReactNode } from "react";

/**
 * 記事の見出し付きセクション。id は目次（GuideToc）のアンカーと一致させる。
 * 本文の基本タイポグラフィ（本文サイズ・行間・strong の装飾）をここで一括適用する。
 */
export function GuideSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground">
        <span
          className="h-6 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-sky-400"
          aria-hidden
        />
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
