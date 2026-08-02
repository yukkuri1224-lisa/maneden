import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * 段階的開示（プログレッシブ・ディスクロージャ）用の折りたたみセクション。
 * 使用頻度の低い項目を隠し、初期表示をシンプルに保つ（HIG #20）。
 */
export function DetailsSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-dashed"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium select-none [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="space-y-6 border-t border-dashed p-4 pt-5">
        {children}
      </div>
    </details>
  );
}
