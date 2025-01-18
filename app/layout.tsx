"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../store/store";

// export const metadata: Metadata = {
//   title: "Game Tools!",
//   description: "For board games, card games, and more! Streamer friendly!",
// };

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
      </head>
      <body
        className={`relative antialiased h-screen select-none overflow-x-hidden`}
      >
        {/* Image を使用してしまうと読み込みが狂ったため img を使用 */}
        <img
          src="/okumono_moku14.png"
          alt="background"
          className="absolute h-full w-full z-[-10] object-cover"
        />
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
