# リデザイン PR 0: 基準線の記録（2026-11-27）

全面リデザイン（Modern SaaS × Premium Fintech / Calm Precision）に入る前の、現状の見た目・アクセシビリティ・テスト結果。
以降の PR は、ここに記録した状態から「意図した変更だけが起きたか」を確かめる。

対象コミット: `62c490e`（`claude/project-thread-lo8bar`、PR #1 の先頭）

## 守る条件（全 PR 共通）

1. 計算ロジック（`lib/calculators/`・`lib/constants/`）は変更しない
2. 既存 URL と SEO 構造（title・description・h1・JSON-LD・canonical・静的生成）を維持する
3. 共有リンク（`useUrlSyncedInput` のクエリ名と形式）の互換性を維持する
4. 企業データ（`lib/companies/companies.json`）を変更しない
5. 既存のダークモード（`layout.tsx` の初期化スクリプトと `ThemeToggle`）を維持する
6. 変更は小さな PR 単位に分割する

## 使い方

```bash
pnpm build                 # 本番ビルド（テストは本番サーバーに対して行う）
pnpm test:visual           # 主要 12 画面のスクリーンショット比較（サーバーは自動起動）
pnpm test:a11y             # axe によるアクセシビリティ検査（基準線より悪化したら失敗）

pnpm test:visual:update               # 意図した見た目の変更を期待画像に反映
UPDATE_A11Y_BASELINE=1 pnpm test:a11y # 違反を直した後に基準線を更新
```

- 期待画像: `e2e/__screenshots__/{sp,pc}/<画面名>.png`（スマホ 390×844 / PC 1440×900、全体撮影）
- 対象画面の一覧: `e2e/pages.ts`
- a11y 基準線: `e2e/a11y-baseline.json`
- 撮影の安定化: Web フォント読み込み完了を待つ / 1 画面ずつスクロールして遅延読み込みのグラフを描画 / `reducedMotion: "reduce"` でカウントアップを止める / Recharts のアニメーション完了（2 秒）を待つ

## 主要 12 画面

| 画面名                | URL                            | テンプレート                      |
| --------------------- | ------------------------------ | --------------------------------- |
| home                  | `/`                            | トップ                            |
| tools                 | `/tools`                       | ツール一覧                        |
| tool-salary-take-home | `/tools/salary-take-home`      | ツール（代表）                    |
| tool-furusato-tax     | `/tools/furusato-tax`          | ツール                            |
| tool-nisa             | `/tools/nisa`                  | ツール（推移グラフ）              |
| companies             | `/companies`                   | 企業一覧                          |
| company-1301          | `/companies/1301`              | 企業ページ（1,555 ページ）        |
| industry-services     | `/companies/industry/services` | 業種ページ（33 ページ）           |
| take-home-500         | `/take-home/500`               | 年収別の手取り（25 ページ）       |
| furusato-500          | `/furusato/500`                | 年収別のふるさと納税（25 ページ） |
| guide-kaishain-tedori | `/guides/kaishain-tedori`      | ガイド記事                        |
| editorial-policy      | `/editorial-policy`            | 静的ページ（E-E-A-T）             |

ダークモードは home と tool-salary-take-home の 2 画面を追加で撮影（計 28 枚）。

## 現在のテスト・ビルド結果

| 項目         | コマンド                | 結果                                                     |
| ------------ | ----------------------- | -------------------------------------------------------- |
| 単体テスト   | `pnpm test`             | 24 ファイル・173 件すべて成功（約 8 秒）                 |
| 型チェック   | `pnpm run typecheck`    | エラー 0                                                 |
| lint         | `pnpm run lint`         | エラー・警告 0                                           |
| 整形         | `pnpm run format:check` | 全ファイル準拠                                           |
| 本番ビルド   | `pnpm build`            | 成功（約 35 秒）。静的生成 1,692 件、HTML 1,670 ファイル |
| 見た目の回帰 | `pnpm test:visual`      | 28 件。期待画像を作成後、2 回連続で全件一致              |
| a11y         | `pnpm test:a11y`        | 24 件（12 画面 × 2 幅）すべて基準線どおり                |

HTML 1,670 ファイルの内訳: 企業 1,555 / 業種 33 / 年収別 50（手取り 25・ふるさと納税 25）/ ツール 14 / ガイド 3 / その他（ハブ・静的ページ・404 など）15。

## アクセシビリティの現状（axe-core 4.11、WCAG 2.1 A/AA）

24 回の検査のうち、違反が出たのはふるさと納税ツールの 2 種類 3 か所だけ。リデザインの PR で直し、基準線を下げる。

| 画面              | 幅         | ルール                      | 内容                                                                                    |
| ----------------- | ---------- | --------------------------- | --------------------------------------------------------------------------------------- |
| tool-furusato-tax | スマホ・PC | color-contrast              | 選択されていないタブの文字が 4.18:1（基準 4.5:1）。前景 `#6f7379`、背景 `#f2f0eb`、14px |
| tool-furusato-tax | スマホ     | scrollable-region-focusable | 横スクロールする表の枠（`overflow-x-auto`）にキーボードで移動できない                   |

axe の対象外だが、監査で見つけた項目（PR 1 以降で対応）:

- 12px 未満の文字: ツール画面に 1 か所（`text-[10px]`）
- 高さ 32px 未満の操作要素: ツール 11・ガイド 12・業種 5 か所（テキストボタン、共有ボタンなど）
