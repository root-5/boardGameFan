"use client";

import { useEffect, useState } from "react";
import Score from "../components/score";
import Dice from "../components/dice";
import Token from "../components/token";
import Timer from "../components/timer";
import Roulette from "../components/roulette";
import Setter from "../components/setter";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// コンポーネントマッピング
const componentMap: { [key: string]: React.ComponentType<any> } = {
  score: Score,
  dice: Dice,
  token: Token,
  timer: Timer,
  roulette: Roulette,
  setter: Setter,
};

// 初期コンポーネントリスト
const initialComponents = [
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

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(componentList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setComponentList(items);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              className={"flex flex-wrap"}
              style={{ zoom: 1 }}
              id="card-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* スタイル設定用カード */}
              <div
                className={"relative w-56 h-56 text-center"}
                style={{ backgroundColor: bgColor_1, color: fontColor }}
              >
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
                const itemBgColor = index % 2 !== 0 ? bgColor_1 : bgColor_2;
                // Setter の場合は Setter コンポーネントを表示
                if (item.component === "setter") {
                  return (
                    <Draggable
                      key={index}
                      draggableId={`draggable-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={"relative w-56 h-56 text-center"}
                          style={{ backgroundColor: itemBgColor, color: fontColor }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Setter
                            key={index}
                            componentMap={componentMap}
                            componentList={componentList}
                            setComponentList={setComponentList}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                }
                // 指定のコンポーネントを取得
                const Component = componentMap[item.component];
                return (function () {
                  const itemFontColor = fontColor;
                  return (
                    <Draggable
                      key={index}
                      draggableId={`draggable-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={"relative w-56 h-56 text-center"}
                          style={{
                            backgroundColor: itemBgColor,
                            color: itemFontColor,
                          }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Component />
                        </div>
                      )}
                    </Draggable>
                  );
                })();
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
