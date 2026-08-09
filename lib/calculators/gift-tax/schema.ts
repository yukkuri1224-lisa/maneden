import type { GiftTaxInput, GiftType } from "./types";

export const AMOUNT_MIN = 0;
export const AMOUNT_MAX = 100_000_000;
export const AMOUNT_STEP = 100_000;

const GIFT_TYPES: GiftType[] = ["special", "general"];

export const DEFAULT_INPUT: GiftTaxInput = {
  amount: 5_000_000,
  giftType: "special",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function encodeInputToParams(input: GiftTaxInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set("amt", String(input.amount));
  params.set("type", input.giftType === "general" ? "g" : "s");
  return params;
}

export function decodeInputFromParams(params: URLSearchParams): GiftTaxInput {
  const d = DEFAULT_INPUT;
  const rawAmount = params.get("amt");
  const parsed = rawAmount === null ? d.amount : Number(rawAmount);
  const amount = Number.isFinite(parsed)
    ? clamp(parsed, AMOUNT_MIN, AMOUNT_MAX)
    : d.amount;

  const giftType: GiftType = params.get("type") === "g" ? "general" : "special";
  // 念のため許容値のみ通す
  const safeType = GIFT_TYPES.includes(giftType) ? giftType : d.giftType;

  return { amount, giftType: safeType };
}
