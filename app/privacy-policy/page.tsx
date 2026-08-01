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
        当サイトでは、利用状況の把握のためにアクセス解析ツール（Google Analytics
        等）を利用する場合があります。これらは Cookie
        を使用してトラフィックデータを収集しますが、個人を特定する情報は含みません。ブラウザの設定により
        Cookie を無効化することで、収集を拒否できます。
      </p>

      <h2>広告について</h2>
      <p>
        当サイトは、第三者配信の広告サービスやアフィリエイトプログラムを利用する場合があります。これらの事業者が
        Cookie を用いて利用者の興味に応じた広告を表示することがあります。
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
