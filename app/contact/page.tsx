import type { Metadata } from "next";

import { ArticlePage } from "@/components/common/ArticlePage";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "お問い合わせ",
  description:
    "まねでんへのお問い合わせ窓口。計算結果の誤りの報告、ツールへの要望、掲載データの修正依頼などはメールで受け付けています。",
  path: "/contact",
});

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

      <h2>内容の誤りを報告するとき</h2>
      <p>
        記事や計算結果の誤りのご指摘は、次の内容を添えていただけると確認が早くなります。確認のうえ速やかに訂正し、記事の更新履歴に記録します（
        <a href="/editorial-policy">編集方針</a>）。
      </p>
      <ul>
        <li>該当ページのURL</li>
        <li>誤りと思われる箇所（ツールの場合は入力した条件）</li>
        <li>正しいと考えられる内容と、その根拠（公的機関のページなど）</li>
      </ul>

      <h2>免責について</h2>
      <p>
        計算結果はあくまで概算です。正確な税額・手続きについては、
        <a href="/about">運営者情報・免責事項</a>
        もあわせてご確認のうえ、税理士等の専門家にご相談ください。
      </p>
    </ArticlePage>
  );
}
