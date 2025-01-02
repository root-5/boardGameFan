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
  const [token1Count, setToken1Count] = useState(0);
  const [token2Count, setToken2Count] = useState(0);
  const [token3Count, setToken3Count] = useState(0);
  const [token4Count, setToken4Count] = useState(0);

  return (
    <>
      <div className="h-full flex flex-col justify-center items-center gap-2 p-4 text-2xl">
        <p className="my-[-10px] text-[9px]">INPUT / ARROW KEY / SCROLL</p>
        <div className="flex justify-center items-center">
          <div
            className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2"
            onClick={() => setToken1Count(ajustTokenValue(token1Count - 1))}
          >
            {"<"}
          </div>
          <div
            className={"text-3xl h-8 leading-8"}
            style={{
              transform: "scale(" + (100 + token1Count) / 100 + ")",
            }}
          >
            🩷
          </div>
          <input
            className="inline-block ml-4 w-9 bg-transparent outline-none text-center forcus:"
            type="number"
            onChange={(e) =>
              setToken1Count(ajustTokenValue(parseInt(e.target.value)))
            }
            value={token1Count}
          />
          <div
            className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2"
            onClick={() => setToken1Count(ajustTokenValue(token1Count + 1))}
          >
            {">"}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2"
            onClick={() => setToken2Count(ajustTokenValue(token2Count - 1))}
          >
            {"<"}
          </div>
          <div
            className={"text-3xl h-8 leading-8"}
            style={{
              transform: "scale(" + (100 + token2Count) / 100 + ")",
            }}
          >
            🪙
          </div>
          <input
            className="inline-block ml-4 w-9 bg-transparent outline-none text-center"
            type="number"
            onChange={(e) =>
              setToken2Count(ajustTokenValue(parseInt(e.target.value)))
            }
            value={token2Count}
          />
          <div
            className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2"
            onClick={() => setToken2Count(ajustTokenValue(token2Count + 1))}
          >
            {">"}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2"
            onClick={() => setToken3Count(ajustTokenValue(token3Count - 1))}
          >
            {"<"}
          </div>
          <div
            className={"text-3xl h-8 leading-8"}
            style={{
              transform: "scale(" + (100 + token3Count) / 100 + ")",
            }}
          >
            ☘️
          </div>
          <input
            className="inline-block ml-4 w-9 bg-transparent outline-none text-center"
            type="number"
            onChange={(e) =>
              setToken3Count(ajustTokenValue(parseInt(e.target.value)))
            }
            value={token3Count}
          />
          <div
            className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2"
            onClick={() => setToken3Count(ajustTokenValue(token3Count + 1))}
          >
            {">"}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2"
            onClick={() => setToken4Count(ajustTokenValue(token4Count - 1))}
          >
            {"<"}
          </div>
          <div
            className={"text-3xl h-8 leading-8"}
            style={{
              transform: "scale(" + (100 + token4Count) / 100 + ")",
            }}
          >
            🧊️
          </div>
          <input
            className="inline-block ml-4 w-9 bg-transparent outline-none text-center"
            type="number"
            onChange={(e) =>
              setToken4Count(ajustTokenValue(parseInt(e.target.value)))
            }
            value={token4Count}
          />
          <div
            className="px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2"
            onClick={() => setToken4Count(ajustTokenValue(token4Count + 1))}
          >
            {">"}
          </div>
        </div>
        <div
          className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
          onClick={() => {
            setToken1Count(0);
            setToken2Count(0);
            setToken3Count(0);
            setToken4Count(0);
          }}
        >
          ↺
        </div>
      </div>
    </>
  );
}
