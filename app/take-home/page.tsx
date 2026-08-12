import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { formatManYen } from "@/lib/format";
import { INCOME_LEVELS } from "@/lib/longtail/levels";
import { siteConfig } from "@/lib/site-config";

const title = "年収別の手取り一覧｜300万〜1500万円の手取り額を早見";
const description =
  "年収300万〜1,500万円の手取り額（独身・扶養なしの概算）を一覧で確認。各年収のページで社会保険料・所得税・住民税の内訳と月あたりの手取りを解説しています。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/take-home" },
  openGraph: { title, description, url: `${siteConfig.url}/take-home` },
};

const rows = INCOME_LEVELS.map((l) => {
  const r = calculateSalaryTakeHome({
    income: l.income,
    isOver40: false,
    hasSpouse: false,
    dependents: 0,
  });
  return { ...l, netIncome: r.netIncome, rate: r.netIncomeRate };
});

export default function TakeHomeHubPage() {
  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "年収別の手取り", href: "/take-home" },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        年収別の手取り一覧
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        年収（額面）ごとの手取り額の目安です（独身・扶養なし・協会けんぽの全国平均料率での概算）。金額をクリックすると、社会保険料・所得税・住民税の内訳や月あたりの手取りを確認できます。
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/60">
              <th className="px-4 py-3 text-left font-semibold">
                年収（額面）
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                手取り（年）
              </th>
              <th className="px-4 py-3 text-right font-semibold">月あたり</th>
              <th className="px-4 py-3 text-right font-semibold">手取り率</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.slug}
                className={i % 2 === 1 ? "bg-muted/30" : undefined}
              >
                <th scope="row" className="px-4 py-2.5 text-left font-medium">
                  <Link
                    href={`/take-home/${r.slug}`}
                    className="text-primary underline underline-offset-2"
                  >
                    年収{r.man}万円
                  </Link>
                </th>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  約{formatManYen(r.netIncome, 0)}
                </td>
                <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">
                  約{formatManYen(r.netIncome / 12, 1)}
                </td>
                <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">
                  {r.rate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        家族構成や年齢を反映した手取りは
        <Link href="/tools/salary-take-home" className="text-primary underline">
          会社員の手取り計算ツール
        </Link>
        で計算できます。
      </p>
    </Container>
  );
}
