export interface GuideSource {
  label: string;
  /** 一次情報（公的機関・法令・公式サイト）の URL */
  href: string;
}

export interface GuideRevision {
  /** 表示用の日付（例: 2026年11月27日） */
  date: string;
  /** 何を変えたか（誤りの訂正は「訂正：」で始める） */
  note: string;
}

/**
 * ガイド記事（pillar コンテンツ）の一元管理レジストリ。
 * 一覧ページ / sitemap / 関連導線はこの配列を唯一の情報源として参照する。
 */
export interface Guide {
  slug: string;
  href: string;
  /** SEO・H1 用のフルタイトル */
  title: string;
  /** カード・ナビ用の短いタイトル */
  shortTitle: string;
  description: string;
  /** 読了時間の目安（分） */
  readingMinutes: number;
  /** 表示用の更新日（例: 2026年8月10日） */
  updated: string;
  /** 公開日（ISO・JSON-LD 用） */
  publishedISO: string;
  /** 更新日（ISO・JSON-LD / sitemap 用） */
  updatedISO: string;
  /** 参考文献（記事の根拠にした一次情報）。YMYL のため必須 */
  sources: GuideSource[];
  /** 更新・訂正の履歴（新しい順） */
  revisions: GuideRevision[];
}

export const guides: Guide[] = [
  {
    slug: "ideco-vs-nisa",
    href: "/guides/ideco-vs-nisa",
    title: "iDeCoと新NISA、どっちから始める？併用のメリットと使い分け",
    shortTitle: "iDeCoと新NISA、どっちから？",
    description:
      "iDeCoと新NISAの違いを比較表でわかりやすく整理。どちらから始めるべきか、併用するメリットと注意点、会社員の使い分けまで、シミュレーターで数字を確かめながら解説します。",
    readingMinutes: 6,
    updated: "2026年8月10日",
    publishedISO: "2026-08-10",
    updatedISO: "2026-08-10",
    sources: [
      {
        label: "金融庁 NISA特設ウェブサイト",
        href: "https://www.fsa.go.jp/policy/nisa2/",
      },
      {
        label: "iDeCo公式サイト（国民年金基金連合会）",
        href: "https://www.ideco-koushiki.jp/",
      },
      {
        label: "国税庁 No.1135 小規模企業共済等掛金控除",
        href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm",
      },
      {
        label: "国税庁 No.2260 所得税の税率",
        href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm",
      },
    ],
    revisions: [{ date: "2026年8月10日", note: "公開" }],
  },
  {
    slug: "furusato-nouzei",
    href: "/guides/furusato-nouzei",
    title: "ふるさと納税とは？仕組み・限度額・やり方をやさしく解説",
    shortTitle: "ふるさと納税の仕組み",
    description:
      "ふるさと納税の仕組み（実質2,000円で返礼品と税の控除）、限度額の決まり方、やり方（ワンストップ特例・確定申告）、注意点をやさしく解説。自分の上限額はシミュレーターで確認できます。",
    readingMinutes: 5,
    updated: "2026年8月10日",
    publishedISO: "2026-08-10",
    updatedISO: "2026-08-10",
    sources: [
      {
        label: "総務省 ふるさと納税ポータル（控除の仕組み）",
        href: "https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html",
      },
      {
        label: "国税庁 No.2260 所得税の税率",
        href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm",
      },
      {
        label: "国税庁 No.1410 給与所得控除",
        href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm",
      },
    ],
    revisions: [{ date: "2026年8月10日", note: "公開" }],
  },
  {
    slug: "kaishain-tedori",
    href: "/guides/kaishain-tedori",
    title: "会社員の手取りはどう決まる？額面との違いと計算方法を解説",
    shortTitle: "会社員の手取りの決まり方",
    description:
      "額面（年収）と手取りの違い、給料から引かれる社会保険料・所得税・住民税の中身、手取りの目安、手取りを増やす方法をやさしく解説。自分の手取りはシミュレーターで計算できます。",
    readingMinutes: 5,
    updated: "2026年8月10日",
    publishedISO: "2026-08-10",
    updatedISO: "2026-08-10",
    sources: [
      {
        label: "国税庁 No.1410 給与所得控除",
        href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm",
      },
      {
        label: "国税庁 No.2260 所得税の税率",
        href: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm",
      },
      {
        label: "協会けんぽ 令和8年度 都道府県別 健康保険・介護保険料率",
        href: "https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08/index.html",
      },
      {
        label: "日本年金機構 厚生年金保険料額表",
        href: "https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku/ryogakuhyo/index.html",
      },
      {
        label: "厚生労働省 令和8年度 雇用保険料率",
        href: "https://jsite.mhlw.go.jp/tokyo-hellowork/list/tachikawa/kyushokusha/koyouhokenryouritu08.html",
      },
    ],
    revisions: [{ date: "2026年8月10日", note: "公開" }],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
