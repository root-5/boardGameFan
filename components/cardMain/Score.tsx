"use client";

import { useState, useRef } from "react";

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseDown = (adjustment: number) => {
    setCount((prevCount) => ajustScoreValue(prevCount + adjustment));
    intervalRef.current = setInterval(() => {
      setCount((prevCount) => ajustScoreValue(prevCount + adjustment));
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
                <button
                  className={`px-2 duration-200 hover:opacity-70 ${
                    adjustment.className || ""
                  }`}
                  onMouseDown={() => handleMouseDown(adjustment.value)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {adjustment.label}
                </button>
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
