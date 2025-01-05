"use client";

import { useState, useEffect, useRef } from "react";
import {
  cardMap,
  initialCards,
  initialCardsSP,
  initialStyle,
} from "../utils/cardDefinitions";
import { getCookie, setCookie } from "../utils/cookieUtils";
import Setter from "../components/setter";
import StyleSetting from "../components/styleSetting";

export default function App() {
  // ======================================================================
  // ステート定義
  // ======================================================================
  const [isCookieLoaded, setIsCookieLoaded] = useState(false); // クッキー読み込み完了フラグ
  const [cardList, setCardList] = useState(initialCards); // カードリスト
  const [cardStyle, setCardStyle] = useState(initialStyle); // スタイル設定
  const [zoomRatio, setZoomRatio] = useState(1); // ズーム倍率

  // ドラッグ＆ドロップ関連
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );
  const cardListRef = useRef(cardList);

  // カードリストの変更を追跡する useEffect
  useEffect(() => {
    cardListRef.current = cardList;
  }, [cardList]);

  // ======================================================================
  // ドラッグ＆ドロップ処理
  // ======================================================================
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

  // ======================================================================
  // グリッド関連処理
  // ======================================================================
  // window 幅をもとに、カードの列数とズーム倍率を計算する関数
  const calcColsAndZoomRatio = () => {
    const cardSize = 224; // 基本のカードの幅（w-56 h-56 の px 値）
    let zoomRatio = 1;
    let cols = 1;
    // 幅が 500px 以下は列数を１にしてカード幅を画面幅に合わせる
    if (window.outerWidth <= 500) {
      zoomRatio = window.outerWidth / cardSize;
    } else {
      cols = Math.floor(window.innerWidth / cardSize);
      zoomRatio = Math.min(window.innerWidth / (cols * cardSize));
    }
    return { cols, zoomRatio };
  };
  // 列数、行数をもとに cardList を更新する関数
  const updateCardList = (
    cardList: { component: string; x: number; y: number }[],
    cols: number,
    rows: number
  ) => {
    const newCardList = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const existingComponent = cardList.find(
          (comp: { x: number; y: number }) => comp.x === x && comp.y === y
        );
        // 空いている部分には setter を設置する
        newCardList.push(existingComponent || { component: "setter", x, y });
      }
    }
    return newCardList;
  };
  // ロード時と window 幅が変わったときに呼び出される関数
  // window 幅、カードリストをもとにカードの行数、列数、ズーム倍率を計算し、カードリストを更新する
  const updateGrid = () => {
    const { cols, zoomRatio } = calcColsAndZoomRatio();
    const rows = Math.floor(window.innerHeight / 224);
    const newCardList = updateCardList(cardListRef.current, cols, rows);
    setZoomRatio(zoomRatio);
    setCardList(newCardList);
  };

  // ======================================================================
  // useEffect
  // ======================================================================
  // グリッドの更新 useEffect
  useEffect(() => {
    updateGrid();
    const handleResize = () => updateGrid();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // クッキーからステートを読み込む useEffect
  useEffect(() => {
    if (!isCookieLoaded) {
      setCardList(
        getCookie("cardList")
          ? JSON.parse(getCookie("cardList") as string)
          : initialCards
      );
      setCardStyle(
        getCookie("cardStyle")
          ? JSON.parse(getCookie("cardStyle") as string)
          : initialStyle
      );
    }
    setIsCookieLoaded(true);
  }, []);

  // 各ステート変更をクッキーに保存する useEffect
  useEffect(() => {
    if (cardList === initialCards) return;
    setCookie("cardList", JSON.stringify(cardList));
  }, [cardList]);
  useEffect(() => {
    if (cardStyle === initialStyle) return;
    setCookie("cardStyle", JSON.stringify(cardStyle));
  }, [cardStyle]);

  // ======================================================================
  // レンダリング
  // ======================================================================
  return (
    <>
      <div
        className={"relative w-full h-full"}
        id="card-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          fontFamily: `${cardStyle.fontStyle}`,
          zoom: zoomRatio,
        }}
      >
        {cardList.map(
          (item: { x: number; y: number; component: any }, index: number) => {
            const isEven = (item.x + item.y) % 2 === 0;
            const itemBgColor = isEven
              ? cardStyle.bgColor_1
              : cardStyle.bgColor_2;
            const itemFontColor = isEven
              ? cardStyle.fontColor_1
              : cardStyle.fontColor_2;
            const Component = cardMap[item.component];

            return (
              <div key={`${item.x}-${item.y}`}>
                {item.component === "setter" ? (
                  // Setter カードのみ特殊呼び出し
                  <Setter
                    item={item}
                    cardMap={cardMap}
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
                        cardStyle={cardStyle}
                        setCardStyle={setCardStyle}
                      />
                    ) : (
                      <Component zoomRatio={zoomRatio} />
                    )}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </>
  );
}
