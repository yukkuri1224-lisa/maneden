"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * ライト/ダークテーマの切り替え。
 * 表示アイコンは CSS の dark: バリアントで出し分けるため state は持たない。
 * 初期テーマは layout の no-flash スクリプトが localStorage / OS 設定から適用する。
 */
export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage が使えない環境は無視
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="テーマを切り替え"
      onClick={toggle}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
