"use client";

import { useState, useEffect, useRef } from "react";

const timerMax = 359999; // 99:59:59 (最大値)
const timerMin = 0; // 00:00:00 (最小値)

function adjustTimerValue(value: number): number {
  if (value > timerMax) {
    return timerMax;
  } else if (value < timerMin) {
    return timerMin;
  }
  return value;
}

export default function Timer() {
  const [defaultTime, setDefaultTime] = useState(0);
  const [time, setTime] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [saveDefaultText, setSaveDefaultText] = useState("SAVE AS DEFAULT");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const nextTime = adjustTimerValue(prevTime - 1);
          if (nextTime === timerMin) {
            setIsRunning(false);
            setIsTimeUp(true);
          }
          return nextTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const handleTimeAdjust = (adjustment: number) => {};

  const timeAdjustments = [
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
  ];

  return (
    <>
      <div className={"p-4 text-center" + (isTimeUp ? " shake-animation" : "")}>
        <div
          className={
            "inline-block w-44 bg-transparent text-4xl font-bold text-center outline-none" +
            (isTimeUp ? " animate-pulse" : "")
          }
        >
          {formatTime(time)}
        </div>
        <div className="flex justify-center align-middle text-base">
          <div
            className={
              "px-5 py-2 text-lg" +
              (isTimeUp
                ? " opacity-70"
                : " cursor-pointer duration-200 hover:opacity-70")
            }
            onClick={() => {
              if (!isTimeUp) {
                setIsRunning(!isRunning);
              }
            }}
          >
            {isRunning ? "STOP" : "START"}
          </div>
          <div
            className={
              "px-5 py-2 text-lg duration-200 hover:opacity-70" +
              (isRunning ? " opacity-70" : " cursor-pointer")
            }
            onClick={() => {
              if (isRunning) return;
              setTime(defaultTime);
              setIsTimeUp(false);
            }}
          >
            RESET
          </div>
        </div>
        <div className="grid grid-cols-4 grid-rows-3 justify-center align-middle text-base">
          {timeAdjustments.map((adjustment, index) => (
            <div key={index} className="flex place-content-between text-base">
              <div
                className={
                  "px-1 py-0.5 duration-200" +
                  (isTimeUp || isRunning
                    ? " opacity-70"
                    : " cursor-pointer hover:opacity-70")
                }
                onClick={() => {
                  if (isTimeUp || isRunning) return;
                  setTime(adjustTimerValue(time + adjustment.value));
                }}
              >
                {adjustment.label}
              </div>
            </div>
          ))}
        </div>
        <div
          className={
            "mt-2 text-xs cursor-pointer duration-200 hover:opacity-70" +
            (isTimeUp || isRunning ? " opacity-70" : "")
          }
          onClick={() => {
            if (isTimeUp || isRunning) return;
            setDefaultTime(time);
            setSaveDefaultText("SAVED");
            setTimeout(() => {
              setSaveDefaultText("SAVE AS DEFAULT");
            }, 2000);
          }}
        >
          {saveDefaultText}
        </div>
      </div>
    </>
  );
}
