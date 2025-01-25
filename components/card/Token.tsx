"use client";

import { useState, useRef } from "react";

const tokenMax = 99;
const tokenMin = -99;

function ajustTokenValue(value: number): number {
  if (value > tokenMax) {
    return tokenMax;
  } else if (value < tokenMin) {
    return tokenMin;
  }
  return value;
}

export default function Token() {
  const [tokenCounts, setTokenCounts] = useState([0, 0, 0, 0]);
  const tokenIcons = ["🩷", "🪙", "☘️", "🧊️"];
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTokenChange = (index: number, adjustment: number) => {
    setTokenCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] = ajustTokenValue(newCounts[index] + adjustment);
      return newCounts;
    });
  };

  const handleInputChange = (index: number, value: number) => {
    setTokenCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] = ajustTokenValue(value);
      return newCounts;
    });
  };

  const handleMouseDown = (index: number, adjustment: number) => {
    handleTokenChange(index, adjustment);
    intervalRef.current = setInterval(() => {
      handleTokenChange(index, adjustment);
    }, 150);
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <>
      <div className="h-full flex flex-col justify-center items-center gap-2 p-4 text-2xl">
        <p className="my-[-10px] text-[9px] opacity-50">
          INPUT / ARROW KEY / SCROLL
        </p>
        {tokenCounts.map((count, index) => (
          <div key={index} className="flex justify-center items-center">
            <button
              className="px-4 text-center transition hover:opacity-70 hover:-translate-x-2"
              onMouseDown={() => handleMouseDown(index, -1)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {"<"}
            </button>
            <div
              className={"text-3xl h-8 leading-8"}
              style={{
                transform: "scale(" + (100 + count) / 100 + ")",
              }}
            >
              {tokenIcons[index]}
            </div>
            <input
              className="inline-block ml-3 w-12 bg-transparent outline-none text-center"
              type="number"
              onChange={(e) =>
                handleInputChange(index, parseInt(e.target.value))
              }
              value={count}
            />
            <button
              className="px-4 text-center transition hover:opacity-70 hover:translate-x-2"
              onMouseDown={() => handleMouseDown(index, 1)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {">"}
            </button>
          </div>
        ))}
        <div
          className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
          onClick={() => setTokenCounts([0, 0, 0, 0])}
        >
          ↺
        </div>
      </div>
    </>
  );
}
