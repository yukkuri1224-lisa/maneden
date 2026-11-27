import { describe, expect, it } from "vitest";

import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  articleJsonLd,
  datasetJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/jsonld";

describe("構造化データ", () => {
  it("Organization は @id とロゴ(ImageObject)を持つ", () => {
    const o = organizationJsonLd();
    expect(ORGANIZATION_ID).toBe("https://maneden.com/#organization");
    expect(o["@id"]).toBe("https://maneden.com/#organization");
    expect(o.logo).toEqual({
      "@type": "ImageObject",
      url: "https://maneden.com/logo.png",
      width: 512,
      height: 512,
    });
  });

  it("WebSite は @id を持ち publisher が Organization を参照する", () => {
    const w = webSiteJsonLd();
    expect(WEBSITE_ID).toBe("https://maneden.com/#website");
    expect(w["@id"]).toBe("https://maneden.com/#website");
    expect(w.publisher).toEqual({ "@id": "https://maneden.com/#organization" });
  });

  it("Article の publisher は @id 参照、author は Organization", () => {
    const a = articleJsonLd({
      headline: "h",
      description: "d",
      url: "https://maneden.com/guides/x",
      datePublished: "2026-01-01",
      dateModified: "2026-01-02",
    });
    expect(a.publisher).toEqual({ "@id": ORGANIZATION_ID });
    expect(a.author).toEqual({
      "@type": "Organization",
      name: "まねでん",
      url: "https://maneden.com",
    });
  });

  it("Dataset の creator / publisher は @id 参照", () => {
    const d = datasetJsonLd({
      name: "n",
      description: "d",
      url: "https://maneden.com/companies",
    });
    expect(d.creator).toEqual({ "@id": ORGANIZATION_ID });
    expect(d.publisher).toEqual({ "@id": ORGANIZATION_ID });
  });
});
