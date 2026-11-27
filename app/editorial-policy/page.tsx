import type { Metadata } from "next";
import Link from "next/link";

import { ArticlePage } from "@/components/common/ArticlePage";
import { JsonLd } from "@/components/common/JsonLd";
import {
  author,
  CONTACT_PATH,
  EDITORIAL_POLICY_PATH,
  EDITORIAL_POLICY_UPDATED,
  EDITORIAL_POLICY_UPDATED_ISO,
  METHODOLOGY_PATH,
  reviewer,
} from "@/lib/editorial";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site-config";

const title = "編集方針・制作体制";
const description =
  "まねでんの記事・計算ツールの編集方針。運営体制、情報源の基準（国税庁など一次情報のみ）、制作と確認の流れ、税制改正時の更新、誤りの訂正、広告との関係をまとめています。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: EDITORIAL_POLICY_PATH },
};

export default function EditorialPolicyPage() {
  return (
    <ArticlePage
      title={title}
      href={EDITORIAL_POLICY_PATH}
      updated={EDITORIAL_POLICY_UPDATED}
    >
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          url: `${siteConfig.url}${EDITORIAL_POLICY_PATH}`,
          dateModified: EDITORIAL_POLICY_UPDATED_ISO,
        })}
      />
      <p>
        {siteConfig.name}
        は、税金・社会保険・資産形成など、暮らしのお金に関わる情報と計算ツールを提供しています。お金の情報は読者の判断や生活に直接影響するため、以下の方針で記事とツールを作成・更新しています。
      </p>

      <h2>1. 運営体制</h2>
      <ul>
        <li>
          運営・執筆・ツール開発：<strong>{author.name}</strong>
          （個人運営）。詳しくは<Link href="/about">運営者情報</Link>
          をご覧ください。
        </li>
        <li>
          監修：
          {reviewer ? (
            <>
              <strong>{reviewer.name}</strong>（
              {reviewer.qualifications.join("・")}）
            </>
          ) : (
            <>
              現在、税理士・ファイナンシャルプランナー等の
              <strong>有資格者による監修は受けていません</strong>
              。有資格者の監修を受けた記事には、記事内に監修者の氏名・資格を明記します。
            </>
          )}
        </li>
        <li>
          当サイトの情報は一般的な解説と概算であり、特定の個人に対する税務・投資の助言ではありません。
        </li>
      </ul>

      <h2>2. 情報源の基準</h2>
      <p>
        記事・ツールの根拠には、原則として次の<strong>一次情報</strong>
        のみを使います。個人ブログやまとめサイトなどの二次情報は根拠にしません。
      </p>
      <ul>
        <li>法令（e-Gov法令検索）</li>
        <li>
          国税庁（タックスアンサー・民間給与実態統計調査）、総務省、厚生労働省、金融庁などの公表資料
        </li>
        <li>
          日本年金機構・全国健康保険協会（協会けんぽ）の保険料率・保険料額表
        </li>
        <li>国民年金基金連合会（iDeCo公式サイト）などの制度運営者の公式情報</li>
        <li>企業データは、各社が金融庁のEDINETに提出した有価証券報告書</li>
      </ul>
      <p>
        各記事の末尾には「参考文献」、各ツールの下部には「計算根拠・出典」として、根拠にした公式ページへのリンクを掲載しています。
      </p>

      <h2>3. 制作と確認の流れ</h2>
      <ul>
        <li>
          <strong>調査</strong>
          ：テーマに関わる法令・公的資料を確認し、適用年度を特定します。
        </li>
        <li>
          <strong>執筆・実装</strong>
          ：読者が自分の数字で確かめられるよう、記事には関連する計算ツールを、ツールには計算の前提と根拠を添えます。
        </li>
        <li>
          <strong>照合</strong>
          ：税率・控除額・保険料率などの数値は、公開前に公式資料と1つずつ照合します。計算ツールは自動テストで結果を検証しています（方法は
          <Link href={METHODOLOGY_PATH}>計算方法と検証</Link>
          に掲載）。
        </li>
        <li>
          <strong>公開</strong>
          ：公開日・最終更新日をページに表示します。
        </li>
      </ul>

      <h2>4. 更新の方針</h2>
      <ul>
        <li>
          社会保険料率（毎年3月・4月の改定）や税制改正は、公表後に該当するツールと記事へ反映し、各ツールに反映した年度を明記します。
        </li>
        <li>
          すべての記事・ツールを少なくとも年1回見直し、制度の変更がないかを確認します。
        </li>
        <li>
          内容を変更していないのに更新日だけを新しくすることはしません。記事の主な変更は「更新履歴」に記録します。
        </li>
      </ul>

      <h2>5. 誤りの訂正</h2>
      <ul>
        <li>
          内容の誤りや古い情報のご指摘は
          <Link href={CONTACT_PATH}>お問い合わせ</Link>
          で受け付けています。
        </li>
        <li>
          ご指摘を受けたら一次情報で事実を確認し、誤りであれば速やかに修正します。
        </li>
        <li>
          計算結果や結論が変わる訂正は、該当記事の更新履歴に「訂正：」として内容と日付を記録します。
        </li>
      </ul>

      <h2>6. 広告と編集の独立</h2>
      <ul>
        <li>
          当サイトは、Google AdSense
          などの広告とアフィリエイトプログラムの収益で運営しています。
        </li>
        <li>
          広告主・提携先が記事の内容や計算結果、ランキングの順位に関与することはありません。計算ロジックは広告の有無によって変えません。
        </li>
        <li>アフィリエイト等の広告を含む部分には「PR」と表示します。</li>
      </ul>

      <h2>7. 入力データの取り扱い</h2>
      <p>
        計算ツールに入力した金額などの情報は、すべてお使いのブラウザ内で処理し、外部サーバーへ送信・保存しません。詳しくは
        <Link href="/privacy-policy">プライバシーポリシー</Link>
        をご覧ください。
      </p>

      <h2>8. お問い合わせ</h2>
      <p>
        本方針や掲載内容に関するご意見は、
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        までお寄せください。
      </p>
    </ArticlePage>
  );
}
