"use client";

import { useEffect, useState } from "react";
import Grid from "../components/Grid";
import GridSP from "../components/GridSP";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App() {
  const [isSP, setIsSP] = useState(true); // スマホ判定

  // 画面幅が 500px 以上の場合は false にする
  useEffect(() => {
    const handleResize = () => {
      setIsSP(window.innerWidth < 500);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 初回のみ実行

  return (
    <div className="w-full h-full">
      {/* SPモードの切り替え */}
      <ErrorBoundary>
        {isSP ? (
          <GridSP />
        ) : (
          <Grid />
        )}
      </ErrorBoundary>
    </div>
  );
}
