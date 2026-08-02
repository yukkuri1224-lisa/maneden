/**
 * 全角数字→半角、カンマ・空白を除去して数値化する。
 * ユーザーに厳密な入力形式を求めない（HIG #12）。失敗時は null を返す。
 */
export function parseLooseNumber(raw: string): number | null {
  const normalized = raw
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[．]/g, ".")
    .replace(/[，,\s]/g, "");
  if (normalized === "") return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
