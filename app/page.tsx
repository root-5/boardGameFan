"use client";

/**
 * エントリページ
 *
 * 画面幅 500px 未満を SP とし、GridSP / Grid を切り替えて表示します。
 * Three.js を含むため、両 Grid は SSR 無効の dynamic import です。
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";

const Grid = dynamic(() => import("@/components/Grid"), {
  ssr: false,
  loading: () => <div className="w-full h-dvh" />,
});

const GridSP = dynamic(() => import("@/components/GridSP"), {
  ssr: false,
  loading: () => <div className="w-full h-dvh" />,
});

/** SP / PC の切り替え幅（px） */
const SP_BREAKPOINT = 500;

export default function App() {
  const [isSP, setIsSP] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSP(window.innerWidth < SP_BREAKPOINT);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-full">
      <ErrorBoundary>
        {isSP === null ? (
          <div className="w-full h-dvh" />
        ) : isSP ? (
          <GridSP />
        ) : (
          <Grid />
        )}
      </ErrorBoundary>
    </div>
  );
}
