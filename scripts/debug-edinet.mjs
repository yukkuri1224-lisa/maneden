#!/usr/bin/env node
/**
 * EDINETのCSV(type=5)の生の中身を1社分だけ表示するデバッグ用スクリプト。
 * fetch-edinet.mjs で数値が取れないときの原因調査に使う。
 *   使い方: EDINET_API_KEY=... node scripts/debug-edinet.mjs 2024-06-25
 */
import { unzipSync } from "fflate";

const API_KEY = process.env.EDINET_API_KEY;
if (!API_KEY) {
  console.error("EDINET_API_KEY を設定してください。");
  process.exit(1);
}
const BASE = "https://api.edinet-fsa.go.jp/api/v2";
const date = process.argv[2] ?? "2024-06-25";

const list = await (
  await fetch(
    `${BASE}/documents.json?date=${date}&type=2&Subscription-Key=${API_KEY}`,
  )
).json();
const docs = (list.results ?? []).filter(
  (d) => d.docTypeCode === "120" && d.secCode,
);
console.log(
  `有報 ${docs.length} 件。先頭を解析:`,
  docs[0]?.filerName,
  docs[0]?.docID,
);
if (!docs[0]) process.exit(0);

const res = await fetch(
  `${BASE}/documents/${docs[0].docID}?type=5&Subscription-Key=${API_KEY}`,
);
console.log("HTTP", res.status, res.headers.get("content-type"));
const buf = new Uint8Array(await res.arrayBuffer());
console.log("bytes:", buf.length);

const files = unzipSync(buf);
console.log("=== ZIP内ファイル ===");
for (const k of Object.keys(files))
  console.log("  ", k, files[k].length, "bytes");

const csvKey = Object.keys(files).find((k) => k.endsWith(".csv"));
console.log("CSVキー:", csvKey);
if (csvKey) {
  const text = Buffer.from(files[csvKey]).toString("utf16le");
  const lines = text.split(/\r?\n/);
  console.log("=== 先頭3行（生） ===");
  lines
    .slice(0, 3)
    .forEach((l, i) => console.log(i, JSON.stringify(l.slice(0, 300))));
  console.log("=== 平均年間給与を含む行 ===");
  lines
    .filter((l) => /AverageAnnualSalary|平均年間給与/.test(l))
    .slice(0, 5)
    .forEach((l) => console.log(JSON.stringify(l)));
}
