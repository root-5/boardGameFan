"use client";

import { useState, useEffect } from "react";
import Score from "../components/score";
import Dice from "../components/dice";
import Token from "../components/token";
import Timer from "../components/timer";
import Roulette from "../components/roulette";
import Turn from "../components/turn";
import Winner from "../components/winner";
import Info from "../components/info";
import Setter from "../components/setter";
import StyleSetting from "../components/styleSetting";

// コンポーネントマッピング
const componentMap: {
  [key: string]: React.ComponentType<{ zoomRatio: number }>;
} = {
  score: Score,
  dice: Dice,
  token: Token,
  timer: Timer,
  roulette: Roulette,
  turn: Turn,
  winner: Winner,
  info: Info,

  // setter と styleSetting は特殊なコンポーネントなので、ここでは設定しない
  // setter: Setter,
  // styleSetting: StyleSetting,
};

// 初期カード
const initialCards = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 1, y: 0 },
  { component: "dice", x: 2, y: 0 },
  { component: "token", x: 0, y: 1 },
  { component: "roulette", x: 1, y: 1 },
  { component: "timer", x: 2, y: 1 },
  { component: "score", x: 0, y: 2 },
  { component: "styleSetting", x: 1, y: 2 },
  { component: "info", x: 2, y: 2 },
];

// 初期カード（SPモード、x=0 のみ）
const initialCardsSP = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 0, y: 1 },
  { component: "dice", x: 0, y: 2 },
  { component: "token", x: 0, y: 3 },
  { component: "roulette", x: 0, y: 4 },
  { component: "timer", x: 0, y: 5 },
  { component: "score", x: 0, y: 6 },
  { component: "styleSetting", x: 0, y: 7 },
  { component: "info", x: 0, y: 8 },
];

export default function App() {
  // カードリスト
  const [cardList, setCardList] = useState(initialCards);

  // スタイル設定
  const [bgColor_1, setBgColor_1] = useState("#0f026f");
  const [bgColor_2, setBgColor_2] = useState("#672d8c");
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
    const cardSize = 224; // 基本のカードの幅（w-56 h-56 の px 値）
    let newScale = 1;
    let cols = 1;
    let isSP = false;

    const updateGridSize = () => {
      if (window.outerWidth <= 500) {
        // 幅が 500px 以下はカード幅を画面幅に合わせる
        newScale = window.outerWidth / cardSize;
        seZoomRatio(newScale);
        isSP = true;
      } else {
        // カードの幅を基準に、グリッドの行数と列数を計算
        cols = Math.floor(window.innerWidth / cardSize);
        newScale = Math.min(window.innerWidth / (cols * cardSize));
        seZoomRatio(newScale);
      }
    };
    updateGridSize();

    // 初期カードを設置し、空いた個所に setter を設置する
    const cardList = isSP ? initialCardsSP : initialCards;
    setCardList(cardList);
    const rows = isSP ? cardList.length : Math.floor(window.innerHeight / 224);
    const newComponentList = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const existingComponent = cardList.find(
          (comp) => comp.x === x && comp.y === y
        );
        newComponentList.push(
          existingComponent || { component: "setter", x, y }
        );
      }
    }
    setCardList(newComponentList);

    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

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
    const newList = [...cardList];
    const newX = Math.floor((e.clientX - dragOffset.x) / cardSize);
    const newY = Math.floor((e.clientY - dragOffset.y) / cardSize);
    if (newX >= 0 && newY >= 0) {
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
      setCardList(newList);
    }
    setDragIndex(null);
    setDragOffset(null);
  };

  // ステートをクッキーに保存する関数
  const saveStateToCookies = () => {
    const state = {
      cardList,
      bgColor_1,
      bgColor_2,
      fontColor_1,
      fontColor_2,
      fontStyle,
      zoomRatio,
    };
    document.cookie = "appState=" + JSON.stringify(state);
  };
  useEffect(() => {
    saveStateToCookies();
    console.log(
      document.cookie
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("appState="))
        ?.split("=")[1]
    );
  }, [
    cardList,
    bgColor_1,
    bgColor_2,
    fontColor_1,
    fontColor_2,
    fontStyle,
    zoomRatio,
  ]);

  // クッキーからステートを読み込む関数
  const loadStateFromCookies = () => {
    const stateJson = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("appState="))
      ?.split("=")[1];

    console.log(
      document.cookie
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("appState="))
        ?.split("=")[1]
    );

    if (stateJson) {
      const state = JSON.parse(stateJson);
      setCardList(state.cardList);
      setBgColor_1(state.bgColor_1);
      setBgColor_2(state.bgColor_2);
      setFontColor_1(state.fontColor_1);
      setFontColor_2(state.fontColor_2);
      setFontStyle(state.fontStyle);
      seZoomRatio(state.zoomRatio);
    }
  };
  useEffect(() => {
    loadStateFromCookies();
  }, []);

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
        {cardList.map((item, index) => {
          const isEven = (item.x + item.y) % 2 === 0;
          const itemBgColor = isEven ? bgColor_1 : bgColor_2;
          const itemFontColor = isEven ? fontColor_1 : fontColor_2;
          const Component = componentMap[item.component];

          return (
            <div key={`${item.x}-${item.y}`}>
              {item.component === "setter" ? (
                // Setter カードのみ特殊呼び出し
                <Setter
                  item={item}
                  componentMap={componentMap}
                  cardList={cardList}
                  setCardList={setCardList}
                  itemBgColor={itemBgColor}
                  fontColor={itemFontColor}
                />
              ) : (
                <div
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill={itemFontColor}
                    >
                      <path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z" />
                    </svg>
                  </div>

                  {/* 閉じるボタン */}
                  <div
                    className="absolute z-10 top-1 right-1 px-1 cursor-pointer text-2xl leading-none duration-200 opacity-30 hover:opacity-100"
                    onClick={() => {
                      const newList = [...cardList];
                      newList[index] = {
                        component: "setter",
                        x: newList[index].x,
                        y: newList[index].y,
                      };
                      setCardList(newList);
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
            </div>
          );
        })}
      </div>
    </>
  );
}
