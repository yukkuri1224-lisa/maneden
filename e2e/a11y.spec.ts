import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { KEY_PAGES, openStable } from "./pages";

/**
 * axe-core（WCAG 2.1 A / AA）でアクセシビリティを検査する。
 *
 * 現状の違反は `e2e/a11y-baseline.json` に記録してあり、テストは「基準線より悪化したら失敗」。
 * 違反を直したら `UPDATE_A11Y_BASELINE=1 pnpm test:a11y` で基準線を更新する（件数は減る方向だけ）。
 */
type Baseline = Record<string, Record<string, number>>;

const BASELINE_PATH = join(__dirname, "a11y-baseline.json");
const UPDATE = process.env.UPDATE_A11Y_BASELINE === "1";

function readBaseline(): Baseline {
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as Baseline;
  } catch {
    return {};
  }
}

for (const { name, path } of KEY_PAGES) {
  test(`a11y: ${name}`, async ({ page }, testInfo) => {
    await openStable(page, path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const counts: Record<string, number> = {};
    for (const v of results.violations) counts[v.id] = v.nodes.length;
    const key = `${testInfo.project.name}:${name}`;

    if (UPDATE) {
      // 並列実行でも書き込みが衝突しないよう、読み直してから自分の行だけ更新する
      const baseline = readBaseline();
      baseline[key] = counts;
      const sorted = Object.fromEntries(
        Object.entries(baseline).sort(([a], [b]) => a.localeCompare(b)),
      );
      writeFileSync(BASELINE_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
      return;
    }

    const allowed = readBaseline()[key] ?? {};
    const worse = Object.entries(counts)
      .filter(([id, n]) => n > (allowed[id] ?? 0))
      .map(([id, n]) => {
        const v = results.violations.find((x) => x.id === id);
        return `${id}: ${allowed[id] ?? 0} → ${n}（${v?.help}）`;
      });
    expect(worse, `基準線より増えた a11y 違反（${key}）`).toEqual([]);
  });
}
