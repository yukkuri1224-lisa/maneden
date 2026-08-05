#!/usr/bin/env node
/**
 * JPXの「東証上場銘柄一覧(data_j.xls)」から 証券コード→33業種 を取得し、
 * lib/companies/companies.json の industry を更新する。
 *
 * ── 使い方 ────────────────────────────────────────────────
 *  1. 依存を追加（初回のみ）:  pnpm add -D xlsx
 *  2. 実行（引数なしでJPXから自動ダウンロード）:
 *       node scripts/enrich-industry.mjs
 *     ※ ローカルのファイルを使う場合はパスを渡す:
 *       node scripts/enrich-industry.mjs C:\Users\nre10\Downloads\data_j.xls
 *  3. pnpm run build && git add -A && git commit -m "data: 企業の業種を付与" && git push
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as XLSXns from "xlsx";

const XLSX = XLSXns.default ?? XLSXns;

const JPX_URL =
  "https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls";

const dir = dirname(fileURLToPath(import.meta.url));
const companiesPath = join(dir, "..", "lib", "companies", "companies.json");

async function loadWorkbook(xlsPath) {
  if (xlsPath) {
    console.log(`ローカルファイルを読み込み: ${xlsPath}`);
    return XLSX.read(readFileSync(xlsPath), { type: "buffer" });
  }
  console.log(`JPXから取得: ${JPX_URL}`);
  const res = await fetch(JPX_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`ダウンロード失敗: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return XLSX.read(buf, { type: "buffer" });
}

async function main() {
  const [, , xlsPath] = process.argv;
  const wb = await loadWorkbook(xlsPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  if (rows.length === 0) {
    console.error("シートが空です。");
    process.exit(1);
  }

  const headers = Object.keys(rows[0]);
  const codeKey =
    headers.find((h) => h === "コード") ??
    headers.find((h) => h.includes("コード"));
  const industryKey =
    headers.find((h) => h === "33業種区分") ??
    headers.find((h) => h.includes("業種区分"));
  if (!codeKey || !industryKey) {
    console.error("必要な列が見つかりません。ヘッダー一覧:", headers);
    process.exit(1);
  }
  console.log(`コード列="${codeKey}" / 業種列="${industryKey}"`);

  const map = new Map();
  for (const r of rows) {
    const code = String(r[codeKey] ?? "")
      .trim()
      .slice(0, 4);
    const industry = String(r[industryKey] ?? "").trim();
    if (code && industry && industry !== "-") map.set(code, industry);
  }
  console.log("業種マップ:", map.size, "件");

  const companies = JSON.parse(readFileSync(companiesPath, "utf-8"));
  let updated = 0;
  for (const c of companies) {
    const industry = map.get(String(c.securitiesCode).slice(0, 4));
    if (industry) {
      c.industry = industry;
      updated++;
    }
  }
  writeFileSync(
    companiesPath,
    `${JSON.stringify(companies, null, 2)}\n`,
    "utf-8",
  );
  console.log(`${updated}/${companies.length} 社の業種を更新しました。`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
