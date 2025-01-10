"use client";

import { useState } from "react";

const scoreMax = 99999;
const scoreMin = -99999;

function ajustScoreValue(value: number): number {
  if (value > scoreMax) {
    return scoreMax;
  } else if (value < scoreMin) {
    return scoreMin;
  }
  return value;
}

export default function Score() {
  const [count, setCount] = useState(0);

  const scoreAdjustments = [
    { label: "<", value: -1, className: "mt-[-8px] text-3xl" },
    { label: ">", value: 1, className: "mt-[-8px] text-3xl" },
    { label: "-100", value: -100 },
    { label: "+100", value: 100 },
    { label: "-1000", value: -1000 },
    { label: "+1000", value: 1000 },
    { label: "-10000", value: -10000 },
    { label: "+10000", value: 10000 },
  ];

  return (
    <>
      <div className="p-6">
        <p className="text-[8px] opacity-50">INPUT / ARROW KEY / SCROLL</p>
        <input
          className="inline-block w-44 bg-transparent text-5xl text-center font-bold outline-none"
          type="number"
          onChange={(e) => setCount(ajustScoreValue(parseInt(e.target.value)))}
          value={count}
        />
        <div>
          <div className="grid grid-cols-2 gap-0 text-base">
            {scoreAdjustments.map((adjustment, index) => (
              <div key={index}>
                <div
                  className={`px-2 cursor-pointer duration-200 hover:opacity-70 ${
                    adjustment.className || ""
                  }`}
                  onClick={() =>
                    setCount(ajustScoreValue(count + adjustment.value))
                  }
                >
                  {adjustment.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
          onClick={() => setCount(0)}
        >
          ↺
        </div>
      </div>
    </>
  );
}
