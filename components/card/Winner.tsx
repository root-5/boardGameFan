"use client";

/**
 * 勝利数カウンター
 *
 * プレイヤー名タップで＋1、トロフィー側タップで −1。
 * 表示は 4 個まではトロフィー連打、それ以上は「🏆 × N」形式です。
 */

import { useState, useEffect, useRef } from "react";
import type { Player } from "@/utils/types";
import { clamp } from "@/utils/clamp";
import ResetButton from "@/components/card/module/ResetButton";

const MAX_WINS = 99;
const MIN_WINS = 0;
/** トロフィーを並べて表示できる上限 */
const MAX_DISPLAY_WINS = 4;

function formatWins(count: number): string {
  if (count === 0) return "🏆 × 0";
  if (count <= MAX_DISPLAY_WINS) return "🏆".repeat(count);
  return `🏆 × ${count}`;
}

export default function Winner({ players = [] }: { players?: Player[] }) {
  const [playerWins, setPlayerWins] = useState(() => players.map(() => 0));
  const prevLengthRef = useRef(players.length);

  // プレイヤー人数が変わったときだけ勝利数をリセット（名前変更などでは維持）
  useEffect(() => {
    if (prevLengthRef.current !== players.length) {
      prevLengthRef.current = players.length;
      setPlayerWins(players.map(() => 0));
    }
  }, [players]);

  const handleWinChange = (index: number, delta: number) => {
    setPlayerWins((prev) => {
      const next = [...prev];
      next[index] = clamp(prev[index] + delta, MIN_WINS, MAX_WINS);
      return next;
    });
  };

  return (
    <div className="relative p-6 h-full flex flex-col justify-center items-center gap-1 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-thumb]:rounded-full">
      {players.map((player, index) => (
        <div
          key={`${player.name}-${index}`}
          className="w-full grid grid-cols-2 place-content-between"
        >
          {/*
            button のデフォルトスタイル（shrink / padding）だと
            グリッドセルを満たせず左上に寄るため、幅と見た目を div 相当に揃える
          */}
          <button
            type="button"
            className="w-full cursor-pointer bg-transparent border-0 p-0 m-0 text-inherit font-inherit"
            onClick={() => handleWinChange(index, 1)}
          >
            {player.name}
          </button>
          <button
            type="button"
            className="w-full cursor-pointer bg-transparent border-0 p-0 m-0 text-inherit font-inherit"
            onClick={() => handleWinChange(index, -1)}
          >
            {formatWins(playerWins[index] ?? 0)}
          </button>
        </div>
      ))}
      <ResetButton
        label="Reset wins"
        onClick={() => setPlayerWins(players.map(() => 0))}
      />
    </div>
  );
}
