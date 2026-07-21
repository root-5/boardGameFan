"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";

const Grid = dynamic(() => import("../components/Grid"), {
  ssr: false,
  loading: () => <div className="w-full h-dvh" />,
});
const GridSP = dynamic(() => import("../components/GridSP"), {
  ssr: false,
  loading: () => <div className="w-full h-dvh" />,
});

export default function App() {
  const [isSP, setIsSP] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSP(window.innerWidth < 500);
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
