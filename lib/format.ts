/** 金額を「1,234,567円」形式に整形 */
export function formatYen(value: number): string {
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

/** 金額を「123.4万円」形式に整形 */
export function formatManYen(value: number, digits = 1): string {
  return `${(value / 10_000).toLocaleString("ja-JP", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}万円`;
}

/** 割合を「61.2%」形式に整形 */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/**
 * 決算期を「2026年3月期」形式に整形する。
 * ISO 日付（例 "2026-03-31"）は年月に変換し、既に整形済みの文字列はそのまま返す。
 */
export function formatFiscalYear(raw?: string): string | undefined {
  if (!raw) return undefined;
  const iso = raw.match(/^(\d{4})-(\d{2})/);
  if (iso) return `${iso[1]}年${Number(iso[2])}月期`;
  return raw;
}
