#!/usr/bin/env node
/**
 * EDINET（有価証券報告書）から上場企業の
 * 「平均年間給与・平均年齢・平均勤続年数・従業員数」を取得し、
 * lib/companies/companies.json を生成するスクリプト。
 *
 * ── 事前準備 ──────────────────────────────────────────────
 *  1. EDINET APIキーを取得（無料）: https://api.edinet-fsa.go.jp/ で登録し
 *     Subscription-Key を発行する。
 *  2. 依存を追加:  pnpm add -D fflate
 *  3. 実行（3月決算の有報が集中する時期＝6月下旬あたりを指定）:
 *       EDINET_API_KEY=あなたのキー node scripts/fetch-edinet.mjs 2024-06-20 2024-06-28
 *     期間を広げるほど社数が増えます。まずは数日分で試すのがおすすめ。
 *  4. 生成された lib/companies/companies.json を commit → push（自動デプロイ）
 *
 * ── 注意 ──────────────────────────────────────────────────
 *  - EDINETのCSV(type=5)は UTF-16LE・タブ区切り。
 *  - コンテキスト（提出会社・当期）の判定や業種の付与は、初回実行後に
 *    実データを見ながら微調整が必要な場合があります（下の TODO 参照）。
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { unzipSync } from "fflate";

const API_KEY = process.env.EDINET_API_KEY;
if (!API_KEY) {
  console.error("環境変数 EDINET_API_KEY を設定してください。");
  process.exit(1);
}

const BASE = "https://api.edinet-fsa.go.jp/api/v2";
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "companies",
  "companies.json",
);

const [, , startArg, endArg] = process.argv;
if (!startArg) {
  console.error(
    "使い方: node scripts/fetch-edinet.mjs <開始日> [終了日]  例) 2024-06-20 2024-06-28",
  );
  process.exit(1);
}

const ELEMENTS = {
  averageSalary:
    "jpcrp_cor:AverageAnnualSalaryInformationAboutReportingCompanyInformationAboutEmployees",
  averageAge:
    "jpcrp_cor:AverageAgeYearsInformationAboutReportingCompanyInformationAboutEmployees",
  averageTenure:
    "jpcrp_cor:AverageLengthOfServiceYearsInformationAboutReportingCompanyInformationAboutEmployees",
  employees: "jpcrp_cor:NumberOfEmployees",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function dateRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  const last = new Date(end ?? start);
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

async function listDocuments(date) {
  const url = `${BASE}/documents.json?date=${date}&type=2&Subscription-Key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  // docTypeCode 120 = 有価証券報告書 / secCode あり = 上場
  return (json.results ?? []).filter(
    (d) => d.docTypeCode === "120" && d.secCode,
  );
}

async function fetchCsvRows(docID) {
  const url = `${BASE}/documents/${docID}?type=5&Subscription-Key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const buf = new Uint8Array(await res.arrayBuffer());
  let files;
  try {
    files = unzipSync(buf);
  } catch {
    return null;
  }
  const key = Object.keys(files).find((k) => k.endsWith(".csv"));
  if (!key) return null;
  const text = Buffer.from(files[key]).toString("utf16le");
  return text.split(/\r?\n/).map((line) => line.split("\t"));
}

function pickValue(rows, elementId) {
  const rowsForEl = rows.filter((r) => r[0] === elementId);
  if (rowsForEl.length === 0) return null;
  // TODO: 提出会社・当期のコンテキストを厳密に選ぶ場合はここを調整
  const row =
    rowsForEl.find(
      (r) => /Current/.test(r[2] ?? "") && !/Prior/.test(r[2] ?? ""),
    ) ?? rowsForEl[0];
  const n = Number(String(row[row.length - 1]).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

async function main() {
  const results = [];
  const seen = new Set();

  for (const date of dateRange(startArg, endArg)) {
    const docs = await listDocuments(date);
    console.log(`${date}: 有報 ${docs.length} 件`);
    for (const doc of docs) {
      const secCode = String(doc.secCode).slice(0, 4);
      if (seen.has(secCode)) continue;
      seen.add(secCode);
      await sleep(300); // EDINETへの負荷を避ける
      const rows = await fetchCsvRows(doc.docID);
      if (!rows) continue;
      const salary = pickValue(rows, ELEMENTS.averageSalary);
      if (!salary) continue;
      results.push({
        slug: secCode,
        name: doc.filerName,
        securitiesCode: secCode,
        industry: "その他", // TODO: 業種はEDINET一覧に無いため後で付与
        averageSalary: Math.round(salary),
        averageAge: pickValue(rows, ELEMENTS.averageAge) ?? undefined,
        averageTenure: pickValue(rows, ELEMENTS.averageTenure) ?? undefined,
        employees: pickValue(rows, ELEMENTS.employees) ?? undefined,
        fiscalYear: doc.periodEnd ?? undefined,
      });
      console.log(`  ✓ ${doc.filerName}: ${salary.toLocaleString()}円`);
    }
  }

  results.sort((a, b) => b.averageSalary - a.averageSalary);
  writeFileSync(OUT, `${JSON.stringify(results, null, 2)}\n`, "utf-8");
  console.log(`\n${results.length} 社を ${OUT} に書き出しました。`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
