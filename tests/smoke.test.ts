import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("複数のクラス名を結合する", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("競合する Tailwind クラスは後勝ちでマージする", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("falsy な値は無視する", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});
