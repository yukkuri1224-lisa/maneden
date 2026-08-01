import type { Metadata } from "next";

import { ArticlePage } from "@/components/common/ArticlePage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "利用規約",
  description: `${siteConfig.name} の利用規約。`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ArticlePage title="利用規約" href="/terms" updated="2026年8月1日">
      <p>
        本規約は、{siteConfig.name}
        （以下「当サイト」）の利用条件を定めるものです。利用者は、本規約に同意のうえ当サイトを利用するものとします。
      </p>

      <h2>提供内容</h2>
      <p>
        当サイトは、税金・経営などに関する各種の計算・シミュレーションツールを無料で提供します。計算結果はすべて概算であり、正確性・完全性を保証するものではありません。
      </p>

      <h2>免責事項</h2>
      <ul>
        <li>
          当サイトの利用によって生じた損害について、運営者は一切の責任を負いません。
        </li>
        <li>
          税制改正・料率変更等により、実際の金額と計算結果が異なる場合があります。
        </li>
        <li>
          当サイトは、予告なく内容の変更・中断・終了を行うことがあります。
        </li>
      </ul>

      <h2>禁止事項</h2>
      <ul>
        <li>法令または公序良俗に違反する行為</li>
        <li>当サイトの運営を妨害する行為</li>
        <li>コンテンツの無断転載・再配布</li>
      </ul>

      <h2>著作権</h2>
      <p>
        当サイトに掲載されている文章・デザイン等の著作権は、運営者または正当な権利者に帰属します。
      </p>

      <h2>規約の変更</h2>
      <p>
        運営者は、必要に応じて本規約を変更することがあります。変更後の規約は、当サイトに掲載した時点から効力を生じます。
      </p>
    </ArticlePage>
  );
}
