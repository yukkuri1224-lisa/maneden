import { describe, expect, it } from "vitest";

import { pageMetadata } from "@/lib/seo/metadata";

describe("pageMetadata", () => {
  it("canonical・og・twitter を揃えて返す", () => {
    const m = pageMetadata({
      title: "ツール一覧",
      description: "d",
      path: "/tools",
    });
    expect(m.title).toBe("ツール一覧");
    expect(m.alternates?.canonical).toBe("/tools");
    expect(m.openGraph?.url).toBe("https://maneden.com/tools");
    expect(m.openGraph?.siteName).toBe("まねでん");
    expect(m.openGraph?.locale).toBe("ja_JP");
    expect((m.openGraph as { type?: string }).type).toBe("website");
    const images = m.openGraph?.images as { url: string }[];
    expect(images[0].url).toBe("/opengraph-image");
    expect((m.twitter as { card?: string }).card).toBe("summary_large_image");
  });

  it("path が / のとき og:url は末尾スラッシュなし", () => {
    const m = pageMetadata({ title: "t", description: "d", path: "/" });
    expect(m.openGraph?.url).toBe("https://maneden.com");
  });

  it("ogTitle 指定時は og/twitter のみ差し替わる", () => {
    const m = pageMetadata({
      title: "短い",
      ogTitle: "長いタイトル",
      description: "d",
      path: "/x",
    });
    expect(m.title).toBe("短い");
    expect(m.openGraph?.title).toBe("長いタイトル");
    expect(m.twitter?.title).toBe("長いタイトル");
  });

  it("article では publishedTime を含む", () => {
    const m = pageMetadata({
      title: "t",
      description: "d",
      path: "/guides/a",
      type: "article",
      publishedTime: "2026-08-01",
    });
    const og = m.openGraph as { type?: string; publishedTime?: string };
    expect(og.type).toBe("article");
    expect(og.publishedTime).toBe("2026-08-01");
  });
});
