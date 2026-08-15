import Link from "next/link";
import type { ReactNode } from "react";

import { TAX_YEAR } from "@/lib/constants/tax-tables";
import { TOOL_SOURCES } from "@/lib/constants/tool-sources";

/**
 * ツールページ末尾の「計算の前提・出典・最終更新日」ブロック。
 * お金の情報（YMYL）として、いつ時点・何に基づく概算かを明示し信頼性を担保する。
 */
export function ToolMeta({
  updated,
  taxBasis,
  basis,
  toolId,
}: {
  /** 最終更新日（例: "2026年8月6日"） */
  updated: string;
  /** 税制年度に基づく概算であることを明示するか（税金系ツール） */
  taxBasis?: boolean;
  /** ツール固有の前提・注意（任意） */
  basis?: ReactNode;
  /** 出典リンクを引くためのツールID（lib/constants/tool-sources） */
  toolId?: string;
}) {
  const reiwaYear = TAX_YEAR - 2018;
  const sources = toolId ? TOOL_SOURCES[toolId] : undefined;

  return (
    <section
      aria-label="計算の前提と更新情報"
      className="rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground"
    >
      {taxBasis && (
        <p>
          本ツールは{TAX_YEAR}年度（令和{reiwaYear}
          年度）の税制・料率をもとにした概算です。税制は毎年改定され、保険料率は自治体・保険者によって異なります。正確な金額は
          <a
            href="https://www.nta.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            国税庁
          </a>
          や各自治体の情報、税理士等の専門家にご確認ください。
        </p>
      )}
      {basis && <p className={taxBasis ? "mt-1" : undefined}>{basis}</p>}

      {sources && sources.length > 0 && (
        <p className="mt-2">
          <span className="font-medium text-foreground">計算根拠・出典：</span>
          {sources.map((s, i) => (
            <span key={s.href}>
              {i > 0 && "／"}
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {s.label}
              </a>
            </span>
          ))}
        </p>
      )}

      <p className="mt-2">
        本ツールは税理士による監修を受けたものではなく、税務相談・個別の税務助言ではありません。計算結果は概算です。詳しくは
        <Link href="/disclaimer" className="underline">
          免責事項
        </Link>
        をご確認ください。
      </p>
      <p className="mt-1">最終更新日: {updated}</p>
    </section>
  );
}
