import type { Page } from "@playwright/test";

/**
 * UI レビューサイクル用の撮影対象（`pnpm ui:capture`）。
 * 回帰テスト（visual.spec.ts）とは別物で、レビュアーが画面を「読む」ための画像を作る。
 * 対象を増やすときはここに 1 件足す。計算ロジックや URL には触れない。
 */

/** レビューで使う 3 つの幅（スマホ・タブレット・PC） */
export const CAPTURE_VIEWPORTS = [
  { name: "375", width: 375, height: 812, isMobile: true, hasTouch: true },
  { name: "768", width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: "1440", width: 1440, height: 900, isMobile: false, hasTouch: false },
] as const;

export interface CaptureState {
  /** ファイル名に使う状態名（input / result / error / dark など） */
  name: string;
  /** 撮影前に URL に付けるクエリ（共有リンクと同じ形式） */
  query?: string;
  /** ダークモードで撮る */
  dark?: boolean;
  /** ページを開いたあとに行う操作（入力・フォーカスなど） */
  act?: (page: Page) => Promise<void>;
  /** 上から何画面ぶん撮るか（省略時は対象の maxSegments） */
  segments?: number;
}

export interface CaptureTarget {
  /** `UI_TARGET` に指定する名前。保存先 reviews/<name>/ にも使う */
  name: string;
  path: string;
  /** 1 状態あたりの最大枚数。縦に長いページの画像読み込み量を抑える */
  maxSegments: number;
  states: CaptureState[];
}

/** 手取り計算の年収欄に値を打ち込み、確定させる */
async function typeIncome(page: Page, value: string) {
  const field = page.locator("#income");
  await field.fill(value);
  await field.blur();
}

export const CAPTURE_TARGETS: CaptureTarget[] = [
  {
    name: "home",
    path: "/",
    maxSegments: 8,
    states: [{ name: "default" }, { name: "dark", dark: true, segments: 2 }],
  },
  {
    name: "tool-salary-take-home",
    path: "/tools/salary-take-home",
    maxSegments: 6,
    states: [
      // 入力: 初期表示で年収欄にフォーカスがある状態（フォーカスの見え方も確認する）
      {
        name: "input",
        segments: 2,
        act: (page) => page.locator("#income").focus(),
      },
      // 結果: 年収 800 万円を入力したあとの計算結果
      { name: "result", act: (page) => typeIncome(page, "8000000") },
      // エラー: 数値でない文字を入力したとき（現状は黙って最小値に戻る）
      { name: "error", segments: 2, act: (page) => typeIncome(page, "abc") },
      { name: "dark", dark: true, segments: 2 },
    ],
  },
];
