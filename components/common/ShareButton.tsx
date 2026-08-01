"use client";

import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  /** シェア本文 */
  text: string;
  /** シェアする URL（省略時は現在ページ相当を付与しない） */
  url?: string;
  /** ハッシュタグ（# なし） */
  hashtags?: string[];
}

/**
 * X（Twitter）シェアボタンの基本形。Phase 2 で結果ページから利用する。
 */
export function ShareButton({ text, url, hashtags }: ShareButtonProps) {
  function handleShare() {
    const params = new URLSearchParams();
    params.set("text", text);
    // url 未指定なら現在ページ（URLクエリ付き＝そのシミュレーション）を共有
    params.set("url", url ?? window.location.href);
    if (hashtags?.length) params.set("hashtags", hashtags.join(","));

    window.open(
      `https://twitter.com/intent/tweet?${params.toString()}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="size-4" />
      Xでシェア
    </Button>
  );
}
