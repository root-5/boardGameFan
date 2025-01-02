"use client";

import { useState, useEffect } from "react";
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

// 初期カード
const initialCards = [
  { component: "styleSetting", x: 0, y: 0 },
  { component: "score", x: 2, y: 0 },
  { component: "dice", x: 0, y: 1 },
  { component: "token", x: 1, y: 1 },
  { component: "timer", x: 2, y: 1 },
  { component: "roulette", x: 1, y: 0 },
];

export default function App() {
  // カードリスト
  const [componentList, setComponentList] = useState(initialCards);

  // グリッドに配置するカード数
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });

  // スタイル設定
  const [bgColor_1, setBgColor_1] = useState("#222233");
  const [bgColor_2, setBgColor_2] = useState("#444455");
  const [fontColor_1, setFontColor_1] = useState("#eeeeee");
  const [fontColor_2, setFontColor_2] = useState("#ffffff");
  const [fontStyle, setFontStyle] = useState("Comic Sans MS");
  const [zoomRatio, seZoomRatio] = useState(1); // CSS の zoomRatio 値、カードを画面幅で設置するために使用

  // ドラッグ＆ドロップ関連
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  // グリッドを画面幅で設置するための useEffect
  useEffect(() => {
    const updateGridSize = () => {
      const cardSize = 224; // 基本のカードの幅（w-56 h-56 の px 値）
      const cols = Math.floor(window.innerWidth / cardSize);
      const rows = Math.floor(window.innerHeight / cardSize);
      const newScale = Math.min(
        window.innerWidth / (cols * cardSize),
        window.innerHeight / (rows * cardSize)
      );
      setGridSize({ rows, cols });
      seZoomRatio(newScale);
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  // 初期カードを設置し、空いた個所に setter を設置するための useEffect
  useEffect(() => {
    const newComponentList = [];
    for (let y = 0; y < gridSize.rows; y++) {
      for (let x = 0; x < gridSize.cols; x++) {
        const existingComponent = initialCards.find(
          (comp) => comp.x === x && comp.y === y
        );
        newComponentList.push(
          existingComponent || { component: "setter", x, y }
        );
      }
    }
    setComponentList(newComponentList);
  }, [gridSize]);

  // ドラッグ＆ドロップ処理
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
    const cardSize = 224; // カードの幅
    const newList = [...componentList];
    const newX = Math.floor((e.clientX - dragOffset.x) / cardSize);
    const newY = Math.floor((e.clientY - dragOffset.y) / cardSize);
    if (
      newX >= 0 &&
      newX < gridSize.cols &&
      newY >= 0 &&
      newY < gridSize.rows
    ) {
      const targetIndex = newList.findIndex(
        (item) => item.x === newX && item.y === newY
      );

      if (targetIndex !== -1) {
        // カードを交換する
        const temp = newList[targetIndex];
        newList[targetIndex] = { ...newList[dragIndex], x: newX, y: newY };
        newList[dragIndex] = {
          ...temp,
          x: newList[dragIndex].x,
          y: newList[dragIndex].y,
        };
      } else {
        newList[dragIndex] = {
          ...newList[dragIndex],
          x: newX,
          y: newY,
        };
      }
      setComponentList(newList);
    }
    setDragIndex(null);
    setDragOffset(null);
  };

  // ステートを JSON 形式でダウンロードする関数
  const downloadStateAsJson = () => {
    const state = {
      componentList,
      bgColor_1,
      bgColor_2,
      fontColor_1,
      fontColor_2,
      fontStyle,
    };
    const stateJson = JSON.stringify(state);
    const blob = new Blob([stateJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "state.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON ファイルからステートを読み込む関数
  const loadStateFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const state = JSON.parse(e.target?.result as string);
        setComponentList(state.componentList);
        setBgColor_1(state.bgColor_1);
        setBgColor_2(state.bgColor_2);
        setFontColor_1(state.fontColor_1);
        setFontColor_2(state.fontColor_2);
        setFontStyle(state.fontStyle);
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <div
        className={"relative w-full h-full"}
        id="card-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          fontFamily: `${fontStyle}`,
          zoom: zoomRatio,
        }}
      >
        {componentList.map((item, index) => {
          const isEven = (item.x + item.y) % 2 === 0;
          const itemBgColor = isEven ? bgColor_1 : bgColor_2;
          const itemFontColor = isEven ? fontColor_1 : fontColor_2;
          const Component = componentMap[item.component];

          return (
            <>
              {item.component === "setter" ? (
                // Setter カードのみ特殊呼び出し
                <Setter
                  key={index}
                  item={item}
                  componentMap={componentMap}
                  componentList={componentList}
                  setComponentList={setComponentList}
                  itemBgColor={itemBgColor}
                  fontColor={itemFontColor}
                />
              ) : (
                <div
                  key={index}
                  className={"absolute w-56 h-56 text-center"}
                  style={{
                    backgroundColor: itemBgColor,
                    color: itemFontColor,
                    left: item.x * 224, // 224 は カードの幅
                    top: item.y * 224, // 224 は カードの幅
                  }}
                >
                  {/* ドラッグアイコン */}
                  <div
                    className="absolute z-10 top-0 left-0 p-1 cursor-move duration-200 opacity-30 hover:opacity-100"
                    draggable
                    onDragStart={(e) => handleDragStart(index, e)}
                  >
                    <span className="material-symbols-outlined">
                      drag_indicator
                    </span>
                  </div>

                  {/* 閉じるボタン */}
                  <div
                    className="absolute z-10 top-1 right-1 px-1 cursor-pointer text-2xl leading-none duration-200 opacity-30 hover:opacity-100"
                    onClick={() => {
                      const newList = [...componentList];
                      newList[index] = {
                        component: "setter",
                        x: newList[index].x,
                        y: newList[index].y,
                      };
                      setComponentList(newList);
                    }}
                  >
                    ×
                  </div>

                  {/* カードの中身 */}
                  {item.component === "styleSetting" ? (
                    <StyleSetting
                      bgColor_1={bgColor_1}
                      setBgColor_1={setBgColor_1}
                      bgColor_2={bgColor_2}
                      setBgColor_2={setBgColor_2}
                      fontColor_1={fontColor_1}
                      setFontColor_1={setFontColor_1}
                      fontColor_2={fontColor_2}
                      setFontColor_2={setFontColor_2}
                      fontStyle={fontStyle}
                      setFontStyle={setFontStyle}
                    />
                  ) : (
                    <Component zoomRatio={zoomRatio} />
                  )}
                </div>
              )}
            </>
          );
        })}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded"
            onClick={downloadStateAsJson}
          >
            Download State
          </button>
          <input
            type="file"
            accept=".json"
            className="hidden"
            id="upload-json"
            onChange={loadStateFromJson}
          />
          <label
            htmlFor="upload-json"
            className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer"
          >
            Load State
          </label>
        </div>
      </div>
    </>
  );
}
