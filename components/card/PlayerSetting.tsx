import { useEffect } from "react";
import { Player } from "../../utils/types";
import { initialPlayers } from "../../utils/cardDefinitions";
import { setLocalStorage } from "../../utils/localFuncs";

export default function PlayerSetting({
  players,
  setPlayers,
}: {
  players: Player[];
  setPlayers: (arg: Player[]) => void;
}) {
  const handleNameChange = (index: number, newName: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = newName;
    setPlayers(newPlayers);
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newPlayers = [...players];
    newPlayers[index].color = newColor;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    // ランダムな色を生成し、新しいプレイヤーを追加
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const newPlayers = [
      ...players,
      { name: `Player ${players.length + 1}`, color: randomColor },
    ];
    setPlayers(newPlayers);
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  useEffect(() => {
    if (players === initialPlayers) return;
    setLocalStorage("players", JSON.stringify(players));
  }, [players]);

  return (
    <>
      <div className="p-6 h-full overflow-y-auto max-h-[400px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-thumb]:rounded-full">
        {players.map((player, index) => (
          <div key={index} className="flex items-center align-middle gap-1">
            <button
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
          className="mt-1 w-full px-2 duration-200 hover:opacity-70"
          onClick={addPlayer}
        >
          ＋
        </button>
      </div>
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
        onClick={() => {
          setPlayers(initialPlayers);
          setLocalStorage("players", JSON.stringify(initialPlayers));
        }}
      >
        ↺
      </div>
    </>
  );
}
