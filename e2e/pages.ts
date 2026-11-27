import type { Page } from "@playwright/test";

/** 回帰テストの対象にする主要 12 画面（テンプレートごとに代表 1 ページ） */
export const KEY_PAGES = [
  { name: "home", path: "/" },
  { name: "tools", path: "/tools" },
  { name: "tool-salary-take-home", path: "/tools/salary-take-home" },
  { name: "tool-furusato-tax", path: "/tools/furusato-tax" },
  { name: "tool-nisa", path: "/tools/nisa" },
  { name: "companies", path: "/companies" },
  { name: "company-1301", path: "/companies/1301" },
  { name: "industry-services", path: "/companies/industry/services" },
  { name: "take-home-500", path: "/take-home/500" },
  { name: "furusato-500", path: "/furusato/500" },
  { name: "guide-kaishain-tedori", path: "/guides/kaishain-tedori" },
  { name: "editorial-policy", path: "/editorial-policy" },
] as const;

/**
 * ページを開き、撮影や検査の前に表示を落ち着かせる。
 * Web フォント・遅延読み込みのグラフ（Recharts）・数字のカウントアップが終わるまで待つ。
 */
export async function openStable(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // LazyMount（IntersectionObserver）のグラフを描画させるため、1 画面ずつ最下部まで送ってから戻す
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
  });
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => window.scrollTo(0, 0));
  // Recharts のアニメーション（既定 1.5 秒）の完了を待つ
  await page.waitForTimeout(2_000);
}
