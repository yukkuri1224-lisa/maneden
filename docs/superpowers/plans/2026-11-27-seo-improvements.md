# まねでん SEO 改善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 監査で見つかった OGP 欠落・企業ページの孤立・構造化データの重複/不足・メタの不備を直し、全ページが検索と共有の両方で正しく見えるようにする。

**Architecture:** メタデータ生成を `lib/seo/metadata.ts` の 1 関数に集約し、全ページがそれ経由で title/description/canonical/openGraph/twitter を出す。OGP 画像はルートの描画処理を `lib/seo/og-image.tsx` に切り出し、ツール・ガイドの各セグメントに `opengraph-image.tsx` を置く。企業一覧は軽量な表示用型をクライアントに渡し、業種ハブにサーバー描画の全社リンク一覧を追加する。

**Tech Stack:** Next.js 16 App Router / React 19 / TypeScript strict / Vitest / next/og (ImageResponse)

**Spec:** `docs/superpowers/specs/2026-11-27-seo-audit.md`

## Global Constraints

- パッケージマネージャは pnpm。検証コマンドは `pnpm test` / `pnpm run typecheck` / `pnpm run lint` / `pnpm build`。
- 文言はすべて日本語。サイト名は `siteConfig.name`（"まねでん"）を使い、ハードコードしない。
- 絶対 URL は `siteConfig.url` から作る。canonical はパス（例 `"/tools"`）で渡し `metadataBase` に解決させる（既存方式）。
- 個別企業ページ（`/companies/[slug]`）はサイトマップに追加しない（運営方針）。
- `components/ui/` は編集しない。
- 新しい依存パッケージは追加しない。
- 計算ロジック（`lib/calculators/`）と既存テストの期待値は変更しない。
- コミットメッセージは既存の形式（`feat(seo): …` など日本語）に合わせる。

## Review Focus

- 動的ルート（`/take-home/[income]`, `/furusato/[income]`, `/companies/[slug]`, `/companies/industry/[slug]`）の `generateMetadata` も新ヘルパーを通り、og:url がそのページ自身の URL になること。
- ページ固有の `opengraph-image.tsx` がないページでも og:image（ルート画像）が出ること。
- 業種ハブの全社リンク一覧が、インタラクティブな一覧（検索・ページング）の動作を壊さないこと。
- ガイドの title からブランド重複を消しても、og:title は記事見出しのまま（ブランドなし）であること。
- ビルド時に OGP 画像を 17 枚追加生成しても `pnpm build` が通ること（Google Fonts 取得の失敗時はビルド失敗ではなく既定フォントにフォールバック）。

---

### Task 1: メタデータヘルパーと全ページへの適用（担当: メタデータ）

**Files:**

- Create: `lib/seo/metadata.ts`
- Create: `tests/seo/metadata.test.ts`
- Modify: `lib/site-config.ts`（description 更新）
- Modify: `app/robots.ts`（`host` 削除）
- Modify: `app/layout.tsx`（ルート openGraph/twitter もヘルパー由来の値に）
- Modify: `metadata` / `generateMetadata` を持つ全 `app/**/page.tsx`（トップ、/tools と各ツール 14、/companies・業種ハブ・企業ページ、/guides と各ガイド 3、/take-home・/furusato とその動的ルート、about/disclaimer/privacy-policy/terms/contact）

**Interfaces:**

- Produces:

  ```ts
  export interface PageMetadataParams {
    title: string; // <title> 用（テンプレートで「 | まねでん」が付く）
    description: string;
    path: string; // "/" 始まり。canonical と og:url に使う
    ogTitle?: string; // 省略時 title
    type?: "website" | "article"; // 既定 "website"
    publishedTime?: string; // article のとき ISO
    modifiedTime?: string;
  }
  export function pageMetadata(p: PageMetadataParams): Metadata;
  export const DEFAULT_OG_IMAGE = "/opengraph-image";
  ```

  戻り値: `title`, `description`, `alternates.canonical = path`, `openGraph = { type, locale: "ja_JP", siteName, url: siteConfig.url + (path === "/" ? "" : path), title: ogTitle ?? title, description, images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: ogTitle ?? title }], publishedTime?, modifiedTime? }`, `twitter = { card: "summary_large_image", title: ogTitle ?? title, description, images: [DEFAULT_OG_IMAGE] }`。

- [ ] **Step 1: 失敗するテストを書く** — `tests/seo/metadata.test.ts`
  - `pageMetadata({title:"ツール一覧", description:"d", path:"/tools"})` の `openGraph.url === "https://maneden.com/tools"`、`openGraph.siteName === "まねでん"`、`openGraph.locale === "ja_JP"`、`openGraph.type === "website"`、`alternates.canonical === "/tools"`、`twitter.card === "summary_large_image"`、`openGraph.images[0].url === "/opengraph-image"`。
  - `path:"/"` のとき `openGraph.url === "https://maneden.com"`。
  - `ogTitle` 指定時は `openGraph.title` と `twitter.title` が ogTitle、`title` は元の title。
  - `type:"article", publishedTime:"2026-08-01"` のとき `openGraph.type === "article"` かつ `publishedTime` が入る。
- [ ] **Step 2:** `pnpm test tests/seo/metadata.test.ts` → FAIL（モジュールなし）
- [ ] **Step 3:** `lib/seo/metadata.ts` を実装。
- [ ] **Step 4:** テスト PASS を確認。
- [ ] **Step 5: サイト全体に適用**
  - 全ページの `metadata` / `generateMetadata` を `pageMetadata(...)` に置き換える。既存の title/description/canonical/og:title の文言は変えない（下記の指定箇所を除く）。既存 `openGraph.type: "article"` のページは `type: "article"` を渡す。
  - トップ: `title` は layout の default を使うため、`pageMetadata` の結果から `title` を除いて使う（`const { title: _t, ...rest } = pageMetadata({ title: <layout default と同じ文字列>, ... })` 等）。og:title は「まねでん｜税金・手取り・経営・不動産の無料計算ツール」。
  - ガイド 3 本: title の末尾「｜まねでん」を削除（テンプレートで付くため）。ogTitle は `guide.title`。
  - description を以下に差し替え:
    - /about: 「まねでんの運営者情報。運営方針、計算ロジックと税率データの出典（国税庁・EDINET など）、更新方針、免責事項、お問い合わせ先をまとめています。」
    - /disclaimer: 「まねでんの免責事項。計算結果は概算であり税務・法務の助言ではないこと、税制改正への対応方針、外部リンクや広告についての考え方を説明します。」
    - /privacy-policy: 「まねでんのプライバシーポリシー。入力した金額はブラウザ内で計算し送信・保存しないこと、アクセス解析（Google Analytics）と広告（Google AdSense）での Cookie の扱いを説明します。」
    - /terms: 「まねでんの利用規約。登録不要・無料で使える計算ツールと企業年収データの利用条件、禁止事項、免責、規約の変更について定めています。」
    - /contact: 「まねでんへのお問い合わせ窓口。計算結果の誤りの報告、ツールへの要望、掲載データの修正依頼などはメールで受け付けています。」
  - `lib/site-config.ts` の `description` を「年収の手取り・ふるさと納税の上限・退職金や贈与税まで、税金とお金の計算が登録不要・完全無料で完結。会社員もフリーランスも使えるシミュレーターと上場企業の平均年収データを収録。」に変更（トップの description と同趣旨、ツール数は入れない）。
  - `app/layout.tsx` の openGraph/twitter: title を layout の default title と同じ文字列に、url はそのまま、`images` は指定しない（ルートの opengraph-image ファイルが付く）。
  - `app/robots.ts` から `host` を削除。
- [ ] **Step 6: 検証** — `pnpm run typecheck && pnpm run lint && pnpm test && pnpm build` が通る。ビルド後、次を確認:
      `grep -o '<meta property="og:[a-z:_]*" content="[^"]*"' .next/server/app/about.html` に og:url=`https://maneden.com/about`・og:image・og:site_name が出る。`.next/server/app/tools/nisa.html` と `.next/server/app/take-home/500.html` と `.next/server/app/guides/furusato-nouzei.html` に og:image・og:site_name・twitter:image が出る。ガイドの `<title>` に「まねでん」が 1 回だけ。`grep -c Host .next/server/app/robots.txt.body`（または `/robots.txt` 相当の出力）が 0。
- [ ] **Step 7: コミット** `feat(seo): メタデータ生成を共通化し全ページの OGP・Twitter カードを補完`

### Task 2: ページ別 OGP 画像（担当: OGP 画像）

**Files:**

- Create: `lib/seo/og-image.tsx`
- Modify: `app/opengraph-image.tsx`（描画を共通関数に委譲）
- Create: `app/tools/<id>/opengraph-image.tsx` × 14（`lib/tools-registry.ts` の全ツール）
- Create: `app/guides/<slug>/opengraph-image.tsx` × 3

**Interfaces:**

- Consumes: Task 1 の `DEFAULT_OG_IMAGE`（ページ固有画像がファイル規約で上書きすることを前提）
- Produces:

  ```ts
  export const OG_SIZE = { width: 1200, height: 630 };
  export async function renderOgImage(p: {
    title: string;
    tagline: string;
    badges?: string[];
  }): Promise<ImageResponse>;
  ```

- [ ] **Step 1:** 既存 `app/opengraph-image.tsx` のレイアウト・配色・フォント取得を `renderOgImage` に移す。フォント取得（`loadGoogleFont`）が失敗した場合は `fonts` なしで描画する（try/catch）。ルートはこの関数を呼ぶだけにし、見た目は変えない。
- [ ] **Step 2:** 各ツールセグメントに `opengraph-image.tsx` を追加。`alt` は `${tool.name}｜まねでん`、`title` は `tool.name`、`tagline` は registry の短い説明（registry に既にある説明フィールド。長い場合は 40 字で切る）、`size`/`contentType` を export。ツールは `getToolById("<id>")!` で取得し、文言を手書きしない。
- [ ] **Step 3:** 各ガイドに同様に追加（`getGuideBySlug`、title=`guide.title`、tagline=「お金のガイド｜まねでん」）。
- [ ] **Step 4: 検証** — `pnpm run typecheck && pnpm run lint && pnpm build`。ビルドログに `/tools/nisa/opengraph-image` 等 17 ルートが出ること。`.next/server/app/tools/nisa.html` の og:image が `/tools/nisa/opengraph-image` を指すこと。`pnpm start` 後に `curl -s -o /tmp/og.png -w "%{http_code} %{content_type}" localhost:3000/tools/nisa/opengraph-image` が `200 image/png`。
- [ ] **Step 5: コミット** `feat(seo): ツール・ガイドごとの OGP 画像を生成`

### Task 3: 構造化データの重複解消と補完（担当: 構造化データ）

**Files:**

- Modify: `lib/seo/jsonld.ts`
- Create: `tests/seo/jsonld.test.ts`
- Create: `public/logo.png`（512×512、`public/icon.svg` をラスタライズ。Playwright の chromium で SVG を描画してスクリーンショット）
- Modify: `app/guides/{ideco-vs-nisa,furusato-nouzei,kaishain-tedori}/page.tsx`（ページ側の breadcrumbJsonLd を削除。`Breadcrumb` コンポーネントの出力を残す）
- Modify: `app/tools/page.tsx`, `app/take-home/page.tsx`, `app/furusato/page.tsx`（ItemList 追加）

**Interfaces:**

- Consumes: 既存 `itemListJsonLd(items: ItemListEntry[])`（変更しない）
- Produces: `ORGANIZATION_ID = \`${siteConfig.url}/#organization\``、`WEBSITE_ID = \`${siteConfig.url}/#website\``

- [ ] **Step 1: 失敗するテスト** — `tests/seo/jsonld.test.ts`
  - `organizationJsonLd()["@id"] === "https://maneden.com/#organization"`、`logo` が `{ "@type": "ImageObject", url: "https://maneden.com/logo.png", width: 512, height: 512 }`。
  - `webSiteJsonLd()["@id"] === "https://maneden.com/#website"`、`publisher` が `{ "@id": "https://maneden.com/#organization" }`。
  - `articleJsonLd(...)` の `publisher` が `{ "@id": ORGANIZATION_ID }`、`author` は従来どおり Organization（name/url）。
  - `datasetJsonLd(...)` の creator/publisher も `{ "@id": ORGANIZATION_ID }`。
- [ ] **Step 2:** FAIL を確認。
- [ ] **Step 3:** 実装（上記の通り @id と logo を追加）。`public/logo.png` を生成してコミット。
- [ ] **Step 4:** ガイド 3 本のページ側 BreadcrumbList を削除。`/tools`・`/take-home`・`/furusato` に `itemListJsonLd` を追加（`/tools` は `tools` の name/href、`/take-home` と `/furusato` は `INCOME_LEVELS` から各詳細ページ。name はそれぞれのページの h1 と同じ形式「年収○万円の手取り」「年収○万円のふるさと納税上限額」）。
- [ ] **Step 5: 検証** — `pnpm test && pnpm run typecheck && pnpm run lint && pnpm build`。ビルド後 `grep -o '"@type":"BreadcrumbList"' .next/server/app/guides/furusato-nouzei.html | wc -l` が 1。`.next/server/app/take-home.html` に `"@type":"ItemList"` がある。
- [ ] **Step 6: コミット** `feat(seo): 構造化データの重複を解消しロゴ・@id・一覧ハブの ItemList を追加`

### Task 4: 企業ページのクロール導線と一覧の軽量化（担当: クロール・パフォーマンス）

**Files:**

- Modify: `lib/companies/types.ts`（表示用型の追加）
- Modify: `lib/companies/data.ts`（変換関数の追加）
- Modify: `components/companies/CompanyList.tsx`（props 型を軽量型に）
- Create: `components/companies/CompanyIndex.tsx`（サーバーコンポーネント。全社リンク一覧）
- Modify: `app/companies/page.tsx`, `app/companies/industry/[slug]/page.tsx`
- Create: `tests/companies/list-items.test.ts`

**Interfaces:**

- Produces:

  ```ts
  export type CompanyListItem = Pick<
    Company,
    "slug" | "name" | "industry" | "averageSalary"
  >;
  export function toListItems(companies: Company[]): CompanyListItem[];
  export function CompanyIndex(props: {
    companies: CompanyListItem[];
    heading: string;
  }): JSX.Element;
  ```

- [ ] **Step 1: 失敗するテスト** — `toListItems` が 4 キーだけを持つオブジェクトを同順で返す（`Object.keys(item).sort()` が `["averageSalary","industry","name","slug"]`）、入力配列の長さと順序を保つ。
- [ ] **Step 2:** FAIL を確認 → 実装 → PASS。
- [ ] **Step 3:** `CompanyList` の props を `CompanyListItem[]` に変更し、`/companies` と業種ハブから `toListItems(companies)` を渡す。
- [ ] **Step 4:** `CompanyIndex` を作成: `<section>` 内に `<h2>{heading}</h2>` と、全社を `<ul>` の `<li><Link href={\`/companies/${slug}\`}>{name}（{formatManYen(averageSalary, 0)}）</Link></li>` で列挙。小さめの文字・複数カラム（`sm:columns-2 lg:columns-3`）で、ページ下部・既存の「← すべての業種・企業の一覧へ」リンクの直前に置く。業種ハブに `heading = \`${industry}の全${count}社一覧\`` で追加。`/companies` には追加しない（全社は業種ハブ経由で辿れる）。
- [ ] **Step 5: 検証** — `pnpm test && pnpm run typecheck && pnpm run lint && pnpm build`。ビルド後:
  - `grep -o 'href="/companies/[0-9A-Za-z-]*"' .next/server/app/companies/industry/services.html | grep -v industry | sort -u | wc -l` がサービス業の社数（154）以上。
  - 全業種ハブで、ユニークな企業リンク数の合計がハブのある業種に属する企業数と一致（ハブのない業種は対象外）。確認スクリプトを一時的に書いて数値を記録し、コミットはしない。
  - `.next/server/app/companies.html` のサイズが変更前（約 447KB）より小さい。変更前後の値を記録。
- [ ] **Step 6: コミット** `feat(seo): 業種ハブに全社リンク一覧を追加し企業一覧のペイロードを軽量化`

### Task 5: 最終検証と PR（担当: 統括）

- [ ] 全体レビュー（superpowers:requesting-code-review）で指摘を反映。
- [ ] `pnpm test && pnpm run typecheck && pnpm run lint && pnpm run format:check && pnpm build` を一度通す（verification-before-completion）。
- [ ] `docs/superpowers/specs/2026-11-27-seo-audit.md` に「対応結果」節を追記（各 P の before/after の実測値）。
- [ ] `claude/project-thread-lo8bar` に push し PR を作成。
