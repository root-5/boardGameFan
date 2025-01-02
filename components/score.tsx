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

  return (
    <>
      <div className="p-4">
        <input
          className="inline-block w-44 bg-transparent text-5xl text-center font-bold outline-none"
          type="number"
          onChange={(e) => setCount(ajustScoreValue(parseInt(e.target.value)))}
          value={count}
        />
        <p className="my-1 text-[8px]">INPUT / ARROW KEY / SCROLL</p>
        <div>
          <div className="flex justify-center align-middle gap-2 text-base">
            <div className="">
              <div
                className="px-2 cursor-pointer opacity-100 hover:opacity-70"
                onClick={() => {
                  setCount(ajustScoreValue(count - 1));
                }}
              >
                {"<"}
              </div>
              <div
                className="px-2 cursor-pointer opacity-100 hover:opacity-70"
                onClick={() => {
                  setCount(ajustScoreValue(count - 100));
                }}
              >
                -100
              </div>
              <div
                className="px-2 cursor-pointer opacity-100 hover:opacity-70"
                onClick={() => {
                  setCount(ajustScoreValue(count - 1000));
                }}
              >
                -1000
              </div>
              <div
                className="px-2 cursor-pointer opacity-100 hover:opacity-70"
                onClick={() => {
                  setCount(ajustScoreValue(count - 10000));
                }}
              >
                -10000
              </div>
            </div>
            <div>
              <div
                className="px-2 cursor-pointer opacity-100 hover:opacity-70"
                onClick={() => {
                  setCount(ajustScoreValue(count + 1));
                }}
              >
                {">"}
              </div>
              <div
                className="px-2 cursor-pointer opacity-100 hover:opacity-70"
                onClick={() => {
                  setCount(ajustScoreValue(count + 100));
                }}
              >
                +100
              </div>
              <div
                className="px-2 cursor-pointer opacity-100 hover:opacity-70"
                onClick={() => {
                  setCount(ajustScoreValue(count + 1000));
                }}
              >
                +1000
              </div>
              <div
                className="px-2 cursor-pointer opacity-100 hover:opacity-70"
                onClick={() => {
                  setCount(ajustScoreValue(count + 10000));
                }}
              >
                +10000
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
          onClick={() => {
            setCount(0);
          }}
        >
          ↺
        </div>
      </div>
    </>
  );
}
