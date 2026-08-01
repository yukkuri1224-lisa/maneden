import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";

/**
 * 準備中の静的ページ用の簡易プレースホルダ（法務ページ等）。
 * 本文は Phase 2.5 で追加する。
 */
export function PlaceholderPage({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: title, href },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-4 text-muted-foreground">
        このページは準備中です。内容は今後追加されます。
      </p>
    </Container>
  );
}
