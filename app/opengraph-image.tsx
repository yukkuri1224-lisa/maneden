import { OG_SIZE, renderOgImage } from "@/lib/seo/og-image";
import { siteConfig } from "@/lib/site-config";

// サイト共通の OGP 画像（1200×630）。file convention により全ページの
// openGraph / twitter 画像として自動適用される（個別 opengraph-image があれば上書き）。
export const alt = `${siteConfig.name}｜税金・手取りの無料計算ツール`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: siteConfig.name,
    tagline: "税金・手取り・ふるさと納税・不動産の無料計算ツール",
  });
}
