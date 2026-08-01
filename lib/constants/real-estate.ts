import type { BuildingStructure } from "@/lib/calculators/real-estate-yield/types";

/**
 * 建物構造ごとの法定耐用年数（新築・住宅用の概算）。
 * 減価償却費の算定に使用する。
 */
export const USEFUL_LIFE_YEARS: Record<BuildingStructure, number> = {
  rc: 47, // 鉄筋コンクリート造
  steel: 34, // 重量鉄骨造
  wood: 22, // 木造
};
