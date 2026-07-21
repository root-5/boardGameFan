"use client";

/**
 * プレイヤー設定カード
 *
 * 名前・色の編集、追加・削除が可能です。
 * 変更はローカルストレージへ自動保存されます。
 */

import { useEffect } from "react";
import type { Player } from "@/utils/types";
import { initialPlayers } from "@/utils/cardDefinitions";
import { setLocalStorage } from "@/utils/localFuncs";
import ResetButton from "@/components/card/module/ResetButton";

type PlayerSettingProps = {
  players?: Player[];
  setPlayers?: (players: Player[]) => void;
};

export default function PlayerSetting({
  players = [],
  setPlayers,
}: PlayerSettingProps) {
  const updatePlayers = (next: Player[]) => {
    setPlayers?.(next);
  };

  const handleNameChange = (index: number, newName: string) => {
    updatePlayers(
      players.map((player, i) =>
        i === index ? { ...player, name: newName } : player
      )
    );
  };

  const handleColorChange = (index: number, newColor: string) => {
    updatePlayers(
      players.map((player, i) =>
        i === index ? { ...player, color: newColor } : player
      )
    );
  };

  const addPlayer = () => {
    const randomColor = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
    updatePlayers([
      ...players,
      { name: `Player ${players.length + 1}`, color: randomColor },
    ]);
  };

  const removePlayer = (index: number) => {
    updatePlayers(players.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (players === initialPlayers) return;
    setLocalStorage("players", JSON.stringify(players));
  }, [players]);

  return (
    <>
      <div className="p-6 h-full overflow-y-auto max-h-[400px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-thumb]:rounded-full">
        {players.map((player, index) => (
          <div key={index} className="flex items-center gap-1">
            <button
              type="button"
              className="block px-2 pb-1 rounded duration-200 hover:bg-red-500"
              onClick={() => removePlayer(index)}
            >
              -
            </button>
            <input
              type="text"
              value={player.name}
              className="block w-1/2 flex-1 bg-transparent"
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
            <input
              type="color"
              value={player.color}
              className="block w-6 cursor-pointer bg-transparent"
              onChange={(e) => handleColorChange(index, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="mt-1 w-full px-2 duration-200 hover:opacity-70"
          onClick={addPlayer}
        >
          ＋
        </button>
      </div>
      <ResetButton
        label="Reset players"
        onClick={() => {
          updatePlayers(initialPlayers);
          setLocalStorage("players", JSON.stringify(initialPlayers));
        }}
      />
    </>
  );
}
