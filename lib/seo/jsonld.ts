/**
 * JSON-LD 構造化データ生成ヘルパー。
 * REQUIREMENTS 3.3 / 5.1 に準拠（BreadcrumbList / WebApplication / FAQPage）。
 */

import { siteConfig } from "@/lib/site-config";

export interface BreadcrumbJsonLdItem {
  name: string;
  /** 絶対 URL */
  url: string;
}

export function breadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface WebApplicationJsonLdParams {
  name: string;
  description: string;
  /** 絶対 URL */
  url: string;
}

export function webApplicationJsonLd(params: WebApplicationJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: params.name,
    description: params.description,
    url: params.url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
  };
}

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

export function faqJsonLd(items: FaqJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface ItemListEntry {
  name: string;
  /** 絶対 URL */
  url: string;
}

/** ランキング・一覧を表す ItemList 構造化データ */
export function itemListJsonLd(items: ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/** サイト全体を表す WebSite 構造化データ */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "ja",
  };
}

/** サイト運営者（発行者）を表す Organization 構造化データ */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    email: siteConfig.email,
  };
}

export interface DatasetJsonLdParams {
  name: string;
  description: string;
  /** 絶対 URL */
  url: string;
  keywords?: string[];
}

/** データセット（企業年収データ群など）を表す Dataset 構造化データ */
export function datasetJsonLd(params: DatasetJsonLdParams) {
  const publisher = {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  };
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: params.name,
    description: params.description,
    url: params.url,
    keywords: params.keywords,
    inLanguage: "ja",
    isAccessibleForFree: true,
    // Google の Dataset 推奨項目。利用条件は当サイトの利用規約に従う。
    license: `${siteConfig.url}/terms`,
    creator: publisher,
    publisher,
  };
}

export interface ArticleJsonLdParams {
  headline: string;
  description: string;
  /** 絶対 URL */
  url: string;
  /** 公開日（ISO） */
  datePublished: string;
  /** 更新日（ISO） */
  dateModified: string;
}

/** ガイド記事を表す Article 構造化データ */
export function articleJsonLd(params: ArticleJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    url: params.url,
    mainEntityOfPage: params.url,
    datePublished: params.datePublished,
    dateModified: params.dateModified,
    inLanguage: "ja",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.svg`,
      },
    },
  };
}
