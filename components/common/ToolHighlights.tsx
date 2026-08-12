import { Check } from "lucide-react";

/**
 * ツール直下に置く「このツールでわかること」ブロック。
 * 3行前後で、そのツールで何が得られるかを端的に示す（回遊・滞在の起点）。
 */
export function ToolHighlights({ items }: { items: string[] }) {
  return (
    <section
      aria-label="このツールでわかること"
      className="mt-8 rounded-xl border bg-muted/30 p-5"
    >
      <p className="text-sm font-semibold">このツールでわかること</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted-foreground">
            <Check
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
