import {
  Building2,
  Calculator,
  Gift,
  HandCoins,
  LineChart,
} from "lucide-react";

import type { Tool, ToolCategory } from "@/types/tools";

/**
 * ツールのカテゴリ定義。
 */
export const toolCategories: ToolCategory[] = [
  { id: "tax", name: "税金・確定申告" },
  { id: "management", name: "経営・SaaS指標" },
  { id: "real-estate", name: "不動産" },
];

/**
 * 全ツールの一元管理レジストリ。
 * トップ / ツール一覧 / ヘッダー / フッター / 関連導線 / sitemap は
 * すべてこの配列を唯一の情報源として参照する。
 * 新規ツール追加時はここに 1 要素追加すれば各所へ自動反映される。
 */
export const tools: Tool[] = [
  {
    id: "freelance-tax",
    href: "/tools/freelance-tax",
    title: "フリーランス・副業 手取り＆税金シミュレーター",
    shortTitle: "手取り＆税金シミュレーター",
    description:
      "売上と経費から、所得税・住民税・国保・消費税とインボイス影響、年間手取り額をリアルタイムに概算します。",
    category: "tax",
    icon: Calculator,
    status: "live",
    sitemapPriority: 1.0,
  },
  {
    id: "furusato-tax",
    href: "/tools/furusato-tax",
    title: "ふるさと納税 上限額シミュレーター",
    shortTitle: "ふるさと納税 上限",
    description:
      "年収と家族構成から、自己負担2,000円で済むふるさと納税の控除上限額の目安を計算します。",
    category: "tax",
    icon: Gift,
    status: "live",
    sitemapPriority: 0.9,
  },
  {
    id: "subsidy-finder",
    href: "/tools/subsidy-finder",
    title: "補助金・助成金 受給額診断",
    shortTitle: "補助金・助成金 診断",
    description:
      "業種・規模・地域・投資目的から、該当しそうな補助金制度と概算受給額レンジを診断します。",
    category: "management",
    icon: HandCoins,
    status: "live",
    sitemapPriority: 0.8,
  },
  {
    id: "saas-metrics",
    href: "/tools/saas-metrics",
    title: "SaaS Churn Rate & LTV 計算機",
    shortTitle: "SaaS指標 計算機",
    description:
      "解約率・ARPU・CAC などから LTV や LTV/CAC 比率を算出し、事業の健全性を可視化します。",
    category: "management",
    icon: LineChart,
    status: "live",
    sitemapPriority: 0.8,
  },
  {
    id: "real-estate-yield",
    href: "/tools/real-estate-yield",
    title: "不動産利回り＆デッドクロス診断",
    shortTitle: "不動産利回り 診断",
    description:
      "表面・実質利回りを算出し、減価償却とローン返済からデッドクロス発生時期を予測します。",
    category: "real-estate",
    icon: Building2,
    status: "live",
    sitemapPriority: 0.8,
  },
];

/** 公開済みツールのみ */
export const liveTools = tools.filter((tool) => tool.status === "live");

/** ID からツールを取得する */
export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}
