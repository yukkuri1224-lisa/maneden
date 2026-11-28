import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { guides } from "@/lib/guides";
import { tools } from "@/lib/tools-registry";

// pageMetadata は /tools/<id>・/guides/<slug> の画像パスを自動推定するため、
// 対応する opengraph-image.tsx が存在することを保証する。
describe("ページ別 OGP 画像ファイル", () => {
  const root = process.cwd();
  const hrefs = [...tools.map((t) => t.href), ...guides.map((g) => g.href)];

  it.each(hrefs)("%s に opengraph-image.tsx がある", (href) => {
    expect(
      existsSync(path.join(root, "app", href, "opengraph-image.tsx")),
    ).toBe(true);
  });

  it("対象が空でない", () => {
    expect(hrefs.length).toBeGreaterThan(0);
  });
});
