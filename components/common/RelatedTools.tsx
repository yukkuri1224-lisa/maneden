import { JsonLd } from "@/components/common/JsonLd";
import { ToolCard } from "@/components/common/ToolCard";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";
import { getToolById, tools } from "@/lib/tools-registry";

/** 関連セクションに表示するツール数 */
const MAX_RELATED = 3;

/**
 * 関連ツールへの回遊セクション。
 * 現在のツールを除外し、同じカテゴリのツールを優先して最大 {@link MAX_RELATED} 件表示する。
 */
export function RelatedTools({ excludeId }: { excludeId?: string }) {
  const current = excludeId ? getToolById(excludeId) : undefined;
  const others = tools.filter((tool) => tool.id !== excludeId);

  // 同カテゴリを先頭に寄せ、残りで埋める
  const sorted = current
    ? [
        ...others.filter((tool) => tool.category === current.category),
        ...others.filter((tool) => tool.category !== current.category),
      ]
    : others;
  const related = sorted.slice(0, MAX_RELATED);
  if (related.length === 0) return null;

  return (
    <section>
      <JsonLd
        data={itemListJsonLd(
          related.map((tool) => ({
            name: tool.title,
            url: `${siteConfig.url}${tool.href}`,
          })),
        )}
      />
      <h2 className="text-lg font-semibold">あわせて使えるツール</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
