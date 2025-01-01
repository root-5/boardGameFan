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

  // ウィンドウ幅からカードの zoom 倍率を計算
  useEffect(() => {
    const resizeHandler = () => {
      setTimeout(() => {
        // ウィンドウ幅からカードの zoom 倍率を計算
        const windowWidth = window.innerWidth;
        const cardWidth = 224;
        const newzoom = windowWidth / (windowWidth - (windowWidth % cardWidth));
        const cardContainer = document.querySelector("#card-container");
        if (cardContainer instanceof HTMLElement) {
          cardContainer.style.zoom = newzoom.toString();
        }

        // Three.js の Canvas のサイズを追加調整
        const canvasElements = document.querySelectorAll("canvas");
        for (const canvasElement of canvasElements) {
          if (canvasElement instanceof HTMLCanvasElement) {
            canvasElement.style.width = 224 + "px";
            canvasElement.style.height = 224 + "px";
          }
        }
      }, 500);
    };
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    setTimeout(() => resizeHandler(), 1000);
    setTimeout(() => resizeHandler(), 2000);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <>
      <div className={"flex flex-wrap"} style={{ zoom: 1 }} id="card-container">
        {componentList.map((item, index) => {
          const itemBgColor = index % 2 !== 0 ? bgColor_1 : bgColor_2;
          if (item.component === "setter") {
            // Setter または StyleSetting の場合はそれぞれのコンポーネントを表示
            return (
              <div
                key={index}
                className={"relative w-56 h-56 text-center"}
                style={{ backgroundColor: itemBgColor, color: fontColor }}
              >
                <Setter
                  componentMap={componentMap}
                  componentList={componentList}
                  setComponentList={setComponentList}
                />
              </div>
            );
          } else if (item.component === "styleSetting") {
            // Setter または StyleSetting の場合はそれぞれのコンポーネントを表示
            return (
              <div
                key={index}
                className={"relative w-56 h-56 text-center"}
                style={{ backgroundColor: itemBgColor, color: fontColor }}
              >
                <StyleSetting
                  bgColor_1={bgColor_1}
                  setBgColor_1={setBgColor_1}
                  bgColor_2={bgColor_2}
                  setBgColor_2={setBgColor_2}
                  fontColor={fontColor}
                  setFontColor={setFontColor}
                />
              </div>
            );
          }
          // 指定のコンポーネントを取得
          const Component = componentMap[item.component];
          return (
            <div
              key={index}
              className={"relative w-56 h-56 text-center"}
              style={{
                backgroundColor: itemBgColor,
                color: fontColor,
              }}
            >
              <Component />
            </div>
          );
        })}
      </div>
    </>
  );
}
