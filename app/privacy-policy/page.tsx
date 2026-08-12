import type { Metadata } from "next";

import { ArticlePage } from "@/components/common/ArticlePage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${siteConfig.name} における個人情報・Cookie の取り扱いについて。`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <ArticlePage
      title="プライバシーポリシー"
      href="/privacy-policy"
      updated="2026年8月1日"
    >
      <p>
        {siteConfig.name}
        （以下「当サイト」）は、利用者のプライバシーを尊重し、以下の方針で個人情報等を取り扱います。
      </p>

      <h2>入力データの取り扱い</h2>
      <p>
        当サイトの計算ツールに入力された売上・経費などの数値は、
        <strong>すべて利用者のブラウザ内で処理</strong>
        され、当サイトのサーバーへ送信・保存されることはありません。
      </p>

      <h2>アクセス解析について</h2>
      <p>
        当サイトでは、利用状況の把握のために Vercel Analytics と Google
        アナリティクス（GA4）を利用しています。
      </p>
      <p>
        Vercel Analytics は<strong>Cookie を使用せず</strong>
        、個人を特定できる情報も収集しません。ページの表示回数や表示速度などの統計情報のみを匿名で集計します。
      </p>
      <p>
        Google アナリティクスは、トラフィックデータの収集のために
        <strong>Cookie を使用</strong>
        します。このデータは匿名で収集されており、個人を特定するものではありません。収集された情報は
        Google
        社のプライバシーポリシーに基づいて管理されます。データが収集・処理される仕組みについては{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google のポリシーと規約
        </a>
        をご確認ください。ブラウザの設定や{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout?hl=ja"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google アナリティクス オプトアウト アドオン
        </a>
        により、収集を無効化することもできます。
      </p>

      <h2>広告について</h2>
      <p>
        当サイトは、第三者配信の広告サービス（
        <strong>Google AdSense</strong>
        など）を利用しており、Cookie
        を使用して利用者の興味に応じた広告を配信する場合があります。第三者配信事業者が
        Cookie を使用することで、当サイトや他サイトへの
        アクセス情報に基づいた広告を表示できます。
      </p>
      <p>
        Google
        などの第三者配信事業者による広告のパーソナライズ（Cookieの使用）は、
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          広告設定
        </a>
        から無効にできます。また、
        <a
          href="https://www.aboutads.info/choices/"
          target="_blank"
          rel="noopener noreferrer"
        >
          aboutads.info
        </a>
        では、参加している第三者配信事業者の Cookie
        を一括で無効化できます。Google
        がどのように広告で情報を使用するかについては、
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google の広告に関するポリシー
        </a>
        をご確認ください。
      </p>
      <p>
        このほか、当サイトはアフィリエイトプログラムを利用する場合があります。広告部分には「PR」と表示します。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        本ポリシーに関するお問い合わせは、
        <a href="/contact">お問い合わせページ</a>よりご連絡ください。
      </p>

      <h2>改定について</h2>
      <p>
        本ポリシーは、法令の改正や本サイトの変更に応じて、予告なく改定することがあります。改定後の内容は本ページに掲載した時点から適用されます。
      </p>
    </ArticlePage>
  );
}
