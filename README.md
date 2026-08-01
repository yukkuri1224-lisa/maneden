# マネ電（maneden）

登録不要・完全無料の、ビジネスパーソン／フリーランス向け計算・シミュレーションツール集。
詳細な要件は [`REQUIREMENTS.md`](./REQUIREMENTS.md) を参照。

## 技術スタック

- Next.js 16（App Router） / React 19 / TypeScript（strict）
- Tailwind CSS v4 + shadcn/ui（base-nova スタイル） / lucide-react
- Recharts（可視化） / zod + react-hook-form（入力バリデーション）
- Vitest（単体テスト） / ESLint + Prettier + husky + lint-staged
- ホスティング: Vercel（予定）

## 開発環境（重要: WSL + Windows 運用）

このリポジトリは **Windows 側（`C:\Users\nre10\bizcalc-hub`）** に置き、
**Node 系コマンドは PowerShell（Windows）で実行**する。パッケージマネージャは **pnpm**。

```powershell
pnpm install       # 依存インストール
pnpm dev           # 開発サーバー (http://localhost:3000)
pnpm run build     # 本番ビルド
pnpm run lint      # ESLint
pnpm run typecheck # 型チェック (tsc --noEmit)
pnpm test          # Vitest
pnpm run format    # Prettier で整形
```

## ディレクトリ構成

- `app/` — App Router のページ・レイアウト・`sitemap.ts` / `robots.ts`
- `components/common/` — Header / Footer / Breadcrumb / ToolCard など共通部品
- `components/ui/` — shadcn/ui 生成コンポーネント（原則手を入れない）
- `lib/tools-registry.ts` — 全ツールのメタ情報（一元管理・追加時の唯一の情報源）
- `lib/calculators/` — 各ツールの計算ロジック（純粋関数・テスト対象、Phase 1〜）
- `lib/constants/` — 税率テーブル等の定数（マジックナンバー集約、Phase 1〜）
- `lib/seo/` — JSON-LD 生成ヘルパー

## 環境変数

`.env.example` を参照。`NEXT_PUBLIC_SITE_URL` のみ（sitemap / OGP / canonical のベース URL）。
ローカルでは未設定でも動作する。

## コミット前チェック

husky + lint-staged により、コミット時に staged ファイルへ ESLint / Prettier が自動適用される。
初回のみ `pnpm run prepare` でフックを有効化する。
