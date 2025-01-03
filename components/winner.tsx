"use client";

import { useState } from "react";

// 勝利数の最大値と最小値
const maxWins = 99;
const minWins = 0;

// トロフィーを並べて表示できる最大
const maxDisplayWins = 4;

function adjustWinCount(value: number): number {
  if (value > maxWins) {
    return maxWins;
  } else if (value < minWins) {
    return minWins;
  }
  return value;
}

export default function WinnerCounter() {
  const [playerWins, setPlayerWins] = useState([0, 0, 0, 0, 0, 0]);
  const [playerDisplayTexts, setPlayerDisplayTexts] = useState([
    "🏆 × 0",
    "🏆 × 0",
    "🏆 × 0",
    "🏆 × 0",
    "🏆 × 0",
    "🏆 × 0",
  ]);

  const handleWinChange = (index: number, increment: number) => {
    const newWins = [...playerWins];
    const newCount = adjustWinCount(newWins[index] + increment);
    newWins[index] = newCount;

    const newDisplayTexts = [...playerDisplayTexts];
    if (newCount == 0) {
      newDisplayTexts[index] = "🏆 × 0";
    } else if (newCount <= maxDisplayWins) {
      newDisplayTexts[index] = "🏆".repeat(newCount);
    } else {
      newDisplayTexts[index] = "🏆 × " + newCount;
    }

    setPlayerWins(newWins);
    setPlayerDisplayTexts(newDisplayTexts);
  };

  return (
    <div className="p-3 h-full flex flex-col justify-center items-center gap-1">
      {playerWins.map((_, index) => (
        <div
          key={index}
          className="w-full grid grid-cols-2 place-content-between"
        >
          <div onClick={() => handleWinChange(index, 1)}>
            Player_{index + 1}
          </div>
          <div onClick={() => handleWinChange(index, -1)}>
            {playerDisplayTexts[index]}
          </div>
        </div>
      ))}
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 duration-200 hover:opacity-100"
        onClick={() => {
          setPlayerWins([0, 0, 0, 0, 0, 0]);
          setPlayerDisplayTexts([
            "🏆 × 0",
            "🏆 × 0",
            "🏆 × 0",
            "🏆 × 0",
            "🏆 × 0",
            "🏆 × 0",
          ]);
        }}
      >
        ↺
      </div>
    </div>
  );
}
