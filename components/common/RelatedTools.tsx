import { ToolCard } from "@/components/common/ToolCard";
import { tools } from "@/lib/tools-registry";

/**
 * 関連ツールへの回遊セクション（現在のツールを除外して表示）。
 */
export function RelatedTools({ excludeId }: { excludeId?: string }) {
  const related = tools.filter((tool) => tool.id !== excludeId);
  if (related.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold">あわせて使えるツール</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
