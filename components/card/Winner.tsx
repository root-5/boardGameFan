"use client";

import { useSelector, useDispatch } from "react-redux";
import { Player } from "../../utils/types";
import { setPlayerWins, resetPlayerWins } from "../../store/winnerSlice";

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
  const playerWins = useSelector((state: { winner: number[] }) => state.winner);
  const dispatch = useDispatch();

  // 勝利数と勝利数表示更新する関数
  const handleWinChange = (index: number, increment: number) => {
    const newCount = adjustWinCount(playerWins[index] + increment);
    dispatch(setPlayerWins({ index, value: newCount }));
  };

  // プレイヤー数に変更があった際はステートを更新
  if (players.length !== playerWins.length) {
    dispatch(resetPlayerWins(players.length));
  }

  return (
    <div className="p-6 h-full flex flex-col items-center gap-1 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-thumb]:rounded-full">
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
            {playerWins[index] === 0
              ? "🏆 × 0"
              : playerWins[index] <= maxDisplayWins
              ? "🏆".repeat(playerWins[index])
              : "🏆 × " + playerWins[index]}
          </div>
        </div>
      ))}
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
        onClick={() => dispatch(resetPlayerWins(players.length))}
      >
        ↺
      </div>
    </div>
  );
}
