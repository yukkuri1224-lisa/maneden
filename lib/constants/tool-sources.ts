/**
 * 各ツールの「計算根拠となる法令・出典」への外部リンク。
 * E-E-A-T（YMYL）の担保のため、トップではなく該当ページへ直接リンクする。
 * 国税庁タックスアンサー等、安定した公式ページのみを掲載する。
 */
export interface ToolSource {
  label: string;
  href: string;
}

export const TOOL_SOURCES: Record<string, ToolSource[]> = {
  "salary-take-home": [
    {
      label: "国税庁 No.1410 給与所得控除",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm",
    },
    {
      label: "国税庁 No.2260 所得税の税率",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm",
    },
  ],
  "bonus-take-home": [
    {
      label: "国税庁 No.2523 賞与に対する源泉徴収",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2523.htm",
    },
  ],
  "furusato-tax": [
    {
      label: "総務省 ふるさと納税ポータル（控除の仕組み）",
      href: "https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html",
    },
  ],
  "freelance-tax": [
    {
      label: "国税庁 No.2210 やさしい必要経費の知識",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2210.htm",
    },
    {
      label: "国税庁 No.2260 所得税の税率",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm",
    },
  ],
  "retirement-tax": [
    {
      label: "国税庁 No.1420 退職金を受け取ったとき",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm",
    },
  ],
  ideco: [
    {
      label: "国税庁 No.1135 小規模企業共済等掛金控除",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm",
    },
    {
      label: "iDeCo公式サイト（国民年金基金連合会）",
      href: "https://www.ideco-koushiki.jp/",
    },
  ],
  nisa: [
    {
      label: "金融庁 NISA特設ウェブサイト",
      href: "https://www.fsa.go.jp/policy/nisa2/",
    },
  ],
  "gift-tax": [
    {
      label: "国税庁 No.4408 贈与税の計算と税率（暦年課税）",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/zoyo/4408.htm",
    },
  ],
  "inheritance-tax": [
    {
      label: "国税庁 No.4152 相続税の計算",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4152.htm",
    },
    {
      label: "国税庁 No.4155 相続税の税率",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4155.htm",
    },
  ],
  mortgage: [
    {
      label: "国税庁 No.1213 住宅借入金等特別控除（住宅ローン控除）",
      href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm",
    },
  ],
  "hourly-wage": [
    {
      label: "厚生労働省 地域別最低賃金の全国一覧",
      href: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/minimumichiran/",
    },
  ],
  "subsidy-finder": [
    {
      label: "中小企業庁 ミラサポplus（補助金・支援制度）",
      href: "https://mirasapo-plus.go.jp/",
    },
  ],
};
