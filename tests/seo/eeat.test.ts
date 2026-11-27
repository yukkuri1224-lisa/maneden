import { describe, expect, it } from "vitest";

import { author, reviewer } from "@/lib/editorial";
import { guides } from "@/lib/guides";
import { articleJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

describe("E-E-A-T: ガイドの根拠情報", () => {
  it.each(guides.map((g) => [g.slug, g]))(
    "%s は一次情報の参考文献と更新履歴を持つ",
    (_slug, guide) => {
      expect(guide.sources.length).toBeGreaterThan(0);
      for (const s of guide.sources) {
        expect(s.href).toMatch(
          /^https:\/\/(www\.)?[a-z0-9.-]+\.(go\.jp|or\.jp|jp)\//,
        );
      }
      expect(guide.revisions.length).toBeGreaterThan(0);
    },
  );

  it("著者は実在の情報のみ（資格なしなら空配列）、監修者は未設定なら null", () => {
    expect(author.name).not.toBe("");
    expect(Array.isArray(author.qualifications)).toBe(true);
    expect(reviewer === null || reviewer.qualifications.length > 0).toBe(true);
  });
});

describe("E-E-A-T: 構造化データ", () => {
  it("Article に編集方針と参考文献が入る", () => {
    const data = articleJsonLd({
      headline: "h",
      description: "d",
      url: "https://maneden.com/guides/x",
      datePublished: "2026-08-10",
      dateModified: "2026-08-10",
      citations: [{ label: "国税庁", href: "https://www.nta.go.jp/" }],
    });
    expect(data.publishingPrinciples).toMatch(/\/editorial-policy$/);
    expect(data.citation).toEqual([
      {
        "@type": "CreativeWork",
        name: "国税庁",
        url: "https://www.nta.go.jp/",
      },
    ]);
  });

  it("参考文献がなければ citation を出さない", () => {
    const data = articleJsonLd({
      headline: "h",
      description: "d",
      url: "https://maneden.com/guides/x",
      datePublished: "2026-08-10",
      dateModified: "2026-08-10",
    });
    expect("citation" in data).toBe(false);
  });

  it("WebPage の発行者に編集方針がつく", () => {
    const data = webPageJsonLd({
      name: "n",
      description: "d",
      url: "https://maneden.com/methodology",
      dateModified: "2026-11-27",
    });
    expect(data.publisher.publishingPrinciples).toMatch(/\/editorial-policy$/);
  });
});
