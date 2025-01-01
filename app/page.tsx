"use client";

import { useState } from "react";
import Score from "../components/score";
import Dice from "../components/dice";
import Token from "../components/token";
import Timer from "../components/timer";
import Roulette from "../components/roulette";
import Setter from "../components/setter";
import StyleSetting from "../components/styleSetting";

// コンポーネントマッピング
const componentMap: { [key: string]: React.ComponentType<any> } = {
  score: Score,
  dice: Dice,
  token: Token,
  timer: Timer,
  roulette: Roulette,
  setter: Setter,
  styleSetting: StyleSetting,
};

// 初期コンポーネントリスト
const initialComponents = [
  { component: "styleSetting", x: 0, y: 0 },
  { component: "setter", x: 1, y: 0 },
  { component: "score", x: 2, y: 0 },
  { component: "dice", x: 0, y: 1 },
  { component: "token", x: 1, y: 1 },
  { component: "timer", x: 2, y: 1 },
  { component: "roulette", x: 0, y: 2 },
];

export default function App() {
  const [componentList, setComponentList] = useState(initialComponents);
  const [bgColor_1, setBgColor_1] = useState("#222233");
  const [bgColor_2, setBgColor_2] = useState("#444455");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleDragStart = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    setDragIndex(index);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragIndex === null || dragOffset === null) return;
    const gridSize = 112; // グリッドのサイズ（カードの幅の半分）
    const newList = [...componentList];
    newList[dragIndex] = {
      ...newList[dragIndex],
      x: Math.floor((e.clientX - dragOffset.x) / gridSize),
      y: Math.floor((e.clientY - dragOffset.y) / gridSize),
    };
    setComponentList(newList);
    setDragIndex(null);
    setDragOffset(null);
  };

  return (
    <>
      <div
        className={"relative w-full h-full"}
        id="card-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {componentList.map((item, index) => {
          const itemBgColor = (index + 1) % 2 !== 0 ? bgColor_1 : bgColor_2;
          const Component = componentMap[item.component];
          return (
            <div
              key={index}
              className={"absolute w-56 h-56 text-center"}
              style={{
                backgroundColor: itemBgColor,
                color: fontColor,
                left: item.x * 224, // 224 は カードの幅
                top: item.y * 224, // 224 は カードの幅
              }}
              draggable
              onDragStart={(e) => handleDragStart(index, e)}
            >
              <div className="absolute z-10 top-0 left-0 p-1 cursor-move">
                <span className="material-symbols-outlined text-gray-500">
                  drag_indicator
                </span>
              </div>
              {item.component === "setter" ? (
                // <Setter
                //   componentMap={componentMap}
                //   componentList={componentList}
                //   setComponentList={setComponentList}
                // />
                <p>Setter</p>
              ) : item.component === "styleSetting" ? (
                <StyleSetting
                  bgColor_1={bgColor_1}
                  setBgColor_1={setBgColor_1}
                  bgColor_2={bgColor_2}
                  setBgColor_2={setBgColor_2}
                  fontColor={fontColor}
                  setFontColor={setFontColor}
                />
              ) : (
                <Component />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
