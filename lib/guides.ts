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
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
