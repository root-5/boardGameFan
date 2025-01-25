"use client";

import { useState, useEffect } from "react";
import { cardMap, initialCardsListSP, initialStyle, initialPlayers } from "../utils/cardDefinitions";
import { getLocalStorage, setLocalStorage } from "../utils/localFuncs";
import { calculateAndUpdateGrid } from "@/utils/cardFuncs";

export default function GridSP() {
  // ======================================================================
  // ステート定義
  // ======================================================================
  const [cardList, setCardList] = useState(initialCardsListSP); // カードリスト
  const [cardStyle, setCardStyle] = useState(initialStyle); // スタイル設定
  const [players, setPlayers] = useState(initialPlayers); // プレイヤーデータ
  const [zoomRatio, setZoomRatio] = useState(1); // ズーム倍率
  const [currentIndex, setCurrentIndex] = useState(0); // 現在表示しているカードのインデックス
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null); // タッチ開始位置
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null); // タッチ終了位置

  // ======================================================================
  // useEffect
  // ======================================================================
  // グリッドの列数、行数、ズーム倍率を更新するための useEffect
  useEffect(() => {
    const handleResize = () => {
      const { zoomRatio, cols, rows } = calculateAndUpdateGrid(window.outerWidth, window.innerWidth);
      setZoomRatio(zoomRatio);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 初回のみ実行

  // 一部プロパティをローカルストレージからステートへ読み込む useEffect
  useEffect(() => {
    const cardListStorage = getLocalStorage("cardList");
    const cardStyleStorage = getLocalStorage("cardStyle");
    const playersStorage = getLocalStorage("players");
    setCardList(
      cardListStorage ? JSON.parse(cardListStorage) : initialCardsListSP
    );
    setCardStyle(
      cardStyleStorage ? JSON.parse(cardStyleStorage) : initialStyle
    );
    setPlayers(
      playersStorage ? JSON.parse(playersStorage) : initialPlayers
    );
  }, []);

  // カードリスト変更、カードスタイル変更をローカルストレージに保存する useEffect
  useEffect(() => {
    if (cardList === initialCardsListSP) return;
    setLocalStorage("cardList", JSON.stringify(cardList));
  }, [cardList]);
  useEffect(() => {
    if (cardStyle === initialStyle) return;
    setLocalStorage("cardStyle", JSON.stringify(cardStyle));
  }, [cardStyle]);

  // スワイプハンドラ
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    if (Math.abs(deltaX) > Math.abs(deltaY)) { // 水平方向のスワイプ
      if (deltaX > 50) { // 右スワイプ
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cardList.length) % cardList.length);
      } else if (deltaX < -50) { // 左スワイプ
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cardList.length);
      }
      console.log(currentIndex);
    }
    setTouchStart(null);
    setTouchEnd(null);
  }; // 0-10  length 11

  // ======================================================================
  // レンダリング
  // ======================================================================
  const currentCard = cardList[currentIndex];
  const isEven = (currentCard.x + currentCard.y) % 2 === 0;
  const bgColor = isEven ? cardStyle.bgColor_1 : cardStyle.bgColor_2;
  const fontColor = isEven ? cardStyle.fontColor_1 : cardStyle.fontColor_2;
  const Component = cardMap[currentCard.component];

  return (
    <div
      className="relative w-full h-full"
      style={{ fontFamily: `${cardStyle.fontStyle}` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute w-full h-full text-center"
        style={{
          backgroundColor: bgColor,
          color: fontColor,
        }}
      >
        <div
          className="absolute top-1/2 w-56 h-56 text-center transform -translate-y-1/2"
          style={{
            zoom: zoomRatio,
          }}
        >
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
      </div>
    </div>
  );
}
