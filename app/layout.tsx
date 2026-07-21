import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Tools!",
  description: "For board games, card games, and more! Streamer friendly!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="./manifest.json" />
      </head>
      <body
        className={`relative antialiased h-screen select-none overflow-x-hidden overflow-y-hidden`}
      >
        {/* SP はカードが全面を覆うため背景画像を読み込まない（~800KB 削減） */}
        <img
          src="/okumono_moku14.png"
          alt=""
          className="absolute h-full w-full z-[-10] object-cover hidden min-[500px]:block"
          decoding="async"
        />
        {children}
      </body>
    </html>
  );
}
