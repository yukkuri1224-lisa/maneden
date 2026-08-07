import { cn } from "@/lib/utils";

/**
 * 広告（PR）枠。現状は「PR」表記のみを表示する。
 * Google AdSense 等の審査通過後に、この枠へ広告ユニットを差し込む。
 */
export function AdSlot({ className }: { className?: string }) {
  return (
    <aside aria-label="広告" className={cn("text-center", className)}>
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        PR
      </p>
    </aside>
  );
}
