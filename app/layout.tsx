import type { Metadata } from "next";
import Script from "next/script";
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
        {/* 外部スクリプトとして読み込む方法 */}
        <Script
          id="service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", () => {
                  navigator.serviceWorker
                    .register("./sw.js")
                    .then((registration) => {
                      console.log(
                        "Service Worker registered with scope:",
                        registration.scope
                      );
                    })
                    .catch((error) => {
                      console.error("Service Worker registration failed:", error);
                    });
                });
              }
            `,
          }}
        />

      </head>
      <body
        className={`relative antialiased h-screen select-none overflow-x-hidden overflow-y-hidden`}
      >
        {/* Image を使用してしまうと読み込みが狂ったため img を使用 */}
        <img
          src="/okumono_moku14.png"
          alt="background"
          className="absolute h-full w-full z-[-10] object-cover"
        />
        {children}
      </body>
    </html>
  );
}
