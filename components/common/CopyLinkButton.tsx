"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * 現在ページのURL（クエリ付き＝そのシミュレーション条件）をクリップボードにコピーする。
 */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // クリップボードが使えない環境は無視
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      {copied ? "コピーしました" : "リンクをコピー"}
    </Button>
  );
}
