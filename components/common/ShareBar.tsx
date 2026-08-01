import { CopyLinkButton } from "@/components/common/CopyLinkButton";
import { ShareButton } from "@/components/common/ShareButton";

/**
 * ツール結果の共有バー。リンクコピー＋（任意で）X シェア。
 */
export function ShareBar({
  shareText,
  hashtags,
  note,
}: {
  shareText?: string;
  hashtags?: string[];
  note?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyLinkButton />
      {shareText && <ShareButton text={shareText} hashtags={hashtags} />}
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
