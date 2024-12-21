"use client";

import { useState } from "react";
import Dice from "../components/dice";
import Score from "../components/score";
import Token from "../components/token";
import Timer from "../components/timer";
import Roulette from "../components/roulette";

// コンポーネントマッピング
const componentMap: { [key: string]: React.ComponentType<any> } = {
  dice: Dice,
  score: Score,
  token: Token,
  timer: Timer,
  roulette: Roulette,
};

// 初期コンポーネントリスト
const initialComponents = [
  { component: "dice", bgColor: "bg-gray-900", fontColor: "text-white" },
  { component: "score", bgColor: "bg-gray-700", fontColor: "text-white" },
  { component: "token", bgColor: "bg-gray-900", fontColor: "text-white" },
  { component: "timer", bgColor: "bg-gray-700", fontColor: "text-white" },
  { component: "roulette", bgColor: "bg-gray-900", fontColor: "text-white" },
];

export default function App() {
  const [componentList, setComponentList] = useState(initialComponents);
  const [bgColor_1, setBgColor_1] = useState("bg-gray-900");
  const [bgColor_2, setBgColor_2] = useState("bg-gray-700");
  const [fontColor, setFontColor] = useState("text-white");

  return (
    <>
      {/* スタイル設定用カード */}
      <div className={`relative w-56 h-56 text-center bg-gray-700 text-white`}>
        <div className="pt-10 flex flex-col gap-4 justify-center items-center">
          <div className="flex gap-1 justify-center">
            <div>{"背景色1"}: </div>
            <input
              className="block w-8"
              type="color"
              value={bgColor_1}
              onChange={(e) => setBgColor_1(e.target.value)}
            />
          </div>
          <div className="flex gap-1 justify-center">
            <div>{"背景色1"}: </div>
            <input
              className="block w-8"
              type="color"
              value={bgColor_2}
              onChange={(e) => setBgColor_2(e.target.value)}
            />
          </div>
          <div className="flex gap-1 justify-center">
            <div>{"背景色1"}: </div>
            <input
              className="block w-8"
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
            />
          </div>
        </div>
      </div>
      {componentList.map((item, index) => {
        const Component = componentMap[item.component];
        return (
          <div
            key={index}
            className={`relative w-56 h-56 ${item.bgColor} ${item.fontColor} text-center`}
          >
            <Component bgColor={item.bgColor} fontColor={item.fontColor} />
          </div>
        );
      })}
    </>
  );
}
