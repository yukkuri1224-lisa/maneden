/**
 * サイト全体で共有する基本情報。
 * 公開 URL は環境変数 NEXT_PUBLIC_SITE_URL から取得し、末尾スラッシュを除去する。
 * （sitemap / robots / OGP / canonical のベース URL に使用）
 */
export const siteConfig = {
  name: "まねでん",
  description:
    "年収の手取り・ふるさと納税の上限・退職金や贈与税まで、税金とお金の計算が登録不要・完全無料で完結。会社員もフリーランスも使えるシミュレーターと上場企業の平均年収データを収録。",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://maneden.com").replace(
    /\/$/,
    "",
  ),
  email: "manedencontact@gmail.com",
} as const;

export type SiteConfig = typeof siteConfig;
