export interface NisaInput {
  /** 初期投資額（一括・円） */
  initialLumpSum: number;
  /** 毎月の積立額（円） */
  monthlyContribution: number;
  /** 想定年利（%） */
  annualReturnPercent: number;
  /** 積立年数（年） */
  years: number;
}

export interface NisaYearPoint {
  /** 経過年（1〜years） */
  year: number;
  /** その年末の累計元本（投資した合計・円） */
  principal: number;
  /** その年末の評価額（元本＋運用益・円） */
  balance: number;
}

export interface NisaResult {
  /** 累計元本（投資総額・円） */
  totalPrincipal: number;
  /** 最終評価額（円） */
  futureValue: number;
  /** 運用益（円）＝ futureValue − totalPrincipal */
  totalGain: number;
  /** NISA の非課税メリット（円）＝ 運用益 × 20.315%（課税口座なら取られる税額） */
  taxSaved: number;
  /** 生涯投資枠（1,800万円）に到達したか */
  reachedLifetimeCap: boolean;
  /** 生涯投資枠に到達した年（未到達なら null） */
  capReachedYear: number | null;
  /** 年ごとの推移（チャート用） */
  timeline: NisaYearPoint[];
}
