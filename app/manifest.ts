import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * PWA マニフェスト。スマホで「ホーム画面に追加」した際にアプリ的に起動する。
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "まねでん",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    lang: "ja",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
