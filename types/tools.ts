import type { LucideIcon } from "lucide-react";

export type ToolStatus = "live" | "coming-soon";

export interface ToolCategory {
  /** カテゴリ識別子 */
  id: string;
  /** 表示名 */
  name: string;
}

export interface Tool {
  /** URL のパスセグメント兼識別子（例: "freelance-tax"） */
  id: string;
  /** ページへのパス（例: "/tools/freelance-tax"） */
  href: string;
  /** 正式名称（h1・meta 用） */
  title: string;
  /** ナビ・カード用の短い名称 */
  shortTitle: string;
  /** 一言説明 */
  description: string;
  /** カテゴリ ID（ToolCategory.id） */
  category: string;
  /** lucide アイコンコンポーネント */
  icon: LucideIcon;
  /** 公開状態 */
  status: ToolStatus;
  /** sitemap の priority（0.0〜1.0） */
  sitemapPriority: number;
}
