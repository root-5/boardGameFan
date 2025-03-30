"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { cardMap, initialCardsList, initialStyle, initialPlayers, fonts } from "../utils/cardDefinitions";
import { getLocalStorage, setLocalStorage } from "../utils/localFuncs";
import { calculateAndUpdateGrid } from "@/utils/cardFuncs";

const cardTransitionThreshold = 80; // スワイプの閾値
const swipeEffectThreshold = 50; // スワイプの遊び閾値

export default function GridSP() {
  // ======================================================================
  // ステート定義
  // ======================================================================
  const [cardList, setCardList] = useState(initialCardsList); // カードリスト
  const [cardStyle, setCardStyle] = useState(initialStyle); // スタイル設定
  const [players, setPlayers] = useState(initialPlayers); // プレイヤーデータ
  const [zoomRatio, setZoomRatio] = useState(1); // ズーム倍率
  const [currentIndex, setCurrentIndex] = useState(0); // 現在表示しているカードのインデックス
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null); // タッチ開始位置
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null); // タッチ終了位置
  const [swipeOffset, setSwipeOffset] = useState(0); // スワイプのオフセット値
  const [isAnimating, setIsAnimating] = useState(false); // アニメーション中かどうか
  const [windowWidth, setWindowWidth] = useState(0); // ウィンドウの幅

  const cardListRef = useRef(cardList);

  useEffect(() => {
    cardListRef.current = cardList;
  }, [cardList]);

  // クライアントサイドでのみ実行される useEffect
  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  // グリッドのズーム倍率を更新する useEffect
  useEffect(() => {
    const handleResize = () => {
      const { zoomRatio } = calculateAndUpdateGrid(window.outerWidth, window.innerWidth);
      setZoomRatio(zoomRatio);
      setWindowWidth(window.innerWidth);
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
    setCardList(cardListStorage ? JSON.parse(cardListStorage) : initialCardsList);
    setCardStyle(cardStyleStorage ? JSON.parse(cardStyleStorage) : initialStyle);
    setPlayers(playersStorage ? JSON.parse(playersStorage) : initialPlayers);
  }, []);

  // カードリストに setter がふくまれている場合は取り除く
  useEffect(() => {
    const newCardList = cardList.filter(card => card.component !== "setter");
    if (newCardList.length !== cardList.length) {
      setCardList(newCardList);
    }
  }, [cardList]);

  // カードリスト変更、カードスタイル変更をローカルストレージに保存する useEffect
  useEffect(() => {
    if (cardList === initialCardsList) return;
    setLocalStorage("cardList", JSON.stringify(cardList));
  }, [cardList]);
  useEffect(() => {
    if (cardStyle === initialStyle) return;
    setLocalStorage("cardStyle", JSON.stringify(cardStyle));
  }, [cardStyle]);

  // スワイプハンドラ
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || isAnimating) return;
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    const deltaX = touch.clientX - touchStart.x;

    // スワイプの閾値を超えたところのみを実効値とする
    if (Math.abs(deltaX) < swipeEffectThreshold) {
      setSwipeOffset(0);
      return;
    }
    const effectiveDeltaX = (Math.abs(deltaX) - swipeEffectThreshold) * (deltaX > 0 ? 1 : -1);

    // スワイプのオフセット値はスワイプした距離の2乗根をベースに計算
    const newOffset = Math.sqrt(Math.abs(effectiveDeltaX)) * 5 * (effectiveDeltaX > 0 ? 1 : -1);
    setSwipeOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;
    setIsAnimating(true);

    const deltaX = touchEnd.x - touchStart.x;
    if (deltaX > cardTransitionThreshold) { // 右スワイプ
      // アニメーションの終了を待つ
      setSwipeOffset(windowWidth * 0.3);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cardListRef.current.length) % cardListRef.current.length);
        setSwipeOffset(0);
        setIsAnimating(false);
      }, 100);
    } else if (deltaX < -cardTransitionThreshold) { // 左スワイプ
      setSwipeOffset(-windowWidth * 0.3);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cardListRef.current.length);
        setSwipeOffset(0);
        setIsAnimating(false);
      }, 100);
    } else {
      // スワイプが閾値未満の場合、元の位置に戻す
      setSwipeOffset(0);
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // カードスタイルをメモ化して再計算を防止
  const getCardStyle = useCallback((index: number) => {
    const isEven = index % 2 === 0;
    return {
      backgroundColor: isEven ? cardStyle.bgColor_1 : cardStyle.bgColor_2,
      color: isEven ? cardStyle.fontColor_1 : cardStyle.fontColor_2,
    };
  }, [cardStyle]);

  // ページインジケーターをメモ化
  const pageIndicator = useMemo(() => (
    <div className="absolute z-10 bottom-6 left-0 right-0 flex justify-center">
      {cardList.map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 mx-1 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
        />
      ))}
    </div>
  ), [cardList.length, currentIndex]);

  // 各カードのコンポーネント（全カードを常にレンダリング）
  const renderCard = useCallback((index: number) => {
    const card = cardList[index];
    const Component = cardMap[card.component] || (() => <div>Component not found</div>);

    // 現在のカードに対する相対位置を計算
    const positionDiff = index - currentIndex;
    const normalizedPositionDiff = ((positionDiff + cardList.length) % cardList.length);

    // 相対位置に基づいて表示位置を決定
    // 現在のカード: 0, 前のカード: -1, 次のカード: 1, その他は非表示
    let translateX = 0;
    let zIndex = 0;
    let opacity = 0;
    let display = "none";

    // 現在表示中のカード（現在、前、次）の位置と表示状態を設定
    if (normalizedPositionDiff === 0) { // 現在のカード
      translateX = swipeOffset;
      zIndex = 2;
      opacity = 1;
      display = "block";
    } else if (normalizedPositionDiff === cardList.length - 1 || normalizedPositionDiff === -1) { // 前のカード
      translateX = -100 + swipeOffset;
      zIndex = 1;
      opacity = 1;
      display = "block";
    } else if (normalizedPositionDiff === 1) { // 次のカード
      translateX = 100 + swipeOffset;
      zIndex = 1;
      opacity = 1;
      display = "block";
    }

    // スワイプのオフセット値に基づいてぼかし効果を計算
    const offsetPercent = (swipeOffset / windowWidth) * 100;
    const blurAmount = normalizedPositionDiff === 0 ? Math.abs(offsetPercent) * 0.2 : 0;

    return (
      <div
        key={index}
        className="absolute w-full h-full text-center"
        style={{
          ...getCardStyle(index),
          transform: `translateX(${translateX}%)`,
          transition: isAnimating ? 'transform 0.3s ease-out, filter 0.3s ease-out' : 'none',
          zIndex: zIndex,
          opacity: opacity,
          display: display, // 表示状態を制御
          willChange: 'transform, opacity', // パフォーマンス最適化
        }}
      >
        <div
          className="w-full h-full"
          style={{
            filter: `blur(${blurAmount}px)`,
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 w-56 h-56 transform -translate-x-1/2 -translate-y-1/2"
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
  }, [cardList, currentIndex, swipeOffset, isAnimating, windowWidth, zoomRatio, players, cardStyle, getCardStyle]);

  return (
    <div
      className={"relative w-full h-dvh overflow-hidden " + fonts[cardStyle.fontStyle - 1].className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* すべてのカードを常にレンダリング */}
      {cardList.map((_, index) => renderCard(index))}

      {/* メモ化されたページインジケーター */}
      {pageIndicator}
    </div>
  );
}
