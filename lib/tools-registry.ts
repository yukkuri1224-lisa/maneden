import {
  Building2,
  Calculator,
  Clock,
  Coins,
  Gift,
  HandCoins,
  HeartHandshake,
  Home,
  LineChart,
  PiggyBank,
  Scale,
  Sprout,
  TrendingUp,
  Wallet,
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
    id: "salary-take-home",
    href: "/tools/salary-take-home",
    title: "会社員の手取り計算シミュレーター",
    shortTitle: "会社員の手取り",
    description:
      "年収（額面）から、社会保険料・所得税・住民税を差し引いた手取り額をシミュレーションします。",
    category: "tax",
    icon: Wallet,
    status: "live",
    sitemapPriority: 0.9,
  },
  {
    id: "hourly-wage",
    href: "/tools/hourly-wage",
    title: "時給・年収の変換シミュレーター",
    shortTitle: "時給↔年収 変換",
    description:
      "時給から年収、年収から時給を相互に換算。日給・週給・月収もまとめて計算します。",
    category: "tax",
    icon: Clock,
    status: "live",
    sitemapPriority: 0.9,
  },
  {
    id: "retirement-tax",
    href: "/tools/retirement-tax",
    title: "退職金の税金・手取り計算シミュレーター",
    shortTitle: "退職金の税金",
    description:
      "退職金額と勤続年数から、退職所得控除・所得税・住民税を計算し、手取り額の目安を算出します。",
    category: "tax",
    icon: PiggyBank,
    status: "live",
    sitemapPriority: 0.9,
  },
  {
    id: "bonus-take-home",
    href: "/tools/bonus-take-home",
    title: "ボーナス（賞与）手取り計算シミュレーター",
    shortTitle: "ボーナス手取り",
    description:
      "賞与の額面から社会保険料と所得税を差し引いた手取り額を概算。手取り率もひと目でわかります。",
    category: "tax",
    icon: Coins,
    status: "live",
    sitemapPriority: 0.9,
  },
  {
    id: "ideco",
    href: "/tools/ideco",
    title: "iDeCo（イデコ）節税シミュレーター",
    shortTitle: "iDeCo節税",
    description:
      "年収と毎月の掛金から、iDeCoの掛金でいくら節税できるかを概算。所得税・住民税の年間軽減額と60歳までの累計節税額がわかります。",
    category: "tax",
    icon: TrendingUp,
    status: "live",
    sitemapPriority: 0.9,
  },
  {
    id: "nisa",
    href: "/tools/nisa",
    title: "新NISA 積立シミュレーター",
    shortTitle: "新NISA 積立",
    description:
      "毎月の積立額・想定利回り・年数から、新NISAの将来の評価額と運用益、非課税メリットを複利で計算。年ごとの資産推移もグラフでわかります。",
    category: "tax",
    icon: Sprout,
    status: "live",
    sitemapPriority: 0.9,
  },
  {
    id: "gift-tax",
    href: "/tools/gift-tax",
    title: "贈与税の計算シミュレーター",
    shortTitle: "贈与税 計算",
    description:
      "もらった金額から、基礎控除110万円を引いて特例贈与・一般贈与の税率で贈与税を計算。手元に残る額までひと目でわかります。",
    category: "tax",
    icon: HeartHandshake,
    status: "live",
    sitemapPriority: 0.9,
  },
  {
    id: "inheritance-tax",
    href: "/tools/inheritance-tax",
    title: "相続税の計算シミュレーター",
    shortTitle: "相続税 計算",
    description:
      "遺産総額と法定相続人（配偶者・子）から、基礎控除・法定相続分・配偶者の税額軽減を反映して相続税の総額を計算します。",
    category: "tax",
    icon: Scale,
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
  {
    id: "mortgage",
    href: "/tools/mortgage",
    title: "住宅ローン返済シミュレーター",
    shortTitle: "住宅ローン返済",
    description:
      "借入額・金利・期間から毎月の返済額と総返済額を計算。繰上返済による利息の軽減・期間短縮の効果もわかります。",
    category: "real-estate",
    icon: Home,
    status: "live",
    sitemapPriority: 0.9,
  },
];

/** 公開済みツールのみ */
export const liveTools = tools.filter((tool) => tool.status === "live");

/** ID からツールを取得する */
export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}
