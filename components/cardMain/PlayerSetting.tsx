import { Player } from "../../utils/types";
import { initialPlayers } from "../../utils/cardDefinitions";

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
    const newPlayers = [
      ...players,
      { name: `Player ${players.length + 1}`, color: "#0000ff" },
    ];
    setPlayers(newPlayers);
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  return (
    <>
      <div className="px-6 py-4 h-full overflow-y-auto">
        {players.map((player, index) => (
          <div key={index} className="flex items-center align-middle gap-1">
            <button
              className="block px-2 pb-1 rounded pointer-cursor duration-200 hover:bg-red-500"
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
          className="w-full px-2 duration-200 hover:opacity-70"
          onClick={addPlayer}
        >
          ＋
        </button>
      </div>
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 duration-200 hover:opacity-100"
        onClick={() => {
          setPlayers(initialPlayers);
        }}
      >
        ↺
      </div>
    </>
  );
}
