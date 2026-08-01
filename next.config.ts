import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 親ディレクトリ (C:\Users\nre10) の lockfile を誤検出しないよう、
  // ワークスペースのルートをこのプロジェクトに固定する。
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
