# PR 1 デザインシステム 改修仕様

- 作成: 2026-11-27（シニア UI デザイナー）
- ブランチ: `claude/redesign-pr1-design-system`
- 方針: Modern SaaS × Premium Fintech の「Calm Precision（明細書のように、数字が主役）」。藍（primary）と朱（highlight、答えの強調だけ）の役割は変えない
- 実装: フロントエンド担当（C）。このファイルと `design-system/maneden/MASTER.md` の値をそのまま使う
- 入力にした記録: `docs/ui-reviews/home/cycle-0.md`（D-3・D-4・D-7・D-8・B-3）、`docs/redesign/pr0-baseline.md`（tool-furusato-tax の非アクティブタブ 4.18:1）

## 0. 範囲と分け方

PR 1 は 2 つに分ける（制約 6）。ページのレイアウト（app/page.tsx などの構成・余白）は PR 2 以降で扱う。

| PR  | 触るファイル                                           | 内容                                                             | 見た目への影響                                       |
| --- | ------------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------- |
| 1a  | `app/globals.css`、`app/layout.tsx`（`viewport` のみ） | 色トークン、文字の行間、基本スタイル、フォーカス用ユーティリティ | 全 28 枚（行間と数字の字幅が変わるため）             |
| 1b  | `components/ui/*.tsx`                                  | 部品のフォーカス・境界・トランジション・タブ                     | 入力欄・タブ・ボタンのある画面（ツール・年収別など） |

変えないもの: `lib/calculators/`・`lib/constants/`・`lib/companies/`、URL、見出しとメタデータ・JSON-LD、`useUrlSyncedInput` のクエリ、テーマ初期化スクリプトと `ThemeToggle`。

効かせる場所は 3 つだけ。

1. 入力欄・ラジオ・スイッチの枠を 3:1 以上にして、「どこに入力するか」を正確に見せる（現状 1.58:1 で WCAG 1.4.11 未達）
2. フォーカスを全部品で同じ「2px の藍の実線」にそろえる（現状は半透明の 3px リングで、塗りボタンでは見えない）
3. 和文の行間と改行を整え、数字をすべて等幅にする（明細として桁がそろう）

---

## 1. 色トークン（app/globals.css）

### 1-1. 変更するトークン

| 対象                      | 現状（ライト / ダーク）                       | 変更後（ライト / ダーク）                         | 理由                                                                                                                                                                                           |
| ------------------------- | --------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--input`                 | `oklch(0.85 0.012 85)` / `oklch(1 0 0 / 18%)` | `oklch(0.62 0.015 262)` / `oklch(0.55 0.015 260)` | 入力欄・ラジオ・スイッチの枠が card 上で 1.58:1 / 1.75:1。WCAG 1.4.11 の 3:1 に届かない。変更後 3.64:1 / 3.65:1。色相を罫線の 85 から藍寄りの 262 に移し、「操作できる枠」と「罫線」を区別する |
| `:root` に `color-scheme` | なし                                          | `color-scheme: light;`                            | cycle-0 D-8。スクロールバー・フォームの UA 部品・オートフィルの色を合わせる                                                                                                                    |
| `.dark` に `color-scheme` | なし                                          | `color-scheme: dark;`                             | 同上。`.dark` は `<html>` に付くのでそのまま効く                                                                                                                                               |

ダークの `--input` は半透明をやめて不透明にする。半透明（白 18%）だと下の面によって枠の濃さが変わり、3:1 を保証できないため。

### 1-2. 変更しないトークン（確認済み）

`--background` `--foreground` `--card` `--popover` `--primary` `--primary-foreground` `--secondary` `--muted` `--muted-foreground` `--accent` `--accent-foreground` `--highlight` `--destructive` `--border` `--ring` `--chart-1〜5` `--radius` `--sidebar-*` はすべて現状のまま。

- `--border` は罫線（装飾）専用として据え置く（card 上 1.44:1）。操作部品の枠には使わない。罫線を濃くすると紙面がうるさくなり「静か」を損なう
- `--ring` は `--primary` と同じ値のまま、**不透明で**使う（3 章）
- `--sidebar-*` は未使用だが shadcn CLI が参照するので残す

### 1-3. `app/layout.tsx` の `viewport.themeColor`（1a に含める）

| 対象             | 現状      | 変更後    | 理由                                                                                                            |
| ---------------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| light の `color` | `#fbfaf6` | `#fcfaf6` | `--background` `oklch(0.985 0.005 85)` の実際の sRGB 値に合わせる                                               |
| dark の `color`  | `#14171f` | `#0c1016` | `.dark --background` `oklch(0.17 0.015 260)` の実際の値。現状はカード色に近く、ブラウザのバーとページ地がずれる |

メタデータの他の項目（title・description・OGP・robots）には触れない。

---

## 2. コントラスト比（変更後の想定。sRGB 換算・WCAG 2.x の式で計算）

計算の確認: 現状の非アクティブタブ（foreground 60% on muted）は計算で 4.19:1、ベースラインの実測 4.18:1 と一致。

### 2-1. 文字（基準 4.5:1、18.66px 太字以上は 3:1）

| 前景 / 背景                                                      | ライト   | ダーク   | 判定                   |
| ---------------------------------------------------------------- | -------- | -------- | ---------------------- |
| `foreground` / `background`                                      | 15.77    | 16.52    | 可                     |
| `foreground` / `card`                                            | 16.47    | 15.31    | 可                     |
| `foreground` / `muted`                                           | 14.44    | 13.83    | 可                     |
| `muted-foreground` / `background`                                | 6.83     | 8.29     | 可                     |
| `muted-foreground` / `card`                                      | 7.13     | 7.68     | 可                     |
| `muted-foreground` / `muted`（**非アクティブタブ**）             | **6.25** | **6.94** | 可（現状 4.19 → 6.25） |
| `primary` / `background`                                         | 7.95     | 8.25     | 可                     |
| `primary` / `card`                                               | 8.30     | 7.64     | 可                     |
| `primary-foreground` / `primary`（主ボタン）                     | 7.95     | 8.25     | 可                     |
| `primary-foreground` / `primary` 90%（主ボタンのホバー、変更後） | 6.23     | 6.85     | 可                     |
| （参考）同 80%（現状のホバー）                                   | 4.87     | 5.63     | 可だが余裕が少ない     |
| `accent-foreground` / `accent`（セレクトの選択行）               | 9.57     | 10.84    | 可                     |
| `highlight` / `card`（朱。太字 18px 以上のみ）                   | 5.25     | 6.76     | 可                     |
| `highlight` / `muted`                                            | 4.60     | 6.11     | 可                     |
| `destructive` / `card`                                           | 5.37     | 6.08     | 可                     |
| `foreground` / `card`（アクティブタブ、変更後）                  | 16.47    | 15.31    | 可                     |

### 2-2. 非テキスト（基準 3:1）

| 要素                         | 色 / 隣接色                          | ライト | ダーク | 判定                                       |
| ---------------------------- | ------------------------------------ | ------ | ------ | ------------------------------------------ |
| 入力欄・セレクト・ラジオの枠 | `input` / `card`                     | 3.64   | 3.65   | 可（現状 1.58 / 1.75）                     |
| 同（ページ地の上）           | `input` / `background`               | 3.49   | 3.94   | 可                                         |
| 同（muted の上）             | `input` / `muted`                    | 3.19   | 3.30   | 可                                         |
| スイッチ（オフ）のつまみ     | `background`/`foreground` on `input` | 3.49   | 4.19   | 可                                         |
| スイッチ（オン）のつまみ     | `background` / `primary`             | 7.95   | 8.25   | 可                                         |
| フォーカスの線               | `ring` / `background`                | 7.95   | 8.25   | 可                                         |
| 同（カードの上）             | `ring` / `card`                      | 8.30   | 7.64   | 可                                         |
| 同（タブ列の上）             | `ring` / `muted`                     | 7.28   | 6.90   | 可                                         |
| アクティブタブの枠           | `input` / `muted`                    | 3.19   | 3.30   | 可                                         |
| 罫線（装飾。3:1 の対象外）   | `border` / `card`                    | 1.44   | 1.42   | 対象外（意味を持たない区切り線にだけ使う） |

---

## 3. 全体の基本スタイル（app/globals.css）

| 対象                                    | 現状                                   | 変更後                                                  | 理由                                                                                                                                                       |
| --------------------------------------- | -------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@layer base` の `*`                    | `@apply border-border outline-ring/50` | `@apply border-border outline-ring`                     | 標準アウトラインの色を半透明から不透明の藍に。クラス指定のないリンクのフォーカスも 7.95:1 になる（cycle-0 D-2 の土台）                                     |
| `@layer base` の `html`                 | `@apply font-sans`                     | `@apply font-sans scroll-pt-20`                         | cycle-0 D-4。ヘッダーは `sticky h-16`（64px）。80px 空けて、戻りフォーカスや `#` リンク先が隠れないようにする。ツールの `lg:top-20` とも同じ値             |
| `@layer base` の `body`                 | `line-height: 1.8`                     | `line-height: 1.8; font-variant-numeric: tabular-nums;` | 数字をサイト全体で等幅に。金額の桁が縦にそろう。各所の `tabular-nums` 指定は残してよい（重複は無害）                                                       |
| 和文の改行（新規、`@layer base`）       | なし                                   | 下の 3-1 のとおり                                       | cycle-0 B-3。「…計／算」「…ありませ／ん。」のような 1〜2 文字の行をなくす                                                                                  |
| フォーカス用ユーティリティ（新規）      | なし                                   | 下の 3-2 の `focus-ring` と `focus-field`               | 部品ごとにばらばらな指定（`ring-3 ring-ring/50`、`outline-1` など）を 2 つに集約する                                                                       |
| 文字サイズごとの行間（`@theme inline`） | Tailwind 既定（`text-sm` 1.43 など）   | 3-3 のとおり                                            | `text-sm`（205 か所）が 1.43 で、本文 1.8 と食い違う。和文には詰まりすぎる。h1 の `text-3xl` が 1.2、`text-4xl` が 1.11 で MASTER の見出し 1.35 と食い違う |

### 3-1. 和文の改行

```css
@layer base {
  :lang(ja) :is(p, li, dt, dd, h1, h2, h3, figcaption, blockquote) {
    word-break: auto-phrase;
    overflow-wrap: break-word;
  }
  :lang(ja) :is(p, li, dd, figcaption, blockquote) {
    text-wrap: pretty;
  }
  :lang(ja) :is(h1, h2, h3) {
    text-wrap: balance;
  }
}
```

実装では `overflow-wrap` を `break-word` ではなく `anywhere` にしている（cycle-1 D-2）。`break-word` では長い社名（英字の連続など）が min-content 幅の計算で縮まず、375 幅で横スクロールが出たため。`anywhere` は折り返し候補を min-content にも反映するので、フレックスやグリッドの子でもはみ出さない。

- `auto-phrase` は Chrome / Edge 119 以降で効き、他のブラウザでは通常の改行に戻るだけ（崩れない）
- `overflow-wrap: break-word` は、文節が枠より長い場合（狭い表のセルなど）にはみ出させないための保険。最小幅の計算には影響しない
- B-3 の「ヒーローの一文を `text-xs sm:text-sm`」はページの変更なので PR 2 で行う

### 3-2. フォーカス用ユーティリティ

```css
/* 押せる部品（ボタン・タブ・スイッチ・ラジオ・アコーディオン・スライダーのつまみ） */
@utility focus-ring {
  &:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
}
/* 入力欄・セレクト: 枠そのものを 2px の藍に見せる（外へはみ出さず、レイアウトも動かない） */
@utility focus-field {
  &:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: -1px;
  }
}
```

- `box-shadow` のリング＋`ring-offset` ではなく `outline` を使う。`outline-offset` の隙間は透明なので、カードの上でもページ地の上でも同じ見え方になる（`ring-offset-background` はカード上で色がずれる）
- `.focus-ring:focus-visible` の詳細度は (0,2,0) なので、部品に残る `outline-none`（0,1,0）より優先される。DevTools の `:focus-visible` 強制で、主ボタン・タブ・入力欄に藍の 2px が出ることを確認する
- 塗りの主ボタンは 2px の隙間を挟んで藍の線が出るため、ボタン本体と線が一体化しない（cycle-0 D-3 の解消）

### 3-3. 文字サイズごとの行間（`@theme inline` に追記）

サイズ（font-size）は Tailwind 既定のまま変えない。行間だけ和文向けに上書きする。

| 変数                       | 現状（既定） | 変更後 | 例（px）       | 主な用途                         |
| -------------------------- | ------------ | ------ | -------------- | -------------------------------- |
| `--text-xs--line-height`   | 1.333        | 1.5    | 12 → 行送り 18 | 注記                             |
| `--text-sm--line-height`   | 1.429        | 1.6    | 14 → 22.4      | 補足文・ラベル・表               |
| `--text-base--line-height` | 1.5          | 1.8    | 16 → 28.8      | 本文（`body` の 1.8 とそろえる） |
| `--text-lg--line-height`   | 1.556        | 1.7    | 18 → 30.6      | リード文                         |
| `--text-xl--line-height`   | 1.4          | 1.5    | 20 → 30        | h3                               |
| `--text-2xl--line-height`  | 1.333        | 1.4    | 24 → 33.6      | h2・h1（モバイル）               |
| `--text-3xl--line-height`  | 1.2          | 1.35   | 30 → 40.5      | h1（PC）・結果の数字             |
| `--text-4xl--line-height`  | 1.111        | 1.3    | 36 → 46.8      | トップの h1                      |
| `--text-5xl--line-height`  | 1            | 1.15   | 48 → 55.2      | 大きな結果の数字                 |
| `--text-6xl--line-height`  | 1            | 1.1    | 60 → 66        | 大きな結果の数字                 |

- 個別に `leading-*` を付けている箇所（`Label` の `leading-none` など）はそのまま優先される
- 高さ固定の部品（ボタン `h-10`、入力 `h-10`）は高さが変わらない
- 書体と字間は変えない（見出し Noto Serif JP 600/700、本文 Zen Kaku Gothic New、欧文・数字 Geist。`tracking-tight` は使わない）

### 3-4. 角丸・影・余白の基準（値の変更はなし、使い分けを決める）

| 項目 | 決定                                                                                                                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 角丸 | `--radius: 0.375rem`（6px）据え置き。操作部品（ボタン・入力・セレクト・タブ列）は `rounded-lg`（6px）、その内側の要素（タブ・セレクトの行・ツールチップ）は `rounded-md`（4.8px）、カードは `rounded-xl`（8.4px）。`rounded-2xl` 以上は使わない |
| 影   | 紙面の中の要素（カード・タブ・ボタン）は影なし。浮いている層（セレクトの一覧・シート）だけ `shadow-md` を 1 段で使う                                                                                                                            |
| 余白 | 4px 基準。使う値は 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px。カードの内側は 16px（モバイル）/ 24px（sm 以上）                                                                                                                                 |

---

## 4. 共通部品（components/ui、PR 1b）

「削除」のクラスを消し、「追加」のクラスを足す。書いていないクラスはそのまま。

### 4-1. button.tsx

| 対象                       | 現状                                                                                                           | 変更後                                                                          | 理由                                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 基本クラスのトランジション | `transition-all`                                                                                               | `transition-[color,background-color,border-color,box-shadow,opacity,transform]` | cycle-0 D-7。変わるプロパティだけを指定                                                                    |
| 基本クラスのフォーカス     | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`                                    | `focus-ring`                                                                    | cycle-0 D-3。塗りボタンでも 2px の藍の線が 2px 離れて出る（線 / ページ地 7.95:1）                          |
| `default` のホバー         | `hover:bg-primary/80`                                                                                          | `hover:bg-primary/90`                                                           | 白文字のコントラストが 4.87 → 6.23。ホバーで色が抜けすぎず「静か」                                         |
| `outline`                  | `… dark:border-input dark:bg-input/30 dark:hover:bg-input/50`                                                  | この 3 つを削除（ライトと同じ `border-border bg-background hover:bg-muted`）    | `--input` を不透明の濃い灰にするため。残すとダークで面が明るく浮く。文字があるので枠は 3:1 不要            |
| `destructive`              | `focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40` | 削除                                                                            | フォーカスは全種類 `focus-ring` で統一                                                                     |
| `size.sm`                  | `h-7`（28px）                                                                                                  | `h-8`（32px）                                                                   | 30 か所で使用。ベースラインの「32px 未満の操作要素」を解消。WCAG 2.5.8（24px）は満たした上で余裕を持たせる |
| `size.icon-sm`             | `size-7`                                                                                                       | `size-8`                                                                        | 同上                                                                                                       |

`active:not-aria-[haspopup]:translate-y-px`（押した瞬間の 1px）は残す。押した操作への応答なので。

### 4-2. input.tsx

| 対象       | 現状                                                                        | 変更後                                    | 理由                                                                     |
| ---------- | --------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------ |
| フォーカス | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` | `focus-field`                             | 枠そのものが 2px の藍になる。半透明の太いにじみをやめる                  |
| ダークの地 | `dark:bg-input/30`                                                          | 削除（`bg-transparent` のまま）           | 不透明の `--input` を 30% で敷くと面が浮く。枠 3.65:1 で入力欄だと分かる |
| 無効時の地 | `disabled:bg-input/50` `dark:disabled:bg-input/80`                          | `disabled:bg-muted`（ダークの指定は削除） | 濃い灰を敷かない。`opacity-50` と合わせて無効と分かる                    |

`h-10`、`text-base md:text-sm`（iOS の拡大防止）、`aria-invalid:*` はそのまま。

### 4-3. select.tsx

| 対象                       | 現状                                                                        | 変更後                   | 理由                                               |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------ | -------------------------------------------------- |
| `SelectTrigger` フォーカス | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` | `focus-field`            | 入力欄と同じ見え方                                 |
| `SelectTrigger` ダーク     | `dark:bg-input/30 dark:hover:bg-input/50`                                   | `dark:hover:bg-muted/50` | 入力欄と同じく地は透明。ホバーだけ薄い面           |
| `SelectTrigger` 小サイズ   | `data-[size=sm]:h-7`                                                        | `data-[size=sm]:h-8`     | ボタン `sm` とそろえる                             |
| `SelectContent` の枠       | `ring-1 ring-foreground/10`                                                 | `ring-1 ring-border`     | 罫線トークンに統一（見た目はほぼ同じ 1.22 → 1.44） |

### 4-4. tabs.tsx（tool-furusato-tax のコントラスト違反の解消）

| 対象                             | 現状                                                                                                                                                    | 変更後                                                                                    | 理由                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `tabsListVariants` の高さ        | `group-data-horizontal/tabs:h-8`（32px、タブ自体は約 25px）                                                                                             | `group-data-horizontal/tabs:h-10`（40px、タブ約 33px）                                    | 入力欄・ボタンの 40px とそろえる。押しやすさ                                                    |
| `TabsTrigger` 非アクティブの文字 | `text-foreground/60`（4.19:1）と `dark:text-muted-foreground`                                                                                           | `text-muted-foreground`（ダークの指定は削除）                                             | 6.25:1 / 6.94:1。ベースラインの color-contrast 違反（スマホ・PC）を解消                         |
| `TabsTrigger` トランジション     | `transition-all`                                                                                                                                        | `transition-[color,background-color,box-shadow]`                                          | D-7 と同じ                                                                                      |
| `TabsTrigger` フォーカス         | `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring`                      | `focus-ring`                                                                              | 統一                                                                                            |
| `TabsTrigger` アクティブ         | `data-active:bg-background` `group-data-[variant=default]/tabs-list:data-active:shadow-sm` `dark:data-active:border-input dark:data-active:bg-input/30` | `data-active:bg-card data-active:ring-1 data-active:ring-input`（影とダークの指定は削除） | 影をやめ、入力欄と同じ 3:1 の枠で「選択中」を示す。色だけに頼らずライト・ダークで同じ表現になる |

`data-active:text-foreground`、`line` 変種の指定、`after:` の下線はそのまま（line 変種は未使用）。

### 4-5. switch.tsx・radio-group.tsx・slider.tsx・accordion.tsx

| 対象                              | 現状                                                                                                        | 変更後                                                | 理由                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| `Switch` フォーカス               | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`                                 | `focus-ring`                                          | 統一                                                   |
| `Switch` トランジション           | `transition-all`                                                                                            | `transition-colors`                                   | D-7                                                    |
| `Switch` オフ（ダーク）           | `dark:data-unchecked:bg-input/80`                                                                           | 削除（`data-unchecked:bg-input` を使う）              | 不透明の `--input` でつまみ 4.19:1                     |
| `RadioGroupItem` フォーカス       | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`                                 | `focus-ring`                                          | 統一                                                   |
| `RadioGroupItem` ダークの地       | `dark:bg-input/30`                                                                                          | 削除                                                  | 入力欄と同じ扱い。枠は `border-input` で 3.65:1        |
| `Slider` つまみの地               | `bg-white`                                                                                                  | `bg-background`                                       | 生の色をトークンに。ダークでつまみだけ真っ白に光らない |
| `Slider` つまみのフォーカス       | `focus-visible:ring-3 focus-visible:outline-hidden`                                                         | `focus-ring`（`hover:ring-3` `active:ring-3` は残す） | 統一                                                   |
| `AccordionTrigger` トランジション | `transition-all`                                                                                            | `transition-colors`                                   | D-7                                                    |
| `AccordionTrigger` フォーカス     | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring` | `focus-ring`                                          | 統一                                                   |

### 4-6. card.tsx・sheet.tsx

| 対象                | 現状                                    | 変更後                                                                        | 理由                                                                                                                              |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `Card` の枠         | `ring-1 ring-foreground/10`             | `ring-1 ring-border`                                                          | 罫線トークンに統一。MASTER の「ホバーは罫線色を primary に」と同じ系統で扱える                                                    |
| `Card` の内側余白   | `[--card-spacing:--spacing(4)]`（16px） | `[--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)]`（16 / 24px） | 640px 以上で数字の周りに余白を取る。375 幅は 16px のままで横幅を減らさない。`data-[size=sm]` の 12px は詳細度が高いので維持される |
| `CardTitle` の太さ  | `font-medium`                           | `font-semibold`                                                               | 見出し書体 Noto Serif JP は 600/700 しか読み込んでいない。500 指定は 600 で代用されており、指定と表示を一致させる                 |
| `SheetContent` の影 | `shadow-lg`                             | `shadow-md`                                                                   | 浮く層の影は 1 段（3-4）。MASTER の点検 `rg "shadow-(lg                                                                           | xl  | 2xl)"` にかからないようにする |

---

## 5. 確認手順（C が実装後に行う）

1. `pnpm typecheck` `pnpm lint` `pnpm format:check` `pnpm test`
2. `pnpm build` のあと `pnpm test:visual` で差分を確認
   - 1a: 全 28 枚に差分が出る（行間・等幅数字）。375 幅で横スクロールが出ていないこと、1 文字だけの行が減っていることを見てから `pnpm test:visual:update`
   - 1b: 入力欄・タブ・ボタンのある画面に差分が出る
3. `pnpm test:a11y`: tool-furusato-tax の color-contrast（スマホ・PC）が消えることを確認し、`UPDATE_A11Y_BASELINE=1 pnpm test:a11y` で基準線を下げる。違反が増えたら差し戻す
4. キーボードで確認（ライト・ダーク両方）: 主ボタン、outline ボタン、入力欄、セレクト、タブ、スイッチ、ラジオで藍の 2px が見える。Shift+Tab で戻ったとき、ヘッダーの下に隠れない
5. DevTools の Rendering で `prefers-color-scheme: dark` にし、スクロールバーと日付入力などの UA 部品が暗くなっている（color-scheme）

## 6. この PR に入れないもの（PR 2 以降）

| 項目                                                                                                                                                         | 理由 / 担当 PR                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| cycle-0 B-1・B-2・B-4・B-5・D-1・D-2（リンクの個別フォーカス）・D-5・D-6                                                                                     | ページの構成。PR 2（トップ）                                            |
| B-3 のヒーロー一文の `text-xs sm:text-sm`                                                                                                                    | ページの変更。PR 2                                                      |
| 12px 未満の文字（`app/tools/furusato-tax/page.tsx` の `text-[11px]`、`AdSlot` / `subsidy-finder/ResultList` / `saas-metrics/MetricsPanel` の `text-[10px]`） | 各画面の PR で `text-xs` に                                             |
| `components/tools/hourly-wage/InputPanel.tsx` の `shadow-sm`                                                                                                 | 自前のタブ風ボタン。ツールの PR で `Tabs` か本仕様の 4-4 と同じ見た目に |
| tool-furusato-tax の scrollable-region-focusable                                                                                                             | 表の枠に `tabIndex={0}` と `aria-label`。ツールの PR で                 |
| 色の追加・書体の変更                                                                                                                                         | 今回は不要と判断。藍・朱・生成りの組み合わせは基準を満たしている        |

副作用として、`components/tools/subsidy-finder/InputPanel.tsx:94` の `border-input` の選択肢ボタンも枠が濃く（3.6:1）なる。選べる部品の境界として正しい方向なので、そのままでよい。
