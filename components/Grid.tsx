"use client";

import { useState, useEffect, useRef } from "react";
import { Shantell_Sans, Sansita_Swashed, Dancing_Script, Libre_Bodoni, Pixelify_Sans, Red_Hat_Text, Caveat, Stick_No_Bills, Tilt_Prism, Antonio } from 'next/font/google'
import { cardMap, maxRange, initialCardsList, initialStyle, initialPlayers } from "../utils/cardDefinitions";
import { setInitialCardsList, useDragDrop, calculateAndUpdateGrid } from "../utils/cardFuncs";
import { getLocalStorage, setLocalStorage } from "../utils/localFuncs";
import DragIcon from "../components/card/module/DragIcon";
import CloseButton from "../components/card/module/CloseButton";
import Setter from "../components/Setter";

// ======================================================================
// 定数定義
// ======================================================================
const initialCardsListFilled = setInitialCardsList(initialCardsList, maxRange.rows, maxRange.cols);

const font_1 = Shantell_Sans({ subsets: ['latin'] })
const font_2 = Sansita_Swashed({ subsets: ['latin'] })
const font_3 = Dancing_Script({ subsets: ['latin'] })
const font_4 = Libre_Bodoni({ subsets: ['latin'] })
const font_5 = Pixelify_Sans({ subsets: ['latin'] })
const font_6 = Red_Hat_Text({ subsets: ['latin'] })
const font_7 = Caveat({ subsets: ['latin'] })
const font_8 = Stick_No_Bills({ subsets: ['latin'] })
const font_9 = Tilt_Prism({ subsets: ['latin'] })
const font_10 = Antonio({ subsets: ['latin'] })
const fonts = [font_1, font_2, font_3, font_4, font_5, font_6, font_7, font_8, font_9, font_10,]

export default function Grid() {
  // ======================================================================
  // ステート定義
  // ======================================================================
  const [cardList, setCardList] = useState(initialCardsListFilled); // カードリスト
  const [cardStyle, setCardStyle] = useState(initialStyle); // スタイル設定
  const [zoomRatio, setZoomRatio] = useState(1); // ズーム倍率
  const [viewRange, setViewRange] = useState({ x: maxRange.cols, y: maxRange.rows }); // 表示範囲
  const [players, setPlayers] = useState(initialPlayers); // プレイヤーデータ
  const [dragIndex, setDragIndex] = useState<number | null>(null); // ドラッグ中のカードのインデックス
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>( // ドラッグ中のカードのオフセット
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
  // グリッドの列数、行数、ズーム倍率を更新するための useEffect
  useEffect(() => {
    const handleResize = () => {
      const { zoomRatio, cols, rows } = calculateAndUpdateGrid(window.outerWidth, window.innerWidth);
      setZoomRatio(zoomRatio);
      setViewRange({ x: cols, y: rows });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 初回のみ実行

  // 一部プロパティをローカルストレージからステートへ読み込む useEffect
  useEffect(() => {
    const cardListStorage = getLocalStorage("cardList");
    // const cardStyleStorage = getLocalStorage("cardStyle");
    const playersStorage = getLocalStorage("players");
    setCardList(cardListStorage ? JSON.parse(cardListStorage) : initialCardsList);
    // setCardStyle(cardStyleStorage ? JSON.parse(cardStyleStorage) : initialStyle);
    setPlayers(playersStorage ? JSON.parse(playersStorage) : initialPlayers);
  }, []);

  // カードリスト変更、カードスタイル変更をローカルストレージに保存する useEffect
  useEffect(() => {
    if (cardList === initialCardsList) return;
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
        className={"relative w-full h-full " + fonts[cardStyle.fontStyle].className}
        id="card-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          // fontFamily: `${cardStyle.fontStyle}`,
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
