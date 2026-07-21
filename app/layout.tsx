import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * ルートレイアウト（サーバーコンポーネント）
 *
 * メタデータ・背景・全体の土台のみを担当し、
 * カード UI 本体は page.tsx 側のクライアントコンポーネントで描画します。
 */

export const metadata: Metadata = {
  title: "Game Tools!",
  description: "For board games, card games, and more! Streamer friendly!",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="relative antialiased h-screen select-none overflow-hidden">
        {/* SP はカードが全面を覆うため背景画像を読み込まない（~800KB 削減） */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/okumono_moku14.png"
          alt=""
          className="absolute inset-0 z-[-10] h-full w-full object-cover hidden min-[500px]:block"
          decoding="async"
        />
        {children}
      </body>
    </html>
  );
}
