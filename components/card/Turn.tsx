"use client";

import { useState } from "react";
import { Player } from "../../utils/types";

export default function TurnCounter(props: { players: Player[] }) {
  const { players } = props;

  const [turnCount, setTurnCount] = useState(0);
  const [turnPlayerIndex, setTurnPlayerIndex] = useState(0);
  const [isTurnCountMode, setIsTurnCountMode] = useState(true);

  const handleNext = () => {
    if (isTurnCountMode) {
      setTurnCount(turnCount + 1);
    } else {
      setTurnPlayerIndex((turnPlayerIndex + 1) % players.length);
    }
  };

  const handlePrevious = () => {
    if (isTurnCountMode) {
      setTurnCount((prevCount) => Math.max(prevCount - 1, 0));
    } else {
      setTurnPlayerIndex(
        (turnPlayerIndex - 1 + players.length) % players.length
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
      <p
        className={
          isTurnCountMode
            ? "text-6xl mt-4 leading-none cursor-pointer"
            : "text-4xl mt-4 leading-none cursor-pointer"
        }
        onClick={() => setIsTurnCountMode(
          (prevMode) => !prevMode
        )}
      >
        {isTurnCountMode ? turnCount : players[turnPlayerIndex].name}
      </p>
      <div className="mt-4 flex justify-center items-center">
        <button
          className="px-8 text-4xl leading-none cursor-pointer duration-200 hover:opacity-70"
          onClick={handlePrevious}
        >
          {"<"}
        </button>
        <button
          className="px-8 text-4xl leading-none cursor-pointer duration-200 hover:opacity-70"
          onClick={handleNext}
        >
          {">"}
        </button>
      </div>
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
        onClick={handleReset}
      >
        ↺
      </div>
    </div>
  );
}
