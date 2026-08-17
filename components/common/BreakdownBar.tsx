/**
 * 額面に占める「手取り・各控除」を色分けした100%積み上げ横バー＋凡例。
 * サーバー側で描画できる純CSS（クローラー可読・CLSなし）。数値は呼び出し側で用意する。
 */
export interface BreakdownSegment {
  label: string;
  value: number;
  /** バー・凡例ドットの色（Tailwind の bg-* クラス） */
  colorClass: string;
}

export function BreakdownBar({
  segments,
  formatValue,
}: {
  segments: BreakdownSegment[];
  /** 凡例に表示する金額の整形（例: (v) => formatManYen(v,0)） */
  formatValue: (value: number) => string;
}) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  if (total <= 0) return null;

  return (
    <div>
      <div
        className="flex h-4 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={segments
          .map((s) => `${s.label} ${formatValue(s.value)}`)
          .join("、")}
      >
        {segments.map((s) => {
          const pct = (Math.max(0, s.value) / total) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={s.label}
              className={s.colorClass}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5">
            <span
              className={`inline-block size-2.5 shrink-0 rounded-full ${s.colorClass}`}
              aria-hidden
            />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="ml-auto font-medium tabular-nums">
              {formatValue(s.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
