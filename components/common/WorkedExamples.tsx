/**
 * 「具体例（モデルケース）」を3パターン前後で並べるブロック。
 * 数値は各ツールの計算関数からサーバー側で算出した実値を渡す（概算の目安）。
 */
export interface WorkedExampleRow {
  label: string;
  value: string;
  /** 手取り・税額など強調したい行 */
  strong?: boolean;
}

export interface WorkedExample {
  /** ケースの見出し（例：年収400万円・独身） */
  title: string;
  /** 補足（前提など） */
  note?: string;
  rows: WorkedExampleRow[];
}

export function WorkedExamples({
  heading = "具体例（モデルケース）",
  description,
  examples,
}: {
  heading?: string;
  description?: string;
  examples: WorkedExample[];
}) {
  return (
    <section>
      <h2 className="text-xl font-bold">{heading}</h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {examples.map((ex) => (
          <div key={ex.title} className="rounded-xl border p-4">
            <p className="text-sm font-semibold">{ex.title}</p>
            {ex.note && (
              <p className="mt-1 text-xs text-muted-foreground">{ex.note}</p>
            )}
            <dl className="mt-3 space-y-1.5 text-sm">
              {ex.rows.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between gap-2 ${
                    row.strong ? "border-t pt-1.5 font-bold" : ""
                  }`}
                >
                  <dt className={row.strong ? "" : "text-muted-foreground"}>
                    {row.label}
                  </dt>
                  <dd className="tabular-nums">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
