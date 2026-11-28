import { describe, expect, it } from "vitest";

import { toListItems } from "@/lib/companies/data";
import type { Company } from "@/lib/companies/types";

const sample: Company[] = [
  {
    slug: "a",
    name: "A社",
    securitiesCode: "1111",
    industry: "サービス業",
    averageSalary: 9_000_000,
    averageAge: 40,
    averageTenure: 10,
    employees: 100,
    fiscalYear: "2024年3月期",
  },
  { slug: "b", name: "B社", industry: "化学", averageSalary: 5_000_000 },
];

describe("toListItems", () => {
  it("4 キーだけを持つオブジェクトを返す", () => {
    for (const item of toListItems(sample)) {
      expect(Object.keys(item).sort()).toEqual([
        "averageSalary",
        "industry",
        "name",
        "slug",
      ]);
    }
  });

  it("件数と順序を保つ", () => {
    const items = toListItems(sample);
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.slug)).toEqual(["a", "b"]);
    expect(items[0].averageSalary).toBe(9_000_000);
  });
});
