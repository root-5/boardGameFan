/**
 * Next.js 設定
 *
 * Cloudflare Pages 向けに静的エクスポート（output: "export"）を使用します。
 * ビルド成果物は out/ に出力されます。
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  webpack: (config, { dev }) => {
    if (dev) {
      // 一部環境（コンテナ等）でのファイル監視安定化
      config.watchOptions = {
        aggregateTimeout: 1000,
        poll: 1000,
      };
    }
    return config;
  },
};

export default nextConfig;
