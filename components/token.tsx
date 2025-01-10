"use client";

import { useState } from "react";

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

  return (
    <>
      <div className="h-full flex flex-col justify-center items-center gap-2 p-4 text-2xl">
        <p className="my-[-10px] text-[9px] opacity-50">INPUT / ARROW KEY / SCROLL</p>
        {tokenCounts.map((count, index) => (
          <div key={index} className="flex justify-center items-center">
            <div
              className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2"
              onClick={() => handleTokenChange(index, -1)}
            >
              {"<"}
            </div>
            <div
              className={"text-3xl h-8 leading-8"}
              style={{
                transform: "scale(" + (100 + count) / 100 + ")",
              }}
            >
              {tokenIcons[index]}
            </div>
            <input
              className="inline-block ml-4 w-9 bg-transparent outline-none text-center"
              type="number"
              onChange={(e) => handleInputChange(index, parseInt(e.target.value))}
              value={count}
            />
            <div
              className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2"
              onClick={() => handleTokenChange(index, 1)}
            >
              {">"}
            </div>
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