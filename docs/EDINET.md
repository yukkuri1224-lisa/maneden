# 企業年収データベースの更新（EDINET）

`/companies`（企業の平均年収）ページは `lib/companies/companies.json` を元に静的生成されます。
このJSONは、**EDINET（金融庁の開示システム）の有価証券報告書**から取得したデータで更新します。

現在はデモ用の**サンプル企業**が入っています。以下の手順で**実データ**に置き換えてください。

## 手順

### 1. EDINET APIキーを取得（無料）

https://api.edinet-fsa.go.jp/ で登録し、**Subscription-Key** を発行します。

### 2. 依存を追加（初回のみ）

```powershell
cd C:\Users\nre10\bizcalc-hub
pnpm add -D fflate
```

### 3. 取得スクリプトを実行

有価証券報告書は「3月決算 → 決算から3ヶ月以内（＝6月末まで）提出」が多いので、
**最新年度のデータは当年の6月下旬**を指定します（例は2026年）。

```powershell
$env:EDINET_API_KEY="あなたのキー"
node scripts/fetch-edinet.mjs 2026-06-22 2026-06-30
```

- 期間を広げるほど社数が増えます。まずは数日分で動作確認を。
- `lib/companies/companies.json` が実データで上書きされます。

### 4. 反映（デプロイ）

```powershell
git add -A
git commit -m "data: 企業年収データを更新（EDINET）"
git push
```

→ Vercelが自動で企業ページを再生成します（`/companies` と各社ページ）。

## 補足・既知のTODO

- **業種**：EDINETの一覧APIには業種が無いため、暫定で「その他」になります。証券コード→業種の対応表を用意すると、企業ページの「同じ業種」表示が有効になります。
- **コンテキスト選択**：`pickValue()` は「当期」を優先する簡易判定です。実データを見て、提出会社・個別の値が正しく取れているか確認し、必要なら調整してください。
- **文字コード**：EDINETのCSVは UTF-16LE 前提でデコードしています。
- 数値がうまく取れない場合は、取得したCSVの1社分を確認し、要素IDやコンテキスト列の位置に合わせて調整します（初回実行後に一緒に微調整しましょう）。

## 業種（33業種）を付与する

EDINETには業種が無いため、初期は全社「その他」です。JPXの上場銘柄一覧で業種を付与できます。

1. JPXの一覧をダウンロード（無料・登録不要）:
   https://www.jpx.co.jp/markets/statistics-equities/misc/01.html
   →「東証上場銘柄一覧 (Excel)」＝ `data_j.xls`
2. 依存を追加（初回のみ）: `pnpm add -D xlsx`
3. 実行:
   ```powershell
   node scripts/enrich-industry.mjs C:\Users\nre10\Downloads\data_j.xls
   ```
   → `companies.json` の各社 `industry` が33業種に更新されます。
4. `git add -A && git commit -m "data: 企業の業種を付与" && git push`

付与後は、各企業ページに正しい業種が表示され、「同じ業種の企業」導線が有効になります。

## 異常値の除外

- `lib/companies/data.ts` で平均年収が **150万〜2500万円** の範囲外は自動除外（桁違い等の抽出ミス対策）。
- `fetch-edinet.mjs` も取得時に同じ範囲でスキップします。

## データの正確性・出典

- 数値はすべて**有価証券報告書（公開情報）**が出典です。各企業ページにも出典と「最新値はEDINETで要確認」の注記を表示しています。
