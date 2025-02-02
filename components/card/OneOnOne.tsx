"use client";

import { useState, useRef } from "react";

const tokenMax = 99;
const tokenMin = 0;

function ajustTokenValue(value: number): number {
  if (value > tokenMax) {
    return tokenMax;
  } else if (value < tokenMin) {
    return tokenMin;
  }
  return value;
}

export default function OneOnOne() {
  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointChange = (player: number, adjustment: number) => {
    if (player === 1) {
      setPlayer1Points((prevPoints) => ajustTokenValue(prevPoints + adjustment));
    } else {
      setPlayer2Points((prevPoints) => ajustTokenValue(prevPoints + adjustment));
    }
  };

  const handleInputChange = (player: number, value: number) => {
    if (player === 1) {
      setPlayer1Points(ajustTokenValue(value));
    } else {
      setPlayer2Points(ajustTokenValue(value));
    }
  };

  const handleMouseDown = (player: number, adjustment: number) => {
    handlePointChange(player, adjustment);
    intervalRef.current = setInterval(() => {
      handlePointChange(player, adjustment);
    }, 100);
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="p-4 h-full flex justify-center items-center gap-2">
      <div className="flex flex-col justify-center items-center gap-1">
        <button
          onMouseDown={() => handleMouseDown(1, 1)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="text-3xl"
        >
          +
        </button>
        <input
          type="number"
          value={player1Points}
          onChange={(e) => handleInputChange(1, parseInt(e.target.value))}
          className="block w-20 text-5xl bg-transparent outline-none text-center"
        />
        <button
          onMouseDown={() => handleMouseDown(1, -1)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="text-3xl"
        >
          -
        </button>
      </div>
      <div
        className="text-4xl"
      >
        -
      </div>
      <div className="flex flex-col justify-center items-center gap-1">
        <button
          onMouseDown={() => handleMouseDown(2, 1)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="text-3xl"
        >
          +
        </button>
        <input
          type="number"
          value={player2Points}
          onChange={(e) => handleInputChange(2, parseInt(e.target.value))}
          className="block w-20 text-5xl bg-transparent outline-none text-center"

        />
        <button
          onMouseDown={() => handleMouseDown(2, -1)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="text-3xl"
        >
          -
        </button>
      </div>
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
        onClick={() => {
          setPlayer1Points(0);
          setPlayer2Points(0);
        }}
      >
        ↺
      </div>
    </div>
  );
}