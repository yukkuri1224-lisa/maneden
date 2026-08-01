"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface MobileNavItem {
  href: string;
  label: string;
  disabled?: boolean;
}

/**
 * モバイル用のナビゲーション（ハンバーガー → シート）。
 * リンククリックで自動的に閉じる。
 */
export function MobileNav({ items }: { items: MobileNavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
      <SheetTrigger
        aria-label="メニューを開く"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "md:hidden",
        )}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {items.map((item) =>
            item.disabled ? (
              <span
                key={item.href}
                className="px-3 py-2 text-sm text-muted-foreground"
              >
                {item.label}（準備中）
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
