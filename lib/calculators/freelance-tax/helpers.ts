/** value を unit の倍数に切り捨てる（0 以下は 0） */
export function floorTo(value: number, unit: number): number {
  if (value <= 0) return 0;
  return Math.floor(value / unit) * unit;
}

/** 0 未満を 0 に丸める */
export function clampMin0(value: number): number {
  return value > 0 ? value : 0;
}
