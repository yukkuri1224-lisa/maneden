import type { Metadata } from "next";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { ToolCard } from "@/components/common/ToolCard";
import { tools } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "ツール一覧",
  description:
    "まねでんで使える、税金・経営・不動産の計算＆シミュレーションツールの一覧。すべて登録不要・無料。",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ツール一覧", href: "/tools" },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold">ツール一覧</h1>
      <p className="mt-2 text-muted-foreground">
        目的に合わせて計算ツールを選べます。すべて登録不要・無料でご利用いただけます。
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </Container>
  );
}
