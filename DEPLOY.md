# マネ電（maneden）公開手順（デプロイ）

Next.js 16 + Vercel を前提とした公開手順です。コマンドは **Windows の PowerShell**（`C:\Users\nre10\bizcalc-hub`）で実行します。

---

## 0. 公開前チェックリスト（先に埋める）

- [ ] `app/about/page.tsx` … 運営者名・屋号・連絡先を記入
- [ ] `app/contact/page.tsx` … 問い合わせ先（メール or フォーム）を記入
- [ ] `app/privacy-policy/page.tsx` / `app/terms/page.tsx` … テンプレを確認・調整
- [ ] `lib/constants/subsidies.ts` … 補助金の金額・要件・公式URLを最新情報で確認
- [ ] 本番ドメインを決める（未定なら Vercel の `*.vercel.app` で先に公開してOK）

最終確認（すべて緑になること）:

```powershell
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
```

---

## 1. デプロイ方法A：GitHub 連携（推奨・自動CI/CD）

コミットするたびに自動でデプロイされ、プレビューも付きます。

```powershell
# まだコミットしていなければ
git add -A
git commit -m "feat: マネ電 初回リリース"

# GitHub にリポジトリを作成して push（gh CLI がある場合）
gh repo create maneden --public --source=. --remote=origin --push
# gh が無ければ、GitHubで空リポジトリを作成してから:
#   git remote add origin https://github.com/<ユーザー名>/maneden.git
#   git branch -M main
#   git push -u origin main
```

1. https://vercel.com にログイン → **Add New… → Project**
2. 先ほどの GitHub リポジトリを **Import**
3. Framework は自動で **Next.js** が選択される。**Deploy** を押すだけ
4. 環境変数（下記「2. 環境変数」）を設定して再デプロイ

## 1'. デプロイ方法B：Vercel CLI（GitHub不要）

```powershell
npm install -g vercel   # 初回のみ
vercel login            # ブラウザ認証
vercel                  # プレビュー公開（対話に従う）
vercel --prod           # 本番公開
```

---

## 2. 環境変数（重要）

Vercel の **Project → Settings → Environment Variables** に追加:

| 変数名                 | 値（例）                               | 用途                                           |
| ---------------------- | -------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://本番ドメイン`（末尾スラなし） | sitemap / robots / OGP / canonical のベースURL |

- 未設定だと既定値 `https://maneden.com` が使われます。**必ず実際の公開URL**に設定してください。
- 設定後は **Redeploy** で反映されます。

---

## 3. 独自ドメイン（任意）

Vercel の **Settings → Domains** でドメインを追加し、表示される DNS レコード（A / CNAME）をドメイン側に設定します。反映後に `NEXT_PUBLIC_SITE_URL` をそのドメインに更新して再デプロイ。

---

## 4. 公開後チェック

- [ ] `https://<ドメイン>/sitemap.xml` が正しいURLを列挙している
- [ ] `https://<ドメイン>/robots.txt` の Sitemap 行が本番URLになっている
- [ ] 各ツールがスマホ実機で動く（スライダー・グラフ・共有・ダークモード）
- [ ] スマホで「ホーム画面に追加」ができる（PWAマニフェスト）
- [ ] SNSでURLを貼るとOGPカードが出る（X の Post Inspector 等で確認）
- [ ] **Google Search Console** にサイト登録 → `sitemap.xml` を送信
- [ ] Lighthouse（Chrome DevTools）でモバイル計測 → Performance/Best Practices/SEO を確認

---

## 5. 運用（任意）

- **アナリティクス**: GA4 or Vercel Analytics を導入（計測ID発行 → 環境変数管理）
- **アフィリエイト**: 各枠（`AdSlot`）を実広告タグに差し替え（審査後）
- **OGP画像**: `app/tools/[tool]/opengraph-image.tsx` を追加すると、シェア時に結果入りの画像を自動生成できる（拡散力向上）
- **税制・料率の更新**: `lib/constants/` の各テーブルを年度ごとに見直す
