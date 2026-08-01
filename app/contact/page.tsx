import type { Metadata } from "next";

import { ArticlePage } from "@/components/common/ArticlePage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${siteConfig.name} へのお問い合わせについて。`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ArticlePage title="お問い合わせ" href="/contact" updated="2026年8月1日">
      <p>
        {siteConfig.name}
        に関するご意見・ご要望・計算内容の誤りのご指摘などがありましたら、下記のメールアドレスまでお気軽にご連絡ください。
      </p>

      <h2>連絡先</h2>
      <p>
        メール：
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
      <p>
        個人で運営しているため、内容によっては返信までお時間をいただく場合があります。あらかじめご了承ください。
      </p>

      <h2>免責について</h2>
      <p>
        計算結果はあくまで概算です。正確な税額・手続きについては、
        <a href="/about">運営者情報・免責事項</a>
        もあわせてご確認のうえ、税理士等の専門家にご相談ください。
      </p>
    </ArticlePage>
  );
}
