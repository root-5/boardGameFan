"use client";

/**
 * タイマーカード
 *
 * カウントダウン・長押しでの加減算・デフォルト時間の保存に対応します。
 * 時間切れ時はシェイクアニメーションで知らせます。
 */

import { useState, useEffect, useRef } from "react";
import { clamp } from "@/utils/clamp";
import { useHoldRepeat } from "@/hooks/useHoldRepeat";

const TIMER_MAX = 359999; // 99:59:59
const TIMER_MIN = 0;

const TIME_ADJUSTMENTS = [
  { label: "-10s", value: -10 },
  { label: "-1s", value: -1 },
  { label: "+1s", value: 1 },
  { label: "+10s", value: 10 },
  { label: "-10m", value: -600 },
  { label: "-1m", value: -60 },
  { label: "+1m", value: 60 },
  { label: "+10m", value: 600 },
  { label: "-10h", value: -36000 },
  { label: "-1h", value: -3600 },
  { label: "+1h", value: 3600 },
  { label: "+10h", value: 36000 },
] as const;

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

export default function Timer() {
  const [defaultTime, setDefaultTime] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [saveDefaultText, setSaveDefaultText] = useState("SAVE AS DEFAULT");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { onHoldStart, onHoldEnd } = useHoldRepeat();

  // カウントダウン用 interval
  useEffect(() => {
    if (isRunning) {
      tickRef.current = setInterval(() => {
        setTime((prev) => {
          const next = clamp(prev - 1, TIMER_MIN, TIMER_MAX);
          if (next === TIMER_MIN) {
            setIsRunning(false);
            setIsTimeUp(true);
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [isRunning]);

  const locked = isTimeUp || isRunning;

  return (
    <div className={`p-4 text-center${isTimeUp ? " shake-animation" : ""}`}>
      <div
        className={`inline-block w-44 bg-transparent text-4xl font-bold text-center outline-none${
          isTimeUp ? " animate-pulse" : ""
        }`}
      >
        {formatTime(time)}
      </div>

      <div className="flex justify-center items-center text-base">
        <button
          type="button"
          className={`px-5 py-2 text-lg${
            isTimeUp
              ? " opacity-70"
              : " cursor-pointer duration-200 hover:opacity-70"
          }`}
          onClick={() => {
            if (!isTimeUp) setIsRunning((prev) => !prev);
          }}
        >
          {isRunning ? "STOP" : "START"}
        </button>
        <button
          type="button"
          className={`px-5 py-2 text-lg duration-200 hover:opacity-70${
            isRunning ? " opacity-70" : " cursor-pointer"
          }`}
          onClick={() => {
            if (isRunning) return;
            setTime(defaultTime);
            setIsTimeUp(false);
          }}
        >
          RESET
        </button>
      </div>

      <div className="grid grid-cols-4 grid-rows-3 justify-center items-center text-base">
        {TIME_ADJUSTMENTS.map((adjustment) => (
          <div key={adjustment.label} className="flex place-content-between">
            <button
              type="button"
              className={`px-1 py-0.5 duration-200${
                locked ? " opacity-70" : " hover:opacity-70"
              }`}
              disabled={locked}
              onMouseDown={() => {
                if (locked) return;
                onHoldStart(() =>
                  setTime((prev) =>
                    clamp(prev + adjustment.value, TIMER_MIN, TIMER_MAX)
                  )
                );
              }}
              onMouseUp={onHoldEnd}
              onMouseLeave={onHoldEnd}
            >
              {adjustment.label}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={`mt-2 text-xs cursor-pointer duration-200 hover:opacity-70${
          locked ? " opacity-70" : ""
        }`}
        onClick={() => {
          if (locked) return;
          setDefaultTime(time);
          setSaveDefaultText("SAVED");
          setTimeout(() => setSaveDefaultText("SAVE AS DEFAULT"), 2000);
        }}
      >
        {saveDefaultText}
      </button>
    </div>
  );
}
