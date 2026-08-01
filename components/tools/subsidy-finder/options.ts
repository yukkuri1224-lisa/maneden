import type { Difficulty, Purpose } from "@/lib/calculators/subsidy-finder";

export const PURPOSE_OPTIONS: { value: Purpose; label: string }[] = [
  { value: "it", label: "IT・デジタル導入" },
  { value: "equipment", label: "設備投資" },
  { value: "sales-channel", label: "販路開拓・広報" },
  { value: "restructuring", label: "新分野・業態転換" },
  { value: "startup", label: "創業・スタートアップ" },
  { value: "wage-hike", label: "賃上げ・雇用" },
];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  low: "易しめ",
  mid: "普通",
  high: "難しめ",
};

export const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  mid: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  high: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};
