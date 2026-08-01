import { TAX_TABLES } from "@/lib/constants/tax-tables";

import { clampMin0, floorTo } from "./helpers";

/**
 * 国民健康保険料を概算する（単身世帯・全国平均的なモデル）。
 * 賦課基準額 = 総所得金額等 − 43万円。
 * 各区分＝ min(賦課基準額 × 所得割率 ＋ 均等割, 上限)。介護分は40歳以上のみ。
 * 自治体差が大きいため、あくまで概算。
 */
export function nationalHealthInsurance(
  businessIncome: number,
  isOver40: boolean,
): number {
  const nhi = TAX_TABLES.nationalHealthInsurance;
  const base = clampMin0(businessIncome - nhi.basisDeduction);

  const component = (params: {
    rate: number;
    perCapita: number;
    cap: number;
  }) => Math.min(Math.round(base * params.rate) + params.perCapita, params.cap);

  let total = component(nhi.medical) + component(nhi.support);
  if (isOver40) {
    total += component(nhi.longTermCare);
  }

  // 百円未満切り捨て（概算）
  return floorTo(total, 100);
}
