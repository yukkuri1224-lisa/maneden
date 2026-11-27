#!/usr/bin/env node
/**
 * a11y-qa エージェント専用の PreToolUse フック。
 * Bash で実行できるのを「検査だけのコマンド」に限る。期待画像や基準値の更新、
 * ファイルの書き換え、コマンドの連結は止める（終了コード 2 で Claude に理由を返す）。
 */
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const command = String(input?.tool_input?.command ?? "").trim();

const ALLOWED = [
  /^pnpm (test|typecheck|lint|format:check|build|test:a11y|test:visual)( [\w./:=@-]+)*$/,
  /^git (diff|status|log|show)( [\w./:=@^~-]+)*$/,
];
// 許可したコマンドでも、次の引数は書き込みになるので止める
const FORBIDDEN_ARGS = /(^| )(-u|--update[\w-]*|--output[\w=./-]*|--fix)( |$)/;
// コマンドの連結・リダイレクト・置換・環境変数の前置き
const SHELL_META = /[;&|<>`$\n]/;

const ok =
  !SHELL_META.test(command) &&
  !FORBIDDEN_ARGS.test(command) &&
  ALLOWED.some((re) => re.test(command));

if (!ok) {
  process.stderr.write(
    `a11y-qa は検査コマンドだけを実行できます（拒否: ${command}）。` +
      "使えるのは pnpm test / typecheck / lint / format:check / build / test:a11y / test:visual と、" +
      "git diff / status / log / show です。更新系の引数（-u, --update-snapshots, --fix, --output）は使えません。\n",
  );
  process.exit(2);
}
process.exit(0);
