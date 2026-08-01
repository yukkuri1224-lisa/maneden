import { describe, expect, it } from "vitest";

import {
  findSubsidies,
  type SubsidyInput,
} from "@/lib/calculators/subsidy-finder";

function baseInput(overrides: Partial<SubsidyInput> = {}): SubsidyInput {
  return {
    businessType: "corporation",
    employees: 5,
    purposes: ["it"],
    investmentAmount: 3_000_000,
    ...overrides,
  };
}

describe("findSubsidies（マッチングと概算額）", () => {
  it("目的 IT のみ → IT導入補助金だけ該当、概算額は補助率上限×投資（上限キャップ内）", () => {
    const matches = findSubsidies(baseInput());
    expect(matches.length).toBe(1);
    expect(matches[0]?.program.id).toBe("it-donyu");
    expect(matches[0]?.estimatedAmount).toBe(2_250_000); // 3,000,000 × 0.75
    expect(matches[0]?.estimatedMin).toBe(1_500_000); // 3,000,000 × 0.5
  });

  it("目的が一致しない制度は除外される", () => {
    const matches = findSubsidies(baseInput({ purposes: ["startup"] }));
    expect(matches.every((m) => m.program.id === "sougyou")).toBe(true);
    expect(matches.length).toBe(1);
  });

  it("概算額の降順に並ぶ", () => {
    const matches = findSubsidies(
      baseInput({
        purposes: ["equipment"],
        employees: 30,
        investmentAmount: 5_000_000,
      }),
    );
    const amounts = matches.map((m) => m.estimatedAmount);
    const sorted = [...amounts].sort((a, b) => b - a);
    expect(amounts).toEqual(sorted);
    // 業務改善(0.9)が最上位
    expect(matches[0]?.program.id).toBe("gyomu-kaizen");
  });
});

describe("findSubsidies（小規模限定の従業員フィルタ）", () => {
  it("従業員が上限超なら小規模限定（持続化）は除外", () => {
    const over = findSubsidies(
      baseInput({ purposes: ["sales-channel"], employees: 30 }),
    );
    expect(over.length).toBe(0);
  });

  it("従業員が上限以下なら持続化が該当", () => {
    const within = findSubsidies(
      baseInput({ purposes: ["sales-channel"], employees: 10 }),
    );
    expect(within.length).toBe(1);
    expect(within[0]?.program.id).toBe("jizokuka");
  });
});

describe("findSubsidies（上限キャップ）", () => {
  it("投資が大きくても補助上限額でキャップされる", () => {
    const matches = findSubsidies(
      baseInput({ purposes: ["restructuring"], investmentAmount: 100_000_000 }),
    );
    const saikouchiku = matches.find((m) => m.program.id === "saikouchiku");
    expect(saikouchiku?.estimatedAmount).toBe(30_000_000); // 上限
  });
});
