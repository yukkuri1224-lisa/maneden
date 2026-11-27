# home レビュー記録 cycle-0（試運転）

- 日付: 2026-11-27
- 対象コミット: fe32d91（S0 の仕組みのみ。アプリのコードは未変更）
- 撮影: reviews/home/cycle-0/（幅 375 / 768 / 1440、状態 default・dark）
- 目的: コードを変えずに、レビューサイクルが書式どおりに動くか、現状のホームが何点かを測る

## 判定: 不合格（採点 7/10 が合格ライン 8 に届かない）

| 条件                     | 結果                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------- |
| Critical / High          | 0 件 / 0 件                                                                             |
| 採点（B）                | 7/10（design-review 3/4、Medium あり）                                                  |
| レイアウト崩れ           | なし（3 幅とも横スクロールなし）                                                        |
| 主要操作                 | ホームに入力操作はない（リンクのみ）                                                    |
| テスト・型・lint・ビルド | 通過（typecheck / lint / format:check / test 173 件。build はオーケストレーターが実行） |
| axe（基準比）            | 増加なし（24 passed、home は sp・pc とも 0 件）                                         |
| 視覚回帰                 | 差分なし（28 passed）                                                                   |
| 6 つの制約               | 遵守（lib/calculators・lib/companies に差分なし。app / components / lib は未変更）      |

## 前回の指摘の確認

cycle-0 のため前回なし。

## 観点別（B）

| 観点                      | 評価 | メモ                                                                      |
| ------------------------- | ---- | ------------------------------------------------------------------------- |
| 1. 情報の階層             | ◎    | 見出し → リード → 主 CTA の順。明細カードの手取り額が主役になっている     |
| 2. タイポグラフィ         | △    | 日本語の改行で 1〜2 文字だけが次の行に落ちる（B-3）                       |
| 3. 色とコントラスト       | ◎    | トークン以外の色なし                                                      |
| 4. 余白とリズム           | ◎    | セクションの上下余白がそろっている                                        |
| 5. 整列                   | △    | 768 で実績帯の数字の高さがずれる（B-1）、1440 のランキングが間延び（B-4） |
| 6. 数値の読みやすさ       | ◎    | 桁区切り・単位・右揃えが統一                                              |
| 7. フォーム               | ◎    | 対象外（入力なし）                                                        |
| 8. フィードバックとエラー | ◎    | 対象外（入力なし）                                                        |
| 9. レスポンシブ           | △    | 崩れはないが 768 で 4 列・3 列が窮屈（B-1、B-2）                          |
| 10. ダークモード          | ◎    | 色の対応漏れなし                                                          |
| 11. 一貫性                | ○    | 社名の全角英字・全角スペース（B-5）                                       |

## 指摘（B: 画面）

### [Medium] B-1 768 幅で実績帯の見出しが 1 文字だけ折り返し、数字の高さがずれる

- 画面と幅: home / 768 / default-01・02（dark も同じ）
- 対象要素: 実績帯 app/page.tsx の `<dl className="grid grid-cols-2 … sm:grid-cols-4 sm:divide-x">`
- 問題（Before）: 1 列約 180px で「上場企業の年収デー／タ」のように「タ」だけが落ち、「1,555社」「0件」が他の数字より約 20px 下に出る
- 修正案（After）: `sm:grid-cols-4 sm:divide-x` を `lg:grid-cols-4 lg:divide-x` にし、dt に `whitespace-nowrap`
- 理由（Why）: Nielsen heuristic #8 - Aesthetic and minimalist design

### [Medium] B-2 768 幅でガイドカードが 3 列になり、タイトルが語の途中で折れる

- 画面と幅: home / 768 / default-03
- 対象要素: 「お金のガイド」 app/page.tsx の `<ul className="mt-10 grid … sm:grid-cols-3">`
- 問題（Before）: 約 240px 幅で「どっ／ちから？」「決ま／り方」と折れ、説明文の書き出しの高さがカードごとにずれる
- 修正案（After）: `sm:grid-cols-3` を `lg:grid-cols-3` にし、1024px 未満は 1 列
- 理由（Why）: Material Design - Responsive layout grid

### [Medium] B-3 日本語の文章で 1〜2 文字だけが次の行に落ちる

- 画面と幅: home / 375 default-01（ヒーロー上の一文「…計／算」）、375・1440 の FAQ（「…ありませ／ん。」）、768・1440 のリード文、768 の CTA 帯
- 対象要素: app/page.tsx のヒーローの一文・リード文、`SectionHeading` の lead、FAQ の `<dd>`、CTA 帯の `<p>`
- 問題（Before）: 文節を考えない改行で「算」「ん。」のような切れ端が 1 行になる
- 修正案（After）: app/globals.css の base 層に `:lang(ja) :is(p, dd) { word-break: auto-phrase; text-wrap: pretty; }`。ヒーローの一文は `text-xs sm:text-sm` にして 375 で 1 行に収める
- 理由（Why）: Nielsen heuristic #8 - Aesthetic and minimalist design

### [Low] B-4 1440 幅のランキングで社名と年収が約 750px 離れる

- 画面と幅: home / 1440 / default-04
- 対象要素: ランキング `<ol className="mt-10 border-t">` と行の `sm:grid-cols-[2.5rem_1fr_12rem_auto]`
- 問題（Before）: 社名列が約 750px に広がり、社名と業種・年収の間に大きな空白
- 修正案（After）: `<ol>` に `max-w-3xl`、列を `sm:grid-cols-[2.5rem_1fr_10rem_7rem]`
- 理由（Why）: Nielsen heuristic #8 - Aesthetic and minimalist design

### [Low] B-5 ランキングの社名で全角英字と全角スペースが混ざる

- 画面と幅: home / 375 default-06、768 default-04、1440 default-04
- 対象要素: ランキングの社名 `{company.name}`
- 問題（Before）: 「株式会社　商船三井」「Ａｉロボティクス株式会社」と表記がそろわない
- 修正案（After）: データは変えず、表示時だけ `company.name.normalize("NFKC")`。公式表記と食い違わないかは実装時に確認
- 理由（Why）: Nielsen heuristic #4 - Consistency and standards

## 指摘（D: 品質・アクセシビリティ）

### [Medium] D-1 ガイド一覧のリンクのフォーカス表示が親の overflow-hidden で切れる

- 対象要素: app/page.tsx:256-257 の `<Link className="group flex h-full flex-col p-5 sm:p-6">`（親 ul は overflow-hidden）
- 問題（Before）: `focus-visible:` の指定がなく、標準アウトラインの外周側が切り取られる
- 修正案（After）: `outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`
- 理由（Why）: Web Interface Guidelines - Interactive elements need visible focus

### [Medium] D-2 企業ランキングの行と「自分の年収で計算する」にフォーカススタイルがない

- 対象要素: app/page.tsx:286-288（企業の行）、168-170（明細カード下のリンク）
- 問題（Before）: 標準アウトライン（ring/50）だけで、ToolCard や CTA と見え方がそろわない
- 修正案（After）: 行に `rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`、リンクに同じ指定 + `focus-visible:ring-offset-2 focus-visible:ring-offset-card`
- 理由（Why）: Web Interface Guidelines - Interactive elements need visible focus

### [Medium] D-3 塗りの主ボタンでフォーカスしても見た目がほとんど変わらない

- 対象要素: components/ui/button.tsx:7 の `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`
- 問題（Before）: default では border-ring が背景と同色で、半透明リング（背景比 約 2.5:1）しか変化しない
- 修正案（After）: default variant に `focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-ring`
- 理由（Why）: Web Interface Guidelines - Interactive states increase contrast

### [Medium] D-4 固定ヘッダーの下にフォーカス中の要素が隠れる余地がある

- 対象要素: components/common/Header.tsx:21（`sticky top-0`、h-16）、app/globals.css:135-137
- 問題（Before）: `scroll-padding-top` がなく、Shift+Tab で戻ると 44px 前後の行がヘッダーの下に隠れうる（フォーカス状態の撮影がないため未確認）
- 修正案（After）: `html { @apply font-sans scroll-pt-20; }`
- 理由（Why）: Web Interface Guidelines - Sticky headers must not cover the focused element

### [Low] D-5 本文へのスキップリンクがない

- 対象要素: app/layout.tsx:105-106
- 修正案（After）: Header の前に `sr-only focus:not-sr-only …` の「本文へスキップ」リンク、`<main id="main" tabIndex={-1}>`
- 理由（Why）: Web Interface Guidelines - include skip link for main content

### [Low] D-6 明細の dl に dt / dd 以外の span が入っている

- 対象要素: app/page.tsx:155, 161 の `<span className="ledger-leader" aria-hidden />`
- 修正案（After）: リーダーを dt の中へ移す
- 理由（Why）: WCAG 2.2 SC 1.3.1

### [Low] D-7 ボタンが transition-all を使っている

- 対象要素: components/ui/button.tsx:7
- 修正案（After）: `transition-[color,background-color,border-color,box-shadow,transform]`
- 理由（Why）: Web Interface Guidelines - Never transition: all

### [Low] D-8 ダークモードで color-scheme: dark を指定していない

- 対象要素: app/globals.css:93 の `.dark`
- 修正案（After）: `.dark { color-scheme: dark; }`、`:root { color-scheme: light; }`
- 理由（Why）: Web Interface Guidelines - color-scheme: dark on html for dark themes

指摘なし: 本文・補足文・CTA のコントラスト、タップ領域（44px 以上）、見出しの順序（h1 → h2 → h3）。

## 試運転でわかったこと（仕組みの改善）

- 375 幅のホームが撮影上限 8 枚で切れ、CTA 帯とフッターが写っていなかった → 上限を 12 枚に変更済み
- axe の自動検査は WCAG 2.1 までで、2.2 の 2.5.8・2.4.11 は D の目視点検で補う
- フォーカス状態の撮影がないため D-4 は未確認 → 必要になれば撮影対象にフォーカス状態を足す
- 所要時間は B が約 2 分、D が検査込みで約 5 分（並行実行）。トークン量は 1 周あたり B が約 13 万、D が約 11 万

## 次の周回で直すもの（PR 2 トップページで対応）

B-3 → B-1 → B-2 → D-1〜D-4。Low（B-4、B-5、D-5〜D-8）は余裕があれば。D-3・D-7・D-8 は共通部品と全体のトークンに関わるため、PR 1（デザインシステム）で扱うのが適切。
