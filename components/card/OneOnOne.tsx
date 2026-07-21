"use client";

/**
 * 1 対 1 のポイントカウンター
 *
 * 左右それぞれのプレイヤーの点数を、入力・長押しで加減算します。
 */

import { useState } from "react";
import { clamp } from "@/utils/clamp";
import { useHoldRepeat } from "@/hooks/useHoldRepeat";
import ResetButton from "@/components/card/module/ResetButton";

const POINT_MAX = 99;
const POINT_MIN = -99;

export default function OneOnOne() {
  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);
  const { onHoldStart, onHoldEnd } = useHoldRepeat();

  const adjustPlayer1 = (delta: number) => {
    setPlayer1Points((prev) => clamp(prev + delta, POINT_MIN, POINT_MAX));
  };

  const adjustPlayer2 = (delta: number) => {
    setPlayer2Points((prev) => clamp(prev + delta, POINT_MIN, POINT_MAX));
  };

  return (
    <div className="p-6">
      <p className="text-[9px] opacity-50">INPUT / ARROW KEY / SCROLL</p>
      <div className="mt-2 flex justify-center items-center gap-2">
        <div className="flex flex-col justify-center items-center gap-1">
          <button
            type="button"
            className="text-3xl"
            onMouseDown={() => onHoldStart(() => adjustPlayer1(1))}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
          >
            +
          </button>
          <input
            type="number"
            value={player1Points}
            onChange={(e) =>
              setPlayer1Points(
                clamp(
                  Number.parseInt(e.target.value, 10) || 0,
                  POINT_MIN,
                  POINT_MAX
                )
              )
            }
            className="block w-20 text-5xl bg-transparent outline-none text-center"
          />
          <button
            type="button"
            className="text-3xl"
            onMouseDown={() => onHoldStart(() => adjustPlayer1(-1))}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
          >
            -
          </button>
        </div>

        <div className="text-4xl">-</div>

        <div className="flex flex-col justify-center items-center gap-1">
          <button
            type="button"
            className="text-3xl"
            onMouseDown={() => onHoldStart(() => adjustPlayer2(1))}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
          >
            +
          </button>
          <input
            type="number"
            value={player2Points}
            onChange={(e) =>
              setPlayer2Points(
                clamp(
                  Number.parseInt(e.target.value, 10) || 0,
                  POINT_MIN,
                  POINT_MAX
                )
              )
            }
            className="block w-20 text-5xl bg-transparent outline-none text-center"
          />
          <button
            type="button"
            className="text-3xl"
            onMouseDown={() => onHoldStart(() => adjustPlayer2(-1))}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
          >
            -
          </button>
        </div>

        <ResetButton
          label="Reset points"
          onClick={() => {
            setPlayer1Points(0);
            setPlayer2Points(0);
          }}
        />
      </div>
    </div>
  );
}
