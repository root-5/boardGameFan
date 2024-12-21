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
  { component: "dice" },
  { component: "score" },
  { component: "token" },
  { component: "timer" },
  { component: "roulette" },
];

export default function App() {
  const [componentList, setComponentList] = useState(initialComponents);
  const [bgColor_1, setBgColor_1] = useState("#223");
  const [bgColor_2, setBgColor_2] = useState("#445");
  const [fontColor, setFontColor] = useState("#fff");

  return (
    <>
      {/* スタイル設定用カード */}
      <div className={`relative w-56 h-56 text-center bg-gray-700 text-white`}>
        <div className="py-10 px-5 flex flex-col gap-4 justify-center items-center">
          <div className="grid grid-cols-2 gap-4 place-content-between">
            <div className="block w-28 text-left">{"Color 1"}: </div>
            <input
              className="block w-16"
              type="color"
              value={bgColor_1}
              onChange={(e) => setBgColor_1(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 place-content-between">
            <div className="block w-28 text-left">{"Color 2"}: </div>
            <input
              className="block w-16"
              type="color"
              value={bgColor_2}
              onChange={(e) => setBgColor_2(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 place-content-between">
            <div className="block w-28 text-left">{"Font Color"}: </div>
            <input
              className="block w-16"
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
            />
          </div>
        </div>
      </div>
      {componentList.map((item, index) => {
        const Component = componentMap[item.component];
        return (function () {
          const itemBgColor = index % 2 === 0 ? bgColor_1 : bgColor_2;
          const itemFontColor = fontColor;
          console.log(itemBgColor, itemFontColor);
          return (
            <div
              key={index}
              className={`relative w-56 h-56 text-center`}
              style={{ backgroundColor: itemBgColor, color: itemFontColor }}
            >
              <Component bgColor={itemBgColor} fontColor={itemFontColor} />
            </div>
          );
        })();
      })}
    </>
  );
}
