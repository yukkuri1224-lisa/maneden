import { expect, test } from "@playwright/test";

import { KEY_PAGES, openStable } from "./pages";

/**
 * 主要 12 画面の全体スクリーンショットを期待画像と比較する（ライトモード）。
 * リデザインの各 PR で「意図した画面だけが変わったか」を確かめるための基準線。
 */
for (const { name, path } of KEY_PAGES) {
  test(`見た目: ${name}`, async ({ page }) => {
    await openStable(page, path);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}

/** ダークモードの維持を確かめるため、代表 2 画面はダークでも撮る */
for (const { name, path } of KEY_PAGES.filter((p) =>
  ["home", "tool-salary-take-home"].includes(p.name),
)) {
  test(`見た目（ダーク）: ${name}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await openStable(page, path);
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page).toHaveScreenshot(`${name}-dark.png`, { fullPage: true });
  });
}
