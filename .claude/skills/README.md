# プロジェクトスキル（.claude/skills）

Claude Code がこのリポジトリで作業するときに自動で読み込むプロジェクトスキルです。
以下の公開リポジトリから、取り込み時点のスナップショットをそのままコピーしています（内容は無改変）。

| # | スキル | 用途 | 出典 |
|---|---|---|---|
| 1 | frontend-design | 洗練された UI / Web サイト構築 | anthropics/skills @ e4bb5d9 (Apache-2.0) |
| 2 | canvas-design | ポスター・ビジュアル素材 | anthropics/skills @ e4bb5d9 (Apache-2.0) |
| 3 | algorithmic-art | コードによるアート生成 | anthropics/skills @ e4bb5d9 (Apache-2.0) |
| 4 | theme-factory | 配色とタイポグラフィの統一 | anthropics/skills @ e4bb5d9 (Apache-2.0) |
| 5 | remotion-create | React でアニメーション動画 | remotion-dev/skills @ a3f4098 |
| 6 | docx | Word 文書 | anthropics/skills @ e4bb5d9 (各フォルダの LICENSE.txt) |
| 7 | pptx | スライド資料 | anthropics/skills @ e4bb5d9 (各フォルダの LICENSE.txt) |
| 8 | xlsx | スプレッドシート | anthropics/skills @ e4bb5d9 (各フォルダの LICENSE.txt) |
| 9 | pdf | PDF の抽出・結合 | anthropics/skills @ e4bb5d9 (各フォルダの LICENSE.txt) |
| 10 | doc-coauthoring | ドキュメント共同執筆 | anthropics/skills @ e4bb5d9 |
| 11 | copywriting | LP・見出し・CTA | coreyhaines31/marketingskills @ 2bf95ed (MIT) |
| 12 | seo-audit | 技術 / ページ内 SEO 監査 | coreyhaines31/marketingskills @ 2bf95ed (MIT) |
| 13 | cro | コンバージョン改善 | coreyhaines31/marketingskills @ 2bf95ed (MIT) |
| 14 | emails | メールキャンペーン | coreyhaines31/marketingskills @ 2bf95ed (MIT) |
| 15 | social | SNS コンテンツ | coreyhaines31/marketingskills @ 2bf95ed (MIT) |
| 16 | writing-plans | 実装計画の作成 | obra/superpowers @ 22f0b46 (MIT) |
| 17 | subagent-driven-development | サブエージェント主導開発 | obra/superpowers @ 22f0b46 (MIT) |
| 18 | using-git-worktrees | Git worktree で並行作業 | obra/superpowers @ 22f0b46 (MIT) |
| 19 | mcp-builder | MCP サーバー構築 | anthropics/skills @ e4bb5d9 (Apache-2.0) |
| 20 | skill-creator | スキルの作成・評価 | anthropics/skills @ e4bb5d9 (Apache-2.0) |
| 21 | webapp-testing | Playwright でのブラウザテスト | anthropics/skills @ e4bb5d9 (Apache-2.0) |
| 22 | systematic-debugging | 根本原因の特定 | obra/superpowers @ 22f0b46 (MIT) |
| 23 | test-driven-development | TDD | obra/superpowers @ 22f0b46 (MIT) |
| 24 | requesting-code-review | コードレビュー依頼 | obra/superpowers @ 22f0b46 (MIT) |
| 25 | verification-before-completion | 完了前の検証 | obra/superpowers @ 22f0b46 (MIT) |
| 26 | ui-ux-pro-max | UI/UX 設計・デザインシステム生成 | nextlevelbuilder/ui-ux-pro-max-skill @ 11ca2b3 (MIT) |
| 27 | shadcn | shadcn/ui の追加・構成・スタイリング規約 | shadcn-ui/ui @ 0e5b2e6 (MIT) |
| 28 | design-review | UI/UX レビュー（0〜4 点、Before/After/Why、出典つき）。ui-reviewer が使う | humbleteam/design-review @ 2a9916e (MIT) |
| 29 | accessibility-audit | WCAG 2.2 の 18 項目による点検（P0〜P2）。a11y-qa が使う | humbleteam/accessibility-audit @ 5f70e8a (MIT) |
| 30 | vercel-react-best-practices | React / Next.js の性能面の実装ルール。frontend-engineer が使う | vercel-labs/agent-skills @ 5a37a63 `skills/react-best-practices` (MIT) |
| 31 | web-design-guidelines | Web Interface Guidelines による UI コード点検。a11y-qa が使う。ルールは同梱（実行時に取得しない） | vercel-labs/agent-skills @ 5a37a63（ルール本体は web-interface-guidelines @ 434b7f9） (MIT) |
| 32 | ui-review-cycle | 実装 → 撮影 → レビュー → 判定を最大 3 周まわす手順（このリポジトリ独自） | 自作 |

ライセンス本文: `LICENSE.humbleteam`（MIT, Humbleteam）、`LICENSE.vercel`（MIT, Vercel Labs）、`LICENSE.ui-ux-pro-max`（MIT）、`LICENSE.shadcn`（MIT）、`LICENSE.superpowers`（MIT, Jesse Vincent）、`LICENSE.marketingskills`（MIT, Corey Haines）、
anthropics/skills 由来は各スキルフォルダ内の `LICENSE.txt`。

28〜31 は取り込み前に全文を読み、外部への通信や不審な指示がないことを確認しています。
vercel-react-best-practices はリポジトリ内のフォルダ名 `react-best-practices` を、スキル名に合わせて改名しています（中身は無改変）。
design-review と accessibility-audit は README・CHANGELOG・CI 設定を除き、SKILL.md と references だけを取り込んでいます。

## UI 開発のエージェント

`.claude/agents/` に UI 改修用の 4 エージェントを置いています。使い方は `ui-review-cycle` スキルを参照してください。

| エージェント | 役割 | 書き込み |
|---|---|---|
| ui-designer | デザインシステムと改修仕様 | できる |
| ui-reviewer | スクリーンショットのレビューと採点 | できない |
| frontend-engineer | 実装と修正 | できる |
| a11y-qa | 検査の実行と品質判定 | できない（`.claude/hooks/allow-test-commands.mjs` で検査コマンドに限定） |

## 更新方法

上流の最新版に追従したいときは、各リポジトリを clone して該当フォルダを上書きコピーし、
この表のコミット SHA を更新してください。
