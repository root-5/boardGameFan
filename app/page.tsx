"use client";

import { useState, useEffect, useRef } from "react";
import { cardMap, initialCardsSetting, initialStyle, initialPlayers } from "../utils/cardDefinitions";
import { getLocalStorage, setLocalStorage } from "../utils/localStorageUtils";
import { useDragDrop, calculateAndUpdateGrid } from "../utils/cardFunctions";
import DragIcon from "../components/card/module/DragIcon";
import CloseButton from "../components/card/module/CloseButton";
import Setter from "../components/Setter";

export default function App() {
  // ======================================================================
  // 定数定義
  // ======================================================================
  // 内部的に保持するカードリストの最大サイズ
  const { maxRows, maxCols } = { maxRows: 20, maxCols: 20 };

  // initialCardsSetting の空きを setter カードで埋める
  for (let y = 0; y < maxRows; y++) {
    for (let x = 0; x < maxCols; x++) {
      const existingComponent = initialCardsSetting.find(
        (comp) => comp.x === x && comp.y === y
      );
      if (!existingComponent) {
        initialCardsSetting.push({ component: "setter", x, y });
      }
    }
  }

  // ======================================================================
  // ステート定義
  // ======================================================================
  const [cardList, setCardList] = useState(initialCardsSetting); // カードリスト
  const [cardStyle, setCardStyle] = useState(initialStyle); // スタイル設定
  const [zoomRatio, setZoomRatio] = useState(1); // ズーム倍率
  const [viewRange, setViewRange] = useState({ x: maxCols, y: maxRows }); // 表示範囲
  const [players, setPlayers] = useState(initialPlayers); // プレイヤーデータ

  // ドラッグ＆ドロップ関連
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  // ======================================================================
  // リファレンス定義
  // ======================================================================
  const cardListRef = useRef(cardList);
  useEffect(() => {
    cardListRef.current = cardList;
  }, [cardList]);

  // ======================================================================
  // ドラッグ＆ドロップ処理
  // ======================================================================
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop(
    setDragIndex, setDragOffset, dragIndex, dragOffset, cardList, setCardList
  );

  // ======================================================================
  // useEffect
  // ======================================================================
  // グリッド更新の useEffect
  useEffect(() => {
    const handleResize = () => {
      const { zoomRatio, cols, rows } = calculateAndUpdateGrid(window.outerWidth, window.innerWidth);
      setZoomRatio(zoomRatio);
      setViewRange({ x: cols, y: rows });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 初回のみ実行

  // ローカルストレージからステートを読み込む useEffect
  useEffect(() => {
    const cardListStorage = getLocalStorage("cardList");
    const cardStyleStorage = getLocalStorage("cardStyle");
    setCardList(
      cardListStorage ? JSON.parse(cardListStorage) : initialCardsSetting
    );
    setCardStyle(
      cardStyleStorage ? JSON.parse(cardStyleStorage) : initialStyle
    );
  }, []);

  // カードリスト変更、カードスタイル変更をローカルストレージに保存する useEffect
  useEffect(() => {
    if (cardList === initialCardsSetting) return;
    setLocalStorage("cardList", JSON.stringify(cardList));
  }, [cardList]);
  useEffect(() => {
    if (cardStyle === initialStyle) return;
    setLocalStorage("cardStyle", JSON.stringify(cardStyle));
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
        {cardList.map((item, index) => {
          // 表示範囲外のカードはレンダリングしない
          if (item.x >= viewRange.x || item.y >= viewRange.y) return null;

          // 背景色、フォント色を設定
          const isEven = (item.x + item.y) % 2 === 0;
          const bgColor = isEven ? cardStyle.bgColor_1 : cardStyle.bgColor_2;
          const fontColor = isEven ? cardStyle.fontColor_1 : cardStyle.fontColor_2;
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
                  bgColor={bgColor}
                  fontColor={fontColor}
                />
              ) : (
                <div
                  className={"absolute w-56 h-56 text-center"}
                  style={{
                    backgroundColor: bgColor,
                    color: fontColor,
                    left: item.x * 224, // 224 は カードの幅
                    top: item.y * 224, // 224 は カードの幅
                  }}
                >
                  <DragIcon
                    index={index}
                    handleDragStart={handleDragStart}
                    fontColor={fontColor}
                  />
                  <CloseButton
                    index={index}
                    cardList={cardList}
                    setCardList={setCardList}
                  />
                  {/* カードの中身 */}
                  <Component
                    zoomRatio={zoomRatio}
                    players={players}
                    setPlayers={setPlayers}
                    cardStyle={cardStyle}
                    setCardStyle={setCardStyle}
                    setCardList={setCardList}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
