const nextConfig = {
  /* config options here */
  output: "export",
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        aggregateTimeout: 1000, // 300ms の遅延を追加
        poll: 1000, // 1秒ごとにファイルの変更をチェック
      };
    }
    return config;
  },
};

export default nextConfig;
