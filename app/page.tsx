"use client";

import { useState, useEffect } from "react";
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
  // cookie 反映後フラグ
  const [isCookieLoaded, setIsCookieLoaded] = useState(false);

  // カードリスト
  const [cardList, setCardList] = useState(initialCards);

  // スタイル設定
  const [bgColor_1, setBgColor_1] = useState(initialStyle.bgColor_1);
  const [bgColor_2, setBgColor_2] = useState(initialStyle.bgColor_2);
  const [fontColor_1, setFontColor_1] = useState(initialStyle.fontColor_1);
  const [fontColor_2, setFontColor_2] = useState(initialStyle.fontColor_2);
  const [fontStyle, setFontStyle] = useState(initialStyle.fontStyle);
  const [zoomRatio, setZoomRatio] = useState(initialStyle.zoomRatio); // CSS の zoomRatio 値、カードを画面幅で設置するために使用

  // ドラッグ＆ドロップ関連
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

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
    const newCardList = updateCardList(cardList, cols, rows);
    setZoomRatio(zoomRatio);
    // setCardList(newCardList);
  };

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
  // useEffect
  // ======================================================================
  // クッキーからステートを読み込む useEffect
  useEffect(() => {
    if (!isCookieLoaded) {
      setCardList(
        getCookie("cardList")
          ? JSON.parse(getCookie("cardList") as string)
          : initialCards
      );
      setBgColor_1(getCookie("bgColor_1") || initialStyle.bgColor_1);
      setBgColor_2(getCookie("bgColor_2") || initialStyle.bgColor_2);
      setFontColor_1(getCookie("fontColor_1") || initialStyle.fontColor_1);
      setFontColor_2(getCookie("fontColor_2") || initialStyle.fontColor_2);
      setFontStyle(getCookie("fontStyle") || initialStyle.fontStyle);

      setIsCookieLoaded(true);
    }

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  // 各ステート変更をクッキーに保存する useEffect
  useEffect(() => {
    if (cardList === initialCards) return;
    setCookie("cardList", JSON.stringify(cardList));
  }, [cardList]);
  useEffect(() => {
    if (bgColor_1 === initialStyle.bgColor_1) return;
    setCookie("bgColor_1", bgColor_1);
  }, [bgColor_1]);
  useEffect(() => {
    if (bgColor_2 === initialStyle.bgColor_2) return;
    setCookie("bgColor_2", bgColor_2);
  }, [bgColor_2]);
  useEffect(() => {
    if (fontColor_1 === initialStyle.fontColor_1) return;
    setCookie("fontColor_1", fontColor_1);
  }, [fontColor_1]);
  useEffect(() => {
    if (fontColor_2 === initialStyle.fontColor_2) return;
    setCookie("fontColor_2", fontColor_2);
  }, [fontColor_2]);
  useEffect(() => {
    if (fontStyle === initialStyle.fontStyle) return;
    setCookie("fontStyle", fontStyle);
  }, [fontStyle]);

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
          fontFamily: `${fontStyle}`,
          zoom: zoomRatio,
        }}
      >
        {cardList.map(
          (item: { x: number; y: number; component: any }, index: number) => {
            const isEven = (item.x + item.y) % 2 === 0;
            const itemBgColor = isEven ? bgColor_1 : bgColor_2;
            const itemFontColor = isEven ? fontColor_1 : fontColor_2;
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
          }
        )}
      </div>
    </>
  );
}
