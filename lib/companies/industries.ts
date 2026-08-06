/**
 * 業種名 → URL スラッグの対応（東証33業種＋「その他」）。
 * 業種ハブページ `/companies/industry/[slug]` の生成に使用する。
 */
export const INDUSTRY_SLUGS: Record<string, string> = {
  "水産・農林業": "fishery-agriculture",
  鉱業: "mining",
  建設業: "construction",
  食料品: "foods",
  繊維製品: "textiles",
  "パルプ・紙": "pulp-paper",
  化学: "chemicals",
  医薬品: "pharmaceuticals",
  "石油・石炭製品": "oil-coal",
  ゴム製品: "rubber",
  "ガラス・土石製品": "glass-ceramics",
  鉄鋼: "iron-steel",
  非鉄金属: "nonferrous-metals",
  金属製品: "metal-products",
  機械: "machinery",
  電気機器: "electric-appliances",
  輸送用機器: "transportation-equipment",
  精密機器: "precision-instruments",
  その他製品: "other-products",
  "電気・ガス業": "electric-gas",
  陸運業: "land-transport",
  海運業: "marine-transport",
  空運業: "air-transport",
  "倉庫・運輸関連業": "warehousing",
  "情報・通信業": "it-communication",
  卸売業: "wholesale",
  小売業: "retail",
  銀行業: "banking",
  "証券、商品先物取引業": "securities",
  保険業: "insurance",
  その他金融業: "other-finance",
  不動産業: "real-estate",
  サービス業: "services",
  その他: "others",
};

/** スラッグ → 業種名 */
export const SLUG_TO_INDUSTRY: Record<string, string> = Object.fromEntries(
  Object.entries(INDUSTRY_SLUGS).map(([name, slug]) => [slug, name]),
);

/** ハブページを生成しない業種（集約に意味の薄いもの） */
export const NO_HUB_INDUSTRIES = new Set<string>(["その他"]);

export function industrySlug(industry: string): string | undefined {
  return INDUSTRY_SLUGS[industry];
}

export function industryFromSlug(slug: string): string | undefined {
  return SLUG_TO_INDUSTRY[slug];
}

/** その業種のハブページを作るか（＝ハブへの内部リンクを張ってよいか） */
export function hasIndustryHub(industry: string): boolean {
  return !NO_HUB_INDUSTRIES.has(industry) && industry in INDUSTRY_SLUGS;
}
