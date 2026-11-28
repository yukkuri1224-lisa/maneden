import { describe, expect, it } from "vitest";

import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  articleJsonLd,
  datasetJsonLd,
  organizationRef,
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
    expect(w.publisher).toEqual(organizationRef());
  });

  it("Article の publisher は @id 参照、author は Organization", () => {
    const a = articleJsonLd({
      headline: "h",
      description: "d",
      url: "https://maneden.com/guides/x",
      datePublished: "2026-01-01",
      dateModified: "2026-01-02",
    });
    expect(a.publisher).toEqual(organizationRef());
    expect(a.author).toEqual(organizationRef());
  });

  it("Dataset の creator / publisher は @id 参照", () => {
    const d = datasetJsonLd({
      name: "n",
      description: "d",
      url: "https://maneden.com/companies",
    });
    expect(d.creator).toEqual(organizationRef());
    expect(d.publisher).toEqual(organizationRef());
  });
});

describe("organizationRef", () => {
  it("@type/@id/name/logo を自己完結で持つ", () => {
    expect(organizationRef()).toEqual({
      "@type": "Organization",
      "@id": "https://maneden.com/#organization",
      name: "まねでん",
      url: "https://maneden.com",
      logo: {
        "@type": "ImageObject",
        url: "https://maneden.com/logo.png",
        width: 512,
        height: 512,
      },
    });
  });
});
