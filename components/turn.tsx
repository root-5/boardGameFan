"use client";

import { useState } from "react";

export default function TurnCounter() {
  const [turnCount, setTurnCount] = useState(0);

  return (
    <div className="h-full flex flex-col justify-center items-center p-4 gap-1">
      <p className="text-4xl">Turn</p>
      <p className="text-6xl leading-none">{turnCount}</p>
      <div className="flex justify-center items-center">
        <button
          className="px-8 text-5xl leading-none hover:opacity-70 transition"
          onClick={() => setTurnCount(turnCount - 1)}
        >
          {"<"}
        </button>
        <button
          className="px-8 text-5xl leading-none hover:opacity-70 transition"
          onClick={() => setTurnCount(turnCount + 1)}
        >
          {">"}
        </button>
      </div>
      <div
          className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
          onClick={() => {
            setTurnCount(0);
          }}
        >
          ↺
        </div>
    </div>
  );
}