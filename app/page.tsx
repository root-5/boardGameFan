"use client";

import { useEffect, useState } from "react";
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
  { component: "styleSetting" },
  { component: "setter" },
  { component: "score" },
  { component: "dice" },
  { component: "token" },
  { component: "timer" },
  { component: "roulette" },
];

export default function App() {
  const [componentList, setComponentList] = useState(initialComponents);
  const [bgColor_1, setBgColor_1] = useState("#222233");
  const [bgColor_2, setBgColor_2] = useState("#444455");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (dragIndex === null) return;
    const newList = [...componentList];
    const [draggedItem] = newList.splice(dragIndex, 1);
    newList.splice(index, 0, draggedItem);
    setDragIndex(index);
    setComponentList(newList);
  };

  const handleDrop = () => {
    setDragIndex(null);
  };

  return (
    <>
      <div className={"flex flex-wrap"} id="card-container">
        {componentList.map((item, index) => {
          const itemBgColor = (index + 1) % 2 !== 0 ? bgColor_1 : bgColor_2;
          const Component = componentMap[item.component];
          return (
            <div
              key={index}
              className={"relative w-56 h-56 text-center"}
              style={{ backgroundColor: itemBgColor, color: fontColor }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDrop={handleDrop}
            >
              {item.component === "setter" ? (
                <Setter
                  componentMap={componentMap}
                  componentList={componentList}
                  setComponentList={setComponentList}
                />
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
