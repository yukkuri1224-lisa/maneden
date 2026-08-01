/**
 * サイト全体で共有する基本情報。
 * 公開 URL は環境変数 NEXT_PUBLIC_SITE_URL から取得し、末尾スラッシュを除去する。
 * （sitemap / robots / OGP / canonical のベース URL に使用）
 */
export const siteConfig = {
  name: "マネ電",
  description:
    "登録不要・完全無料。フリーランスや個人事業主のための税金・経営・不動産の計算＆シミュレーションツール集。",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://maneden.com").replace(
    /\/$/,
    "",
  ),
  email: "manedencontact@gmail.com",
} as const;

export type SiteConfig = typeof siteConfig;
