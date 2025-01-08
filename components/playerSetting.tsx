import { useState } from "react";

export default function PlayerSetting({ onPlayersChange }) {
  const [players, setPlayers] = useState([
    { name: "Player 1", color: "#ff0000" },
    { name: "Player 2", color: "#00ff00" },
  ]);

  const handleNameChange = (index, newName) => {
    const newPlayers = [...players];
    newPlayers[index].name = newName;
    setPlayers(newPlayers);
    onPlayersChange(newPlayers);
  };

  const handleColorChange = (index, newColor) => {
    const newPlayers = [...players];
    newPlayers[index].color = newColor;
    setPlayers(newPlayers);
    onPlayersChange(newPlayers);
  };

  const addPlayer = () => {
    const newPlayers = [...players, { name: `Player ${players.length + 1}`, color: "#0000ff" }];
    setPlayers(newPlayers);
    onPlayersChange(newPlayers);
  };

  const removePlayer = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
    onPlayersChange(newPlayers);
  };

  return (
    <div>
      {players.map((player, index) => (
        <div key={index}>
          <input
            type="text"
            value={player.name}
            onChange={(e) => handleNameChange(index, e.target.value)}
          />
          <input
            type="color"
            value={player.color}
            onChange={(e) => handleColorChange(index, e.target.value)}
          />
          <button onClick={() => removePlayer(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addPlayer}>Add Player</button>
    </div>
  );
}
