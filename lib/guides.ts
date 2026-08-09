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
    updated: "2026年8月10日",
    publishedISO: "2026-08-10",
    updatedISO: "2026-08-10",
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
