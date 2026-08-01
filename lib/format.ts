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
