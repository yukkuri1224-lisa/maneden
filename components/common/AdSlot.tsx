import { cn } from "@/lib/utils";

/**
 * アフィリエイト広告のプレースホルダ枠。
 * レイアウトシフト（CLS）を防ぐため最小高さを固定し、「PR」表記を明示する。
 * 実広告は審査後に差し替える。
 */
export function AdSlot({
  label = "スポンサーリンク",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <aside
      aria-label="広告"
      className={cn(
        "flex min-h-24 w-full items-center justify-center rounded-lg border border-dashed bg-muted/30 px-4 text-center",
        className,
      )}
    >
      <div>
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          PR
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {label}（広告枠・審査後に差し替え）
        </p>
      </div>
    </aside>
  );
}
