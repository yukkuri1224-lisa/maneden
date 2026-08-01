import type { SubsidyProgram } from "@/lib/calculators/subsidy-finder/types";

/**
 * 主要な補助金・助成金の静的データ（2026年時点の概算）。
 *
 * ⚠️ 補助金は毎年、公募回ごとに制度内容・補助率・上限額・要件が変わる。
 *    ここの数値はすべて「概算・要確認」であり、申請前に必ず公式サイトで最新情報を確認すること。
 */
export const SUBSIDY_PROGRAMS: SubsidyProgram[] = [
  {
    id: "it-donyu",
    name: "IT導入補助金",
    purposes: ["it"],
    subsidyRateMin: 0.5,
    subsidyRateMax: 0.75,
    maxAmount: 4_500_000,
    smallBusinessOnly: false,
    difficulty: "mid",
    summary:
      "会計・受発注・決済などの ITツール導入費用を補助。中小企業・小規模事業者が対象。",
    url: "https://it-shien.smrj.go.jp/",
  },
  {
    id: "monodukuri",
    name: "ものづくり補助金",
    purposes: ["equipment", "restructuring"],
    subsidyRateMin: 0.5,
    subsidyRateMax: 0.67,
    maxAmount: 12_500_000,
    smallBusinessOnly: false,
    difficulty: "high",
    summary:
      "革新的な製品・サービス開発や生産プロセス改善のための設備投資を支援。事業計画の作り込みが必要。",
    url: "https://portal.monodukuri-hojo.jp/",
  },
  {
    id: "jizokuka",
    name: "小規模事業者持続化補助金",
    purposes: ["sales-channel", "equipment"],
    subsidyRateMin: 0.67,
    subsidyRateMax: 0.67,
    maxAmount: 2_000_000,
    smallBusinessOnly: true,
    smallBusinessEmployeeMax: 20,
    difficulty: "mid",
    summary:
      "販路開拓や広報・チラシ・ウェブ制作などを支援。小規模事業者（従業員おおむね20人以下）が対象。",
    url: "https://mirasapo-plus.go.jp/",
  },
  {
    id: "saikouchiku",
    name: "事業再構築補助金",
    purposes: ["restructuring", "equipment"],
    subsidyRateMin: 0.5,
    subsidyRateMax: 0.67,
    maxAmount: 30_000_000,
    smallBusinessOnly: false,
    difficulty: "high",
    summary:
      "新分野展開・業態転換など思い切った事業再構築を支援。補助額は大きいが要件・審査は厳しめ。",
    url: "https://jigyou-saikouchiku.go.jp/",
  },
  {
    id: "sougyou",
    name: "創業・地域スタートアップ支援",
    purposes: ["startup"],
    subsidyRateMin: 0.5,
    subsidyRateMax: 0.5,
    maxAmount: 2_000_000,
    smallBusinessOnly: false,
    difficulty: "mid",
    summary:
      "創業時の経費を支援する制度の総称。内容は自治体により大きく異なるため、所在地の制度を要確認。",
    url: "https://j-net21.smrj.go.jp/",
  },
  {
    id: "gyomu-kaizen",
    name: "業務改善助成金",
    purposes: ["wage-hike", "equipment"],
    subsidyRateMin: 0.75,
    subsidyRateMax: 0.9,
    maxAmount: 6_000_000,
    smallBusinessOnly: false,
    difficulty: "mid",
    summary:
      "事業場内の最低賃金引き上げと設備投資をセットで行う中小企業を支援（厚生労働省）。",
    url: "https://www.mhlw.go.jp/",
  },
];
