"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNav, type MobileNavItem } from "@/components/common/MobileNav";
import { cn } from "@/lib/utils";

/**
 * ヘッダーのナビゲーション。現在地をハイライトし、モバイルはシートに切り替える。
 */
export function HeaderNav({ items }: { items: MobileNavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <MobileNav items={items} />
    </>
  );
}
