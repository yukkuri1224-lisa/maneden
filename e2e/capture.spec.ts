import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { test } from "@playwright/test";

import { CAPTURE_TARGETS, CAPTURE_VIEWPORTS } from "./capture-targets";
import { openStable } from "./pages";

/**
 * UI レビューサイクルの撮影（テストではなく画像の書き出し）。
 * 使い方: `UI_TARGET=home UI_CYCLE=1 pnpm ui:capture`
 * 出力: reviews/<target>/cycle-<n>/<幅>/<状態>-<連番>.png と manifest.json（git 管理外）
 * manifest を 1 つにまとめるため、package.json のスクリプトは 1 ワーカーで実行する。
 */
const targetName = process.env.UI_TARGET;
const cycle = process.env.UI_CYCLE ?? "1";
const target = CAPTURE_TARGETS.find((t) => t.name === targetName);

test.skip(
  !target,
  `UI_TARGET に ${CAPTURE_TARGETS.map((t) => t.name).join(" / ")} のどれかを指定してください`,
);

const outDir = join("reviews", targetName ?? "_", `cycle-${cycle}`);

// 同じ周回を撮り直したときに古い画像が混ざらないよう、先に空にする
test.beforeAll(() => {
  if (target) rmSync(outDir, { recursive: true, force: true });
});

test.afterAll(() => {
  if (!target) return;
  mkdirSync(outDir, { recursive: true });
  // 書き出した画像を幅ごとに一覧にする（レビュアーはこの順に読む）
  const manifest = CAPTURE_VIEWPORTS.flatMap((vp) => {
    const dir = join(outDir, vp.name);
    let files: string[] = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".png"));
    } catch {
      // この幅は撮影されていない
    }
    return files.sort().map((f) => ({ file: join(dir, f), width: vp.name }));
  });
  writeFileSync(
    join(outDir, "manifest.json"),
    JSON.stringify(
      { target: target.name, path: target.path, cycle, shots: manifest },
      null,
      2,
    ),
  );
});

for (const vp of CAPTURE_VIEWPORTS) {
  for (const state of target?.states ?? []) {
    test(`撮影: ${targetName} ${vp.name} ${state.name}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
        deviceScaleFactor: 1,
        locale: "ja-JP",
        timezoneId: "Asia/Tokyo",
        reducedMotion: "reduce",
        colorScheme: state.dark ? "dark" : "light",
      });
      const page = await context.newPage();
      const url = state.query ? `${target!.path}?${state.query}` : target!.path;
      await openStable(page, url);
      if (state.act) {
        await state.act(page);
        await page.waitForTimeout(500);
      }

      // 縦に長いページは 1 画面ずつ切り出す（全体を 1 枚にすると文字が潰れて読めない）
      const fullHeight = await page.evaluate(
        () => document.documentElement.scrollHeight,
      );
      const limit = state.segments ?? target!.maxSegments;
      const count = Math.min(Math.ceil(fullHeight / vp.height), limit);
      const dir = join(outDir, vp.name);
      mkdirSync(dir, { recursive: true });
      for (let i = 0; i < count; i++) {
        const y = i * vp.height;
        const file = join(
          dir,
          `${state.name}-${String(i + 1).padStart(2, "0")}.png`,
        );
        await page.screenshot({
          path: file,
          fullPage: true,
          clip: {
            x: 0,
            y,
            width: vp.width,
            height: Math.min(vp.height, fullHeight - y),
          },
          animations: "disabled",
          caret: "hide",
        });
      }
      await context.close();
    });
  }
}
