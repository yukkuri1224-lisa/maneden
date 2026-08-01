import type {
  BlueReturnDeduction,
  BusinessCategory,
  InvoiceStatus,
} from "@/lib/calculators/freelance-tax";

export const BLUE_OPTIONS: { value: BlueReturnDeduction; label: string }[] = [
  { value: 650_000, label: "65万円（青色・電子申告）" },
  { value: 550_000, label: "55万円（青色）" },
  { value: 100_000, label: "10万円（青色・簡易簿記）" },
  { value: 0, label: "白色申告（0円）" },
];

export const INVOICE_OPTIONS: {
  value: InvoiceStatus;
  label: string;
  short: string;
}[] = [
  { value: "exempt", label: "免税事業者", short: "免税" },
  { value: "simplified-2wari", label: "課税・2割特例", short: "2割特例" },
  { value: "simplified", label: "課税・簡易課税", short: "簡易課税" },
  { value: "general", label: "課税・本則課税", short: "本則" },
];

export const CATEGORY_OPTIONS: { value: BusinessCategory; label: string }[] = [
  { value: 1, label: "第1種 卸売業（みなし90%）" },
  { value: 2, label: "第2種 小売業（みなし80%）" },
  { value: 3, label: "第3種 製造業等（みなし70%）" },
  { value: 4, label: "第4種 その他（みなし60%）" },
  { value: 5, label: "第5種 サービス業等（みなし50%）" },
  { value: 6, label: "第6種 不動産業（みなし40%）" },
];

/** グラフの配色（インディゴ→ブルー→シアン→スカイ→スレート） */
export const CHART_COLORS = {
  netIncome: "#4f46e5", // indigo-600
  incomeTax: "#3b82f6", // blue-500
  residentTax: "#06b6d4", // cyan-500
  nationalHealthInsurance: "#38bdf8", // sky-400
  nationalPension: "#818cf8", // indigo-400
  consumptionTax: "#94a3b8", // slate-400
} as const;
