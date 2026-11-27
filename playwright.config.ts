import { defineConfig } from "@playwright/test";

/**
 * 見た目の回帰テスト（スクリーンショット比較）とアクセシビリティ検査。
 * 本番ビルドを対象にする: `pnpm build` のあと `pnpm test:visual`。
 * 期待画像の更新は `pnpm test:visual:update`（意図した見た目の変更のときだけ）。
 */
const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  timeout: 60_000,
  expect: {
    toHaveScreenshot: {
      // フォントのアンチエイリアス差を吸収しつつ、レイアウト崩れは検出できる閾値
      maxDiffPixelRatio: 0.002,
      animations: "disabled",
      caret: "hide",
    },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "off",
    deviceScaleFactor: 1,
    locale: "ja-JP",
    timezoneId: "Asia/Tokyo",
    // カウントアップ等の動きを止め、毎回同じ画面を撮る（useCountUp は reduce で即確定）
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "sp",
      use: { viewport: { width: 390, height: 844 } },
      testIgnore: /capture\.spec\.ts/,
    },
    {
      name: "pc",
      use: { viewport: { width: 1440, height: 900 } },
      testIgnore: /capture\.spec\.ts/,
    },
    // UI レビューサイクルの撮影専用（`pnpm ui:capture`）。回帰テストには含めない
    { name: "capture", testMatch: /capture\.spec\.ts/ },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
