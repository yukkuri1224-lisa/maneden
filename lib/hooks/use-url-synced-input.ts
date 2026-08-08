"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

/**
 * ツールの入力状態を URL クエリと同期させる共通フック。
 *
 * - 初回マウント時に URL クエリから入力を復元する（共有リンクの再現）。
 * - 入力が変わるたびに `history.replaceState` で URL を更新する
 *   （履歴を汚さず、リロードや共有をしても状態が残る）。
 *
 * 各ツールで重複していた
 * 「useSearchParams + useState 初期化 + replaceState の useEffect」を
 * 一箇所へ集約したもの。`decode` / `encode` は各ツールの schema が提供する。
 *
 * @param decode URL クエリから入力値へ復元する関数（schema 由来）
 * @param encode 入力値を URL クエリへ直列化する関数（schema 由来）
 * @returns `input`（現在値）、`setInput`（生のセッター＝リセット等に使用）、
 *          `patch`（部分更新の簡易アップデータ＝多くは onChange にそのまま渡す）
 */
export function useUrlSyncedInput<T extends object>(
  decode: (params: URLSearchParams) => T,
  encode: (value: T) => URLSearchParams,
): {
  input: T;
  setInput: Dispatch<SetStateAction<T>>;
  patch: (partial: Partial<T>) => void;
} {
  const searchParams = useSearchParams();

  // 初回のみ URL クエリから復元する（初期化関数は初回マウント時だけ実行される）。
  const [input, setInput] = useState<T>(() =>
    decode(new URLSearchParams(searchParams.toString())),
  );

  // 入力変更後に URL を同期する（副作用なので描画後に実行。初回マウントはスキップ）。
  // encode は各ツールの schema が提供するモジュール関数（安定参照）のため、
  // 依存に含めても input が変わったときだけ実行される。
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.history.replaceState(null, "", `?${encode(input).toString()}`);
  }, [input, encode]);

  // 部分更新のための簡易アップデータ（多くのツールはこれをそのまま onChange へ渡す）。
  const patch = useCallback((partial: Partial<T>) => {
    setInput((prev) => ({ ...prev, ...partial }) as T);
  }, []);

  return { input, setInput, patch };
}
