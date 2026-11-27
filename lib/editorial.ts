/**
 * 編集・制作体制に関する情報の一元管理（E-E-A-T / YMYL 対応）。
 *
 * 運営者・執筆者・監修者の情報は「事実のみ」を掲載する。
 * 実在しない人物・資格・経歴を作ってはいけない（YMYL では虚偽表示が最も重い減点要因になる）。
 * 監修者を迎えた場合は `reviewer` に実在の情報を設定すると、ガイド記事・構造化データへ自動反映される。
 */

export const EDITORIAL_POLICY_PATH = "/editorial-policy";
export const METHODOLOGY_PATH = "/methodology";
export const CONTACT_PATH = "/contact";

/** 編集方針ページの最終更新日（表示用 / ISO） */
export const EDITORIAL_POLICY_UPDATED = "2026年11月27日";
export const EDITORIAL_POLICY_UPDATED_ISO = "2026-11-27";

export interface EditorialPerson {
  /** 表示名（実名またはハンドルネーム） */
  name: string;
  /** 役割（例: 執筆・編集） */
  role: string;
  /** 保有資格。ない場合は空配列（無資格であることを隠さない） */
  qualifications: string[];
  /** 経験・専門性の説明（事実のみ） */
  bio: string;
  /** プロフィールページの URL（任意） */
  profileUrl?: string;
}

/** 執筆・編集の責任者（運営者） */
export const author: EditorialPerson = {
  name: "まねでん運営",
  role: "執筆・編集・ツール開発",
  qualifications: [],
  bio: "個人で本サイトを運営し、記事の執筆、計算ツールの設計・開発、税率データの更新を担当しています。税理士・ファイナンシャルプランナー等の有資格者ではないため、記事・ツールはすべて国税庁・厚生労働省・金融庁などの一次情報を根拠に作成しています。",
};

/**
 * 監修者（有資格者）。未設定の間は「監修者なし」と正直に表示する。
 * 例: { name: "山田 太郎", role: "監修", qualifications: ["税理士（登録番号 000000）"], bio: "...", profileUrl: "https://..." }
 */
export const reviewer = null as EditorialPerson | null;

/** 生成AIの利用状況（記事末尾の執筆・確認体制に表示）。運営者回答（2026-11-27）: 利用している */
export const AI_USE_SUMMARY =
  "構成案・下書き・校正に生成AIを使用しています。数値は公式資料から取り、運営者が一次情報と照合してから公開しています。";
