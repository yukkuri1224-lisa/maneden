import type { Metadata } from "next";
import Link from "next/link";

import { ArticlePage } from "@/components/common/ArticlePage";
import { JsonLd } from "@/components/common/JsonLd";
import rates from "@/config/rates/reiwa8.json";
import { EDITORIAL_POLICY_PATH, METHODOLOGY_PATH } from "@/lib/editorial";
import { TAX_YEAR } from "@/lib/constants/tax-tables";
import { TOOL_SOURCES } from "@/lib/constants/tool-sources";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";
import { tools } from "@/lib/tools-registry";

const title = "計算方法と検証";
const description =
  "まねでんの計算ツールが使う税率・保険料率データの出典と取得日、計算結果を検証する方法（公式の保険料額表との照合・自動テスト）、計算の前提と限界をまとめています。";

const UPDATED = "2026年11月27日";
const UPDATED_ISO = "2026-11-27";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: METHODOLOGY_PATH,
});

/** config/rates の各セクションから「出典・URL・取得日」を抜き出す */
function rateSources() {
  return Object.entries(rates)
    .filter(([key]) => key !== "_meta")
    .map(([, value]) => (value as { _meta?: Record<string, unknown> })._meta)
    .filter(
      (m): m is { source: string; sourceUrl: string; acquiredDate: string } =>
        typeof m?.source === "string" && typeof m?.sourceUrl === "string",
    );
}

export default function MethodologyPage() {
  const reiwaYear = TAX_YEAR - 2018;
  const liveTools = tools.filter((t) => t.status === "live");

  return (
    <ArticlePage title={title} href={METHODOLOGY_PATH} updated={UPDATED}>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          url: `${siteConfig.url}${METHODOLOGY_PATH}`,
          dateModified: UPDATED_ISO,
        })}
      />
      <p>
        {siteConfig.name}
        の計算ツールが、どのデータを使い、どのように結果の正しさを確かめているかを公開します。制作全体の方針は
        <Link href={EDITORIAL_POLICY_PATH}>編集方針・制作体制</Link>
        をご覧ください。
      </p>

      <h2>適用している年度</h2>
      <p>
        税金・社会保険のツールは、
        <strong>
          {TAX_YEAR}年度（令和{reiwaYear}年度）
        </strong>
        の税制・料率で計算しています。料率は年度ごとのデータファイルに分けて管理し、改定時はファイルを差し替えて反映します。推測値は使いません。
      </p>

      <h2>税率・保険料率データの出典と取得日</h2>
      <ul>
        {rateSources().map((m) => (
          <li key={`${m.source}-${m.sourceUrl}`}>
            <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer">
              {m.source}
            </a>
            （取得日: {m.acquiredDate}）
          </li>
        ))}
      </ul>

      <h2>計算結果の検証方法</h2>
      <ul>
        <li>
          <strong>公式資料との照合</strong>
          ：健康保険料率は協会けんぽ公式の保険料額表から抽出し、47都道府県すべてで掲載値と一致することを確認しています。
        </li>
        <li>
          <strong>自動テスト</strong>
          ：各ツールの計算ロジックには、国税庁の税率表などから手計算した値と結果を照らし合わせる自動テストを用意し、変更のたびに実行しています。
        </li>
        <li>
          <strong>改修前後の比較</strong>
          ：手取り計算は、年収100万〜3,000万円（50万円刻み）×扶養0〜3人の全パターンの結果を記録し、ロジックを変えたときに意図しない変化がないかを確認しています。
        </li>
      </ul>

      <h2>計算の前提と限界</h2>
      <p>
        すべてのツールの結果は<strong>概算</strong>
        です。各ツールの下部に、そのツール固有の前提（考慮していない控除や特例など）を記載しています。実際の申告・手続きでは、税務署・自治体・年金事務所などの公的機関や、税理士等の専門家にご確認ください。
      </p>

      <h2>ツールごとの計算根拠</h2>
      <ul>
        {liveTools.map((tool) => {
          const sources = TOOL_SOURCES[tool.id] ?? [];
          return (
            <li key={tool.id}>
              <Link href={tool.href}>{tool.title}</Link>
              {sources.length > 0 && (
                <>
                  ：
                  {sources.map((s, i) => (
                    <span key={s.href}>
                      {i > 0 && "／"}
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.label}
                      </a>
                    </span>
                  ))}
                </>
              )}
            </li>
          );
        })}
      </ul>

      <h2>誤りを見つけたら</h2>
      <p>
        計算結果の誤りは<Link href="/contact">お問い合わせ</Link>
        からお知らせください。入力した条件（年収・家族構成など）と、比較した公式の金額を添えていただけると、確認が早くなります。
      </p>
    </ArticlePage>
  );
}
