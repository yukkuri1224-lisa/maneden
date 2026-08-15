import type { Metadata } from "next";

import { ArticlePage } from "@/components/common/ArticlePage";
import { TAX_YEAR } from "@/lib/constants/tax-tables";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "免責事項",
  description: `${siteConfig.name} の計算結果の取り扱い・出典・適用年度に関する免責事項。`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  const reiwaYear = TAX_YEAR - 2018;

  return (
    <ArticlePage title="免責事項" href="/disclaimer" updated="2026年8月12日">
      <p>
        {siteConfig.name}
        （以下「当サイト」）が提供する計算ツール・記事・企業データをご利用いただく前に、以下の内容をご確認ください。
      </p>

      <h2>計算結果はすべて概算です</h2>
      <ul>
        <li>
          当サイトの各ツールが表示する税額・手取り額・控除上限額などは、一般的な前提に基づく
          <strong>概算</strong>
          であり、実際に課税・控除される金額を保証するものではありません。
        </li>
        <li>
          実際の税額・保険料は、収入の種類、各種所得控除・税額控除の有無、扶養状況、居住する自治体、加入する健康保険（協会けんぽ・組合健保・国民健康保険など）の料率によって変わります。
        </li>
        <li>
          当サイトの情報を利用したことによって生じたいかなる損害についても、運営者は一切の責任を負いかねます。
        </li>
      </ul>

      <h2>税務判断は専門家・税務署へご相談ください</h2>
      <ul>
        <li>
          運営者は
          <strong>税理士ではありません</strong>
          。当サイトの計算ツール・記事は
          <strong>税理士・税理士法人による監修を受けていません</strong>
          。特定の個人の状況に対する税務・法務・投資の助言や税務相談ではありません。
        </li>
        <li>
          確定申告・納税・相続・贈与などの具体的な手続きや判断にあたっては、
          <strong>税理士等の専門家、または所轄の税務署</strong>
          に必ずご確認ください。
        </li>
        <li>
          当サイトは「必ず節税になる」等の断定的な効果を保証するものではありません。
        </li>
      </ul>

      <h2>出典と適用年度</h2>
      <ul>
        <li>
          税金・手取り計算の各ツールは、原則として
          <strong>
            {TAX_YEAR}年度（令和{reiwaYear}年度）
          </strong>
          の税制・料率をもとにしています。各ツール下部に最終更新日と、計算根拠となる
          <a
            href="https://www.nta.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            国税庁
          </a>
          ・
          <a
            href="https://www.soumu.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            総務省
          </a>
          等の該当ページへのリンクを掲載しています。
        </li>
        <li>
          企業の平均年収データは、各社が金融庁の開示システム
          <a
            href="https://disclosure2.edinet-fsa.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            EDINET
          </a>
          に提出した<strong>有価証券報告書</strong>
          の公開情報に基づく概算です。最新・正確な値は各社の有価証券報告書でご確認ください。
        </li>
        <li>
          税制・料率・統計は改定されるため、閲覧時点で最新の情報と異なる場合があります。
        </li>
      </ul>

      <h2>お問い合わせ</h2>
      <p>
        計算内容の誤りのご指摘や本免責事項に関するお問い合わせは、
        <a href="/contact">お問い合わせページ</a>
        よりご連絡ください。運営者情報は
        <a href="/about">運営者情報</a>
        をご覧ください。
      </p>
    </ArticlePage>
  );
}
