import type { Metadata } from "next";

import { ArticlePage } from "@/components/common/ArticlePage";
import { JsonLd } from "@/components/common/JsonLd";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "運営者情報・免責事項",
  description: `${siteConfig.name} の運営者情報・データの出典・免責事項について。`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ArticlePage
      title="運営者情報・免責事項"
      href="/about"
      updated="2026年8月6日"
    >
      <JsonLd data={organizationJsonLd()} />
      <p>
        {siteConfig.name}{" "}
        は、フリーランス・個人事業主・ビジネスパーソンが、税金や経営に関する「いくら？」をすばやく把握できるよう、登録不要・無料の計算ツールを提供する、個人運営のサイトです。
      </p>

      <h2>運営者</h2>
      <p>
        本サイトは個人（ハンドルネーム：まねでん運営）が運営しています。運営者は
        <strong>
          税理士・ファイナンシャルプランナー等の有資格者ではありません
        </strong>
        。当サイトの情報は一般的な計算・解説であり、特定の個人に対する税務・投資の助言ではありません。
      </p>
      <ul>
        <li>
          連絡先：
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </li>
      </ul>
      <p>
        本サイトは無料の情報・計算ツールの提供とアフィリエイト広告のみで運営しており、利用者への商品・サービスの直接販売は行っていません。そのため、所在地・電話番号は掲載していません。ご連絡は上記メールまでお願いします。
      </p>

      <h2>運営方針</h2>
      <ul>
        <li>
          入力した金額などの情報は、すべてブラウザ内で処理し、外部サーバーへ送信・保存しません。
        </li>
        <li>
          計算の根拠や用語をできるだけ明示し、結果に納得して使えることを重視します。
        </li>
      </ul>

      <h2>データの出典</h2>
      <ul>
        <li>
          <strong>企業の平均年収</strong>：各社が金融庁の開示システム
          <a
            href="https://disclosure2.edinet-fsa.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            EDINET
          </a>
          に提出した<strong>有価証券報告書</strong>
          の「平均年間給与」等の公開情報をもとに掲載しています。最新・正確な値は各社の有価証券報告書でご確認ください。
        </li>
        <li>
          <strong>税率・控除・全国平均給与</strong>：
          <a
            href="https://www.nta.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            国税庁
          </a>
          の公表資料（民間給与実態統計調査など）や各種公的情報を参照しています。税制は毎年改定されるため、各ツールに反映年度を明記しています。
        </li>
      </ul>

      <h2>免責事項</h2>
      <ul>
        <li>
          本サイトの計算結果はすべて<strong>概算</strong>
          であり、正確な税額・金額を保証するものではありません。
        </li>
        <li>
          税制や保険料率は毎年改定され、また自治体によって異なります。実際の申告・手続きにあたっては、税理士等の専門家や公的機関にご確認ください。
        </li>
        <li>
          本サイトの情報の利用によって生じたいかなる損害についても、運営者は責任を負いかねます。
        </li>
      </ul>

      <h2>広告について</h2>
      <p>
        本サイトは、第三者が提供するアフィリエイトプログラム等による広告を掲載する場合があります。広告部分には「PR」と表示します。
      </p>
    </ArticlePage>
  );
}
