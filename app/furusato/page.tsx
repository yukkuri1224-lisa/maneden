import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { calculateFurusato } from "@/lib/calculators/furusato-tax";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { formatManYen } from "@/lib/format";
import { INCOME_LEVELS } from "@/lib/longtail/levels";
import { siteConfig } from "@/lib/site-config";

const title = "年収別ふるさと納税 上限額一覧｜300万〜1500万円の目安";
const description =
  "年収300万〜1,500万円のふるさと納税 控除上限額（独身・扶養なしの目安）を一覧で確認。各年収のページで自己負担2,000円で寄付できる額の計算方法と注意点を解説しています。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/furusato" },
  openGraph: { title, description, url: `${siteConfig.url}/furusato` },
};

const rows = INCOME_LEVELS.map((l) => {
  const s = calculateSalaryTakeHome({
    income: l.income,
    isOver40: false,
    hasSpouse: false,
    dependents: 0,
  });
  const limit = calculateFurusato({
    incomeType: "salary",
    income: l.income,
    socialInsurance: s.socialInsurance,
    hasSpouse: false,
    dependents: 0,
  }).donationLimit;
  return { ...l, limit };
});

export default function FurusatoHubPage() {
  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "年収別ふるさと納税", href: "/furusato" },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        年収別 ふるさと納税 上限額一覧
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        年収（額面）ごとの、自己負担2,000円で寄付できるふるさと納税の控除上限額の目安です（独身・扶養なしの概算）。年収をクリックすると、計算方法や家族構成・控除による違いを確認できます。
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/60">
              <th className="px-4 py-3 text-left font-semibold">
                年収（額面）
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                控除上限額の目安
              </th>
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
                    href={`/furusato/${r.slug}`}
                    className="text-primary underline underline-offset-2"
                  >
                    年収{r.man}万円
                  </Link>
                </th>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  約{formatManYen(r.limit, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        家族構成や社会保険料を反映した上限額は
        <Link href="/tools/furusato-tax" className="text-primary underline">
          ふるさと納税の上限額シミュレーター
        </Link>
        で計算できます。
      </p>
    </Container>
  );
}
