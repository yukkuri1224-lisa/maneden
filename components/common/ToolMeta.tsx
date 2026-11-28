import Link from "next/link";
import type { ReactNode } from "react";

import { TAX_YEAR } from "@/lib/constants/tax-tables";
import {
  CURRENT_INCOME_TAX_YEAR,
  CURRENT_RESIDENT_TAX_FISCAL_YEAR,
  toReiwa,
} from "@/lib/constants/tax-years";
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
  taxYearNote,
}: {
  /** 最終更新日（例: "2026年8月6日"） */
  updated: string;
  /** 税制年度に基づく概算であることを明示するか（税金系ツール） */
  taxBasis?: boolean;
  /** ツール固有の前提・注意（任意） */
  basis?: ReactNode;
  /** 出典リンクを引くためのツールID（lib/constants/tool-sources） */
  toolId?: string;
  /**
   * 所得税の対象年分と令和8年度改正（2026年12月1日施行）の説明を出すか。
   * salary＝会社員（年末調整で精算）、business＝個人事業主（確定申告で反映）。
   */
  taxYearNote?: "salary" | "business";
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
      {taxYearNote && (
        <p className={taxBasis ? "mt-1" : undefined}>
          <TaxYearNote kind={taxYearNote} />
        </p>
      )}
      {basis && (
        <p className={taxBasis || taxYearNote ? "mt-1" : undefined}>{basis}</p>
      )}

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

/** 所得税の対象年分と、令和8年度改正の施行時期・反映タイミングの説明文 */
export function TaxYearNote({ kind }: { kind: "salary" | "business" }) {
  const itYear = CURRENT_INCOME_TAX_YEAR;
  const rtYear = CURRENT_RESIDENT_TAX_FISCAL_YEAR;
  const timing =
    kind === "salary"
      ? `会社員の方は、${itYear}年11月までの毎月の源泉徴収は改正前のままで、12月の年末調整で新しい控除により精算されます。毎月の源泉徴収額が新しい税額表に変わるのは${itYear + 1}年1月からです。`
      : `個人事業主・フリーランスの方は、${itYear + 1}年に行う令和${toReiwa(itYear)}年分の確定申告で新しい控除が反映されます。`;
  return (
    <>
      所得税は令和{toReiwa(itYear)}年分（{itYear}
      年1〜12月の収入）で計算しています。令和{toReiwa(itYear)}
      年12月1日に施行された基礎控除・給与所得控除の引き上げを反映しています。
      {timing}
      住民税は、この収入にかかる令和{toReiwa(rtYear)}年度分（{rtYear}
      年6月から納付）の概算です。
    </>
  );
}
