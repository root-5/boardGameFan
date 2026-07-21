"use client";

/**
 * トークン（リソース）カウンター
 *
 * 4 種類のアイコンごとに個数を加減算できます。
 * 入力欄・長押しボタンに対応します。
 */

import { useState } from "react";
import { clamp } from "@/utils/clamp";
import { useHoldRepeat } from "@/hooks/useHoldRepeat";
import ResetButton from "@/components/card/module/ResetButton";

const TOKEN_MAX = 99;
const TOKEN_MIN = -99;
const TOKEN_ICONS = ["🩷", "🪙", "☘️", "🧊️"] as const;
const INITIAL_COUNTS = [0, 0, 0, 0];

export default function Token() {
  const [tokenCounts, setTokenCounts] = useState([...INITIAL_COUNTS]);
  const { onHoldStart, onHoldEnd } = useHoldRepeat();

  /** 指定インデックスの値を絶対値で更新 */
  const setAt = (index: number, value: number) => {
    setTokenCounts((prev) => {
      const next = [...prev];
      next[index] = clamp(value, TOKEN_MIN, TOKEN_MAX);
      return next;
    });
  };

  /** 指定インデックスの値を相対値で更新（長押し用・最新 state を参照） */
  const adjustAt = (index: number, delta: number) => {
    setTokenCounts((prev) => {
      const next = [...prev];
      next[index] = clamp(prev[index] + delta, TOKEN_MIN, TOKEN_MAX);
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col justify-center items-center gap-2 p-4 text-2xl">
      <p className="my-[-10px] text-[9px] opacity-50">
        INPUT / ARROW KEY / SCROLL
      </p>
      {tokenCounts.map((count, index) => (
        <div key={TOKEN_ICONS[index]} className="flex justify-center items-center">
          <button
            type="button"
            className="px-4 text-center transition hover:opacity-70 hover:-translate-x-2"
            onMouseDown={() => onHoldStart(() => adjustAt(index, -1))}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
          >
            {"<"}
          </button>
          <div
            className="text-3xl h-8 leading-8"
            style={{ transform: `scale(${(100 + count) / 100})` }}
          >
            {TOKEN_ICONS[index]}
          </div>
          <input
            className="inline-block ml-3 w-12 bg-transparent outline-none text-center"
            type="number"
            value={count}
            onChange={(e) =>
              setAt(index, Number.parseInt(e.target.value, 10) || 0)
            }
          />
          <button
            type="button"
            className="px-4 text-center transition hover:opacity-70 hover:translate-x-2"
            onMouseDown={() => onHoldStart(() => adjustAt(index, 1))}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
          >
            {">"}
          </button>
        </div>
      ))}
      <ResetButton
        label="Reset tokens"
        onClick={() => setTokenCounts([...INITIAL_COUNTS])}
      />
    </div>
  );
}
