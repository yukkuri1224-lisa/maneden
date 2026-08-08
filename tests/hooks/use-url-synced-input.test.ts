import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// next/navigation の useSearchParams を差し替え、任意のクエリを注入できるようにする。
const mocks = vi.hoisted(() => ({
  searchParams: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => mocks.searchParams,
}));

import { useUrlSyncedInput } from "@/lib/hooks/use-url-synced-input";

type TestInput = { a: number; b: number };

// 各ツールの schema が担う decode / encode の最小実装。
const decode = (params: URLSearchParams): TestInput => ({
  a: Number(params.get("a") ?? 1),
  b: Number(params.get("b") ?? 2),
});

const encode = (value: TestInput) =>
  new URLSearchParams({ a: String(value.a), b: String(value.b) });

beforeEach(() => {
  mocks.searchParams = new URLSearchParams();
  window.history.replaceState(null, "", "/");
});

describe("useUrlSyncedInput", () => {
  it("初期値を URL クエリから復元する（共有リンクの再現）", () => {
    mocks.searchParams = new URLSearchParams("a=10&b=20");
    const { result } = renderHook(() => useUrlSyncedInput(decode, encode));
    expect(result.current.input).toEqual({ a: 10, b: 20 });
  });

  it("クエリが無ければ decode の既定値を使う", () => {
    const { result } = renderHook(() => useUrlSyncedInput(decode, encode));
    expect(result.current.input).toEqual({ a: 1, b: 2 });
  });

  it("初回マウントでは URL を書き換えない", () => {
    const spy = vi.spyOn(window.history, "replaceState");
    renderHook(() => useUrlSyncedInput(decode, encode));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("patch で部分更新すると state と URL が同期する", () => {
    const { result } = renderHook(() => useUrlSyncedInput(decode, encode));
    act(() => {
      result.current.patch({ a: 99 });
    });
    expect(result.current.input).toEqual({ a: 99, b: 2 });
    expect(window.location.search).toContain("a=99");
    expect(window.location.search).toContain("b=2");
  });

  it("setInput で全体を置き換えられる（リセット等の用途）", () => {
    mocks.searchParams = new URLSearchParams("a=10&b=20");
    const { result } = renderHook(() => useUrlSyncedInput(decode, encode));
    act(() => {
      result.current.setInput({ a: 1, b: 2 });
    });
    expect(result.current.input).toEqual({ a: 1, b: 2 });
    expect(window.location.search).toContain("a=1");
  });
});
