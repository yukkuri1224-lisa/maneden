import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

// サイト共通の OGP 画像（1200×630）。file convention により全ページの
// openGraph / twitter 画像として自動適用される（個別 opengraph-image があれば上書き）。
export const alt = "まねでん｜税金・手取りの無料計算ツール";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "まねでん";
const TAGLINE = "税金・手取り・ふるさと納税・不動産の無料計算ツール";
const BADGES = ["登録不要", "完全無料", "データ送信なし"];

/**
 * Google Fonts の CSS2 API から、指定テキストに必要なグリフだけの TrueType を取得する。
 * 旧 User-Agent を送ると woff2 ではなく truetype が返る（Satori は ttf/otf のみ対応）。
 */
async function loadGoogleFont(
  weight: number,
  text: string,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (
    await fetch(url, { headers: { "User-Agent": "Mozilla/4.0" } })
  ).text();
  const src = css.match(
    /src:\s*url\((.+?)\)\s*format\('(?:truetype|opentype)'\)/,
  );
  if (!src) throw new Error("OGP フォントの取得に失敗しました");
  return (await fetch(src[1])).arrayBuffer();
}

export default async function OpengraphImage() {
  const glyphs = TITLE + TAGLINE + BADGES.join("") + "maneden.com";
  const [bold, regular] = await Promise.all([
    loadGoogleFont(700, glyphs),
    loadGoogleFont(400, glyphs),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#4f46e5",
        backgroundImage:
          "linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #0ea5e9 130%)",
        color: "#ffffff",
        fontFamily: "Noto Sans JP",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <div
          style={{
            fontSize: "108px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {TITLE}
        </div>
        <div
          style={{
            fontSize: "44px",
            fontWeight: 400,
            lineHeight: 1.35,
            opacity: 0.96,
            maxWidth: "900px",
          }}
        >
          {TAGLINE}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          {BADGES.map((badge) => (
            <div
              key={badge}
              style={{
                display: "flex",
                fontSize: "30px",
                fontWeight: 700,
                padding: "14px 30px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              {badge}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: "32px", opacity: 0.9 }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Noto Sans JP", data: bold, weight: 700, style: "normal" },
        { name: "Noto Sans JP", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
