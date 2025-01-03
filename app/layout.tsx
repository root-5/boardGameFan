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
      </head>
      <body
        className={`relative antialiased h-screen select-none overflow-hidden`}
      >
        <img
          src="/bg.jpg"
          alt="background"
          className="absolute h-full w-full z-[-10] object-contain"
        />
        {children}
      </body>
    </html>
  );
}
