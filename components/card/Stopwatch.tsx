"use client";

/**
 * ストップウォッチカード
 *
 * 経過時間の計測・ラップ記録に対応します。
 * Timer（カウントダウン）の対になる計測ツールです。
 */

import { useState, useEffect, useRef } from "react";

const STOPWATCH_MAX_MS = 359999000; // 99:59:59.000
const MAX_LAPS = 3;

function formatTime(ms: number): string {
  const clamped = Math.min(Math.max(ms, 0), STOPWATCH_MAX_MS);
  const totalSeconds = Math.floor(clamped / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((clamped % 1000) / 100);
  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":") + `.${tenths}`;
}

export default function Stopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const accumulatedRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    const startedAt = Date.now();
    const base = accumulatedRef.current;

    tickRef.current = setInterval(() => {
      const next = Math.min(base + (Date.now() - startedAt), STOPWATCH_MAX_MS);
      setElapsedMs(next);
      if (next >= STOPWATCH_MAX_MS) {
        accumulatedRef.current = STOPWATCH_MAX_MS;
        setIsRunning(false);
      }
    }, 50);

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      accumulatedRef.current = Math.min(
        base + (Date.now() - startedAt),
        STOPWATCH_MAX_MS
      );
      setElapsedMs(accumulatedRef.current);
    };
  }, [isRunning]);

  const canLap = isRunning || elapsedMs > 0;
  const canReset = !isRunning && (elapsedMs > 0 || laps.length > 0);

  return (
    <div className="box-border h-full py-6 text-center">
      <div className="bg-transparent text-3xl font-bold tabular-nums">
        {formatTime(elapsedMs)}
      </div>

      <div className="flex justify-center items-center text-base">
        <button
          type="button"
          className="px-3 py-1.5 text-lg cursor-pointer duration-200 hover:opacity-70"
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? "STOP" : "START"}
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 text-lg duration-200${
            canLap ? " cursor-pointer hover:opacity-70" : " opacity-70"
          }`}
          disabled={!canLap}
          onClick={() => {
            if (!canLap) return;
            setLaps((prev) => [elapsedMs, ...prev].slice(0, MAX_LAPS));
          }}
        >
          LAP
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 text-lg duration-200${
            canReset ? " cursor-pointer hover:opacity-70" : " opacity-70"
          }`}
          disabled={!canReset}
          onClick={() => {
            if (!canReset) return;
            accumulatedRef.current = 0;
            setElapsedMs(0);
            setLaps([]);
          }}
        >
          RESET
        </button>
      </div>

      <div className="mt-1 h-16 overflow-hidden text-xs tabular-nums opacity-80">
        {laps.length === 0 ? (
          <p className="opacity-50">LAP TIMES</p>
        ) : (
          <ul className="space-y-0.5">
            {laps.map((lap, index) => (
              <li key={`${lap}-${index}`}>
                #{laps.length - index} {formatTime(lap)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
