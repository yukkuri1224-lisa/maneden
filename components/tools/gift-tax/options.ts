import type { GiftType } from "@/lib/calculators/gift-tax";

export const GIFT_TYPE_OPTIONS: { value: GiftType; label: string }[] = [
  {
    value: "special",
    label: "特例贈与（親・祖父母 → 18歳以上の子・孫）",
  },
  {
    value: "general",
    label: "一般贈与（上記以外：夫婦間・兄弟間・未成年の子など）",
  },
];
