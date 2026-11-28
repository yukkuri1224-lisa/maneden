import Link from "next/link";
import {
  BookOpenCheck,
  History,
  MessageSquareWarning,
  UserRound,
} from "lucide-react";

import {
  AI_USE_SUMMARY,
  author,
  CONTACT_PATH,
  EDITORIAL_POLICY_PATH,
  METHODOLOGY_PATH,
  reviewer,
} from "@/lib/editorial";
import type { Guide } from "@/lib/guides";

/**
 * ガイド記事末尾の「信頼性ブロック」（YMYL / E-E-A-T 対応）。
 * 参考文献（一次情報）・執筆と確認の体制・更新履歴・誤りの報告窓口をまとめて示す。
 * 掲載内容は lib/editorial.ts と lib/guides.ts の事実情報のみから組み立てる。
 */
export function GuideTrust({ guide }: { guide: Guide }) {
  return (
    <section
      aria-label="この記事の信頼性について"
      className="mt-14 max-w-2xl space-y-6 text-sm leading-relaxed"
    >
      <div className="rounded-md border p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
          <BookOpenCheck className="size-4 text-primary" aria-hidden />
          参考文献
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          本記事は、以下の公的機関・公式サイトの情報（一次情報）をもとに作成しています。
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          {guide.sources.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-md border p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
          <UserRound className="size-4 text-primary" aria-hidden />
          執筆・確認体制
        </h2>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-muted-foreground">
          <dt className="font-medium text-foreground">執筆</dt>
          <dd>
            {author.profileUrl ? (
              <a href={author.profileUrl} className="text-primary underline">
                {author.name}
              </a>
            ) : (
              <Link href="/about" className="text-primary underline">
                {author.name}
              </Link>
            )}
            （{author.role}）
          </dd>
          <dt className="font-medium text-foreground">監修</dt>
          <dd>
            {reviewer
              ? `${reviewer.name}（${reviewer.qualifications.join("・")}）`
              : "なし（税理士・FP等の有資格者による監修は受けていません）"}
          </dd>
          <dt className="font-medium text-foreground">AIの利用</dt>
          <dd>{AI_USE_SUMMARY}</dd>
          <dt className="font-medium text-foreground">確認方法</dt>
          <dd>
            公開前に、記載した税率・制度を上記の一次情報と照合しています。詳しくは
            <Link
              href={EDITORIAL_POLICY_PATH}
              className="text-primary underline"
            >
              編集方針
            </Link>
            と
            <Link href={METHODOLOGY_PATH} className="text-primary underline">
              計算方法と検証
            </Link>
            をご覧ください。
          </dd>
        </dl>
      </div>

      <div className="rounded-md border p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
          <History className="size-4 text-primary" aria-hidden />
          更新履歴
        </h2>
        <ul className="mt-3 space-y-1 text-muted-foreground">
          {guide.revisions.map((r) => (
            <li key={`${r.date}-${r.note}`}>
              <span className="font-medium text-foreground">{r.date}</span>：
              {r.note}
            </li>
          ))}
        </ul>
      </div>

      <p className="flex items-start gap-2 rounded-md bg-muted/40 p-4 text-xs text-muted-foreground">
        <MessageSquareWarning className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          内容に誤りや古い情報を見つけた場合は、
          <Link href={CONTACT_PATH} className="text-primary underline">
            お問い合わせ
          </Link>
          からお知らせください。確認のうえ速やかに訂正し、更新履歴に記録します。
        </span>
      </p>
    </section>
  );
}
