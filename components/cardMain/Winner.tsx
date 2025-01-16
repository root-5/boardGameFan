"use client";

import { useState } from "react";
import { Player } from "../../utils/types";

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

export default function WinnerCounter({ players }: { players: Player[] }) {
  const [playerWins, setPlayerWins] = useState(players.map(() => 0));
  const [playerDisplayTexts, setPlayerDisplayTexts] = useState(
    players.map(() => "🏆 × 0")
  );

  // 勝利数と勝利数表示更新する関数
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

  // プレイヤー数に変更があった際はステートを更新
  if (players.length !== playerWins.length) {
    setPlayerWins(players.map(() => 0));
    setPlayerDisplayTexts(players.map(() => "🏆 × 0"));
  }

  return (
    <div className="p-3 h-full flex flex-col items-center gap-1 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-thumb]:rounded-full">
      {players.map((player, index) => (
        <div
          key={index}
          className="w-full grid grid-cols-2 place-content-between"
        >
          <div
            className="cursor-pointer"
            onClick={() => handleWinChange(index, 1)}
          >
            {player.name}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleWinChange(index, -1)}
          >
            {playerDisplayTexts[index]}
          </div>
        </div>
      ))}
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 duration-200 hover:opacity-100"
        onClick={() => {
          setPlayerWins(players.map(() => 0));
          setPlayerDisplayTexts(players.map(() => "🏆 × 0"));
        }}
      >
        ↺
      </div>
    </div>
  );
}
