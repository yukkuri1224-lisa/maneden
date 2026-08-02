# マネ電（maneden）開発ログ

このドキュメントは、企画から公開・デザイン刷新までの開発経緯・設計判断・運用方法をまとめた記録です。
（最終更新: 2026-08-02）

---

## 1. プロダクト概要

**マネ電** … 登録不要・完全無料で使える、フリーランス・個人事業主・ビジネスパーソン向けの
「お金の計算・シミュレーションツール集」ポータル。計算はすべてブラウザ内で完結し、
入力データを外部送信・保存しない（プライバシー訴求）。SEO集客＋アフィリエイト収益化を狙う。

キャッチフレーズ: **「お金の『？』を、その場で『！』に。」**

### 公開情報

- **本番URL**: https://maneden.vercel.app/
- **GitHub**: リポジトリ名 `maneden`（ユーザー: yukkuri1224-lisa）
- **ホスティング**: Vercel（GitHub連携・push で自動デプロイ）
- **運営形態**: 個人／連絡先 `manedencontact@gmail.com`
- **ローカルのフォルダ**: `C:\Users\nre10\bizcalc-hub`（フォルダ名は旧称のまま。表示名は「マネ電」）

---

## 2. 技術スタック

- **Next.js 16**（App Router / Turbopack）/ **React 19** / **TypeScript**（strict）
- **Tailwind CSS v4** + **shadcn/ui**（base-nova = Base UI ベース）/ lucide-react
- 日本語フォント **Zen Kaku Gothic New**（next/font、欧文/数字は Geist）
- **Recharts v3**（グラフ、`next/dynamic` の `ssr:false` で遅延読込）
- **zod / react-hook-form**（入力）※現状は軽量な useState + clamp 中心
- **Vitest**（計算ロジックの単体テスト 54件）
- **ESLint + Prettier + husky + lint-staged**
- パッケージマネージャ **pnpm**（Windows で corepack 有効化）

### 開発環境の注意（WSL + Windows）

- ローカルは Windows + WSL2。node/pnpm は **Windows 側**。
- Claude はファイル編集を WSL から行い、**ビルド/型/Lint/テストは `cmd.exe /c "cd /d ... && pnpm ..."` 経由で実行**して検証していた。
- 改行コードは `.gitattributes`（`* text=auto eol=lf`）で **LF に統一**。

---

## 3. 主要ディレクトリ

- `app/` … App Router のページ・レイアウト・`sitemap.ts`/`robots.ts`/`manifest.ts`
  - `app/tools/<tool>/page.tsx` … 各ツールのページ（SEO本文＋Suspense でツール本体）
- `components/common/` … Header/Footer/Breadcrumb/ToolCard/ShareBar/ThemeToggle/SliderField/ArticlePage 等
- `components/tools/<tool>/` … 各ツールの UI（InputPanel/結果表示/チャート/オーケストレータ）
- `components/ui/` … shadcn 生成（原則手を入れない）
- `lib/tools-registry.ts` … **全ツールのメタ情報を一元管理**（トップ/一覧/ヘッダー/フッター/sitemap が参照）
- `lib/calculators/<tool>/` … 計算ロジック（純粋関数・Vitest 対象）
- `lib/constants/` … 税率テーブル・耐用年数・補助金データ等の定数
- `lib/seo/jsonld.ts` … 構造化データ生成ヘルパー

---

## 4. 実装したツール（4本すべて公開中）

1. **/tools/freelance-tax** … フリーランスの手取り＆税金シミュレーター
   （所得税・復興・住民税・国保・国民年金・消費税/インボイス、インボイス影響額、ドーナツ＋折れ線）
2. **/tools/saas-metrics** … SaaS 指標（LTV / LTV:CAC / 回収期間 / MRR・ARR、コホート推移）
3. **/tools/real-estate-yield** … 不動産利回り＆デッドクロス診断
   （表面/実質利回り・元利均等返済スケジュール・減価償却・デッドクロス発生年）
4. **/tools/subsidy-finder** … 補助金・助成金診断（目的×規模で主要6制度をマッチング、概算受給額）

計算値はすべて **概算**。税率は 2026 年度想定（2025年度改正の基礎控除引き上げは未反映）、
国保は単身の全国平均モデル、補助金データは「概算・要確認」で公式リンク併記。

---

## 5. 開発の経緯（時系列）

1. **Phase 0** 基盤構築: Next.js 16 生成、shadcn 導入、共通レイアウト、tools-registry、SEO基盤、法務スタブ。
2. **Phase 1** 計算エンジン（freelance-tax）＋ Vitest。
3. **Phase 2** freelance-tax の UI（インディゴ配色化、入力・ヒーロー・グラフ・内訳・シェア）。
4. **Phase 2.5** トップページ・法務ページ整備。
5. **Phase 3** 残り3ツール（saas-metrics / real-estate-yield / subsidy-finder）を実装・公開。
6. **UI/UX最適化** ダークモード、共有バー、カード全体クリック、リセット、現在地ハイライト、reduced-motion 等。
7. **スマホ最適化** PWA マニフェスト＋アプリアイコン＋appleWebApp（**AMP は不採用**。理由は §6）。
8. **改名** BizCalc Hub → **マネ電（maneden）**。
9. **法務確定** 個人運営・連絡先メール掲載・住所/電話は非掲載。
10. **公開** GitHub push → Vercel import → `NEXT_PUBLIC_SITE_URL` 設定 → 本番公開。
11. **デザイン全面刷新** 日本語フォント導入＋本格ランディング化（ヒーロー/プレビューカード/信頼バー/ショーケース/理由/3ステップ/FAQ/CTA）。

---

## 6. 主要な設計判断と理由

- **計算はクライアント完結** … プライバシー訴求＋高速（SSGでCDN配信、API通信なし）。
- **tools-registry で一元管理** … 新ツール追加は registry に1件足すだけで各所へ自動反映。
- **URLクエリ同期（replaceState）＋ Suspense** … 条件をURLに保存してシェア可、かつ静的生成を維持。
- **AMP は不採用** … (1)Next.js App Router は AMP 非対応、(2)Google は AMP 優遇を終了（Core Web Vitals が評価軸）、(3)AMP は独自JS禁止で対話的な計算機が動かせない。代替に PWA で「アプリ的な体験」を実現。
- **個人運営の法務** … 有料の直接販売をしないため、特商法上の住所・電話の表示義務は原則対象外と判断し非掲載。ハンドル/メールのみ（収益化を本格化する場合は要再確認）。
- **eslint-config-next の `react-hooks/set-state-in-effect`** … エフェクト内の同期 setState はエラー。ThemeToggle は CSS の dark: バリアントで state レス化、useCountUp は duration=0 で rAF 一発、で回避。
- **改行コード** … `.gitattributes` で LF 統一（WSL編集×Windows Git の警告・差分ノイズ回避）。

---

## 7. 運用（更新のしかた）

- **サイトを更新する** … コードを編集 → `git add -A && git commit -m "..." && git push` → **Vercel が自動デプロイ**。
- **公開URLの変更（独自ドメイン取得時）** … Vercel の Settings → Domains でドメイン追加 → 環境変数 `NEXT_PUBLIC_SITE_URL` をそのドメインに変更 → Redeploy。
- **税制・料率の更新** … `lib/constants/tax-tables.ts` 等を年度ごとに見直す（UIやロジックは変更不要）。
- **新ツール追加** … `lib/calculators/<id>/` に純粋関数＋テスト、`components/tools/<id>/` に UI、`app/tools/<id>/page.tsx`、`lib/tools-registry.ts` に1件追加。
- **検証コマンド**（PowerShell）: `pnpm run typecheck` / `pnpm run lint` / `pnpm test` / `pnpm run build`。

---

## 8. 残タスク・今後（任意）

- [ ] **Google Search Console** に登録し `sitemap.xml` を送信（検索流入の起点）
- [ ] 独自ドメイン取得（例: maneden.com）→ 環境変数切替
- [ ] 法務ページの最終確認（プライバシー/規約の文面）
- [ ] 補助金データの精緻化・年次更新
- [ ] OGP 動的画像（`opengraph-image.tsx`）でシェア画像を自動生成
- [ ] GA4 等のアクセス解析、アフィリエイト広告の実タグ差し替え
- [ ] Lighthouse 計測とチューニング

---

## 9. 参考ドキュメント（リポジトリ内）

- `REQUIREMENTS.md` … 初期要件定義（※未取り込みの場合あり。原本は別途保管）
- `README.md` … セットアップ・技術スタック・開発環境メモ
- `DEPLOY.md` … 公開（デプロイ）手順の詳細
- `DEVLOG.md` … 本ファイル（開発の全記録）
