"use client";

/**
 * スコアカウンター
 *
 * 大きな数値入力と、±1 / ±100 / ±1000 / ±10000 の長押し加減算に対応します。
 */

import { useState } from "react";
import { clamp } from "@/utils/clamp";
import { useHoldRepeat } from "@/hooks/useHoldRepeat";
import ResetButton from "@/components/card/module/ResetButton";

const SCORE_MAX = 99999;
const SCORE_MIN = -99999;

const SCORE_ADJUSTMENTS = [
  { label: "<", value: -1, className: "mt-[-8px] text-3xl" },
  { label: ">", value: 1, className: "mt-[-8px] text-3xl" },
  { label: "-100", value: -100 },
  { label: "+100", value: 100 },
  { label: "-1000", value: -1000 },
  { label: "+1000", value: 1000 },
  { label: "-10000", value: -10000 },
  { label: "+10000", value: 10000 },
] as const;

export default function Score() {
  const [count, setCount] = useState(0);
  const { onHoldStart, onHoldEnd } = useHoldRepeat();

  const adjust = (delta: number) => {
    setCount((prev) => clamp(prev + delta, SCORE_MIN, SCORE_MAX));
  };

  return (
    <div className="p-6">
      <p className="text-[8px] opacity-50">INPUT / ARROW KEY / SCROLL</p>
      <input
        className="inline-block w-44 bg-transparent text-5xl text-center font-bold outline-none"
        type="number"
        value={count}
        onChange={(e) =>
          setCount(
            clamp(Number.parseInt(e.target.value, 10) || 0, SCORE_MIN, SCORE_MAX)
          )
        }
      />
      <div className="grid grid-cols-2 gap-0 text-base">
        {SCORE_ADJUSTMENTS.map((adjustment) => (
          <div key={adjustment.label}>
            <button
              type="button"
              className={`px-2 duration-200 hover:opacity-70 ${
                "className" in adjustment ? adjustment.className : ""
              }`}
              onMouseDown={() => onHoldStart(() => adjust(adjustment.value))}
              onMouseUp={onHoldEnd}
              onMouseLeave={onHoldEnd}
            >
              {adjustment.label}
            </button>
          </div>
        ))}
      </div>
      <ResetButton label="Reset score" onClick={() => setCount(0)} />
    </div>
  );
}
