import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 日本語の本文・見出し用フォント（欧文/数字は Geist、日本語は Zen Kaku）
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-jp",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}｜税金・手取り・経営・不動産の無料計算ツール`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  // Google AdSense のサイト確認用メタタグ（静的 head に出力され view-source で確認可能）
  other: { "google-adsense-account": "ca-pub-6626208471378682" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ハイドレーション前にテーマを適用してチラつきを防ぐスクリプト
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${zenKaku.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />

        {/* Google AdSense。afterInteractive でハイドレーション後に読み込む（審査・配信の推奨方式）。
            発行者ID: ca-pub-6626208471378682 */}
        <Script
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6626208471378682"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          async
        />

        {/* Google Analytics 4（gtag.js）。計測はアイドル後で十分なため lazyOnload で
            初期描画・ハイドレーションのメインスレッド競合を避ける（TBT削減） */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QFB3PRTB6D"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QFB3PRTB6D');
          `}
        </Script>
      </body>
    </html>
  );
}
