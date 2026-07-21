"use client";

/**
 * ターンカウンター
 *
 * 表示をタップすると「総ターン数」と「現在のプレイヤー」を切り替えます。
 */

import { useState } from "react";
import type { Player } from "@/utils/types";
import ResetButton from "@/components/card/module/ResetButton";

export default function Turn({ players = [] }: { players?: Player[] }) {
  const [turnCount, setTurnCount] = useState(0);
  const [turnPlayerIndex, setTurnPlayerIndex] = useState(0);
  const [isTurnCountMode, setIsTurnCountMode] = useState(true);

  const handleNext = () => {
    if (isTurnCountMode) {
      setTurnCount((prev) => prev + 1);
    } else if (players.length > 0) {
      setTurnPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  const handlePrevious = () => {
    if (isTurnCountMode) {
      setTurnCount((prev) => Math.max(prev - 1, 0));
    } else if (players.length > 0) {
      setTurnPlayerIndex(
        (prev) => (prev - 1 + players.length) % players.length
      );
    }
  };

  const handleReset = () => {
    if (isTurnCountMode) {
      setTurnCount(0);
    } else {
      setTurnPlayerIndex(0);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <p className="text-2xl">Turn</p>
      <button
        type="button"
        className={
          isTurnCountMode
            ? "text-6xl mt-4 leading-none cursor-pointer"
            : "text-4xl mt-4 leading-none cursor-pointer"
        }
        onClick={() => setIsTurnCountMode((prev) => !prev)}
      >
        {isTurnCountMode
          ? turnCount
          : (players[turnPlayerIndex]?.name ?? "-")}
      </button>
      <div className="mt-4 flex justify-center items-center">
        <button
          type="button"
          className="px-8 text-4xl leading-none cursor-pointer duration-200 hover:opacity-70"
          onClick={handlePrevious}
        >
          {"<"}
        </button>
        <button
          type="button"
          className="px-8 text-4xl leading-none cursor-pointer duration-200 hover:opacity-70"
          onClick={handleNext}
        >
          {">"}
        </button>
      </div>
      <ResetButton label="Reset turn" onClick={handleReset} />
    </div>
  );
}
