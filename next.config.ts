import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 親ディレクトリ (C:\Users\nre10) の lockfile を誤検出しないよう、
  // ワークスペースのルートをこのプロジェクトに固定する。
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      // 慣用的な短い法務URLを正規ページへ集約する。
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
    ];
  },
};

export default nextConfig;
