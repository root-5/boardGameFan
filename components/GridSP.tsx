"use client";

/**
 * スマートフォン向けカード表示
 *
 * 横スワイプでカードを切り替えます。
 * 描画負荷を抑えるため、現在・前後のカードのみ表示し、
 * 3D カードはアクティブ時だけ Canvas を起動します。
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  cardMap,
  initialCardsList,
  initialStyle,
  initialPlayers,
  fonts,
} from "@/utils/cardDefinitions";
import { getLocalJson, setLocalStorage } from "@/utils/localFuncs";
import { calculateAndUpdateGrid } from "@/utils/cardFuncs";
import type { CardSetting, CardStyle, Player } from "@/utils/types";

/** スワイプでページ送りと判定する移動量（px） */
const CARD_TRANSITION_THRESHOLD = 80;
/** スワイプ演出を開始する遊び（px） */
const SWIPE_EFFECT_THRESHOLD = 50;

type CardContentProps = {
  card: CardSetting;
  isActive: boolean;
  zoomRatio: number;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
  setCardList: (list: CardSetting[]) => void;
  bgColor: string;
  fontColor: string;
};

/** スワイプ中も再レンダーされないカード本体（memo 化） */
const CardContent = memo(function CardContent({
  card,
  isActive,
  zoomRatio,
  players,
  setPlayers,
  cardStyle,
  setCardStyle,
  setCardList,
  bgColor,
  fontColor,
}: CardContentProps) {
  const Component =
    cardMap[card.component] ?? (() => <div>Component not found</div>);

  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: bgColor, color: fontColor }}
    >
      <div
        className="absolute top-1/2 left-1/2 w-56 h-56 -translate-x-1/2 -translate-y-1/2"
        style={{ zoom: zoomRatio }}
      >
        <Component
          zoomRatio={zoomRatio}
          players={players}
          setPlayers={setPlayers}
          cardStyle={cardStyle}
          setCardStyle={setCardStyle}
          setCardList={setCardList}
          isActive={isActive}
        />
      </div>
    </div>
  );
});

export default function GridSP() {
  const [cardList, setCardList] = useState<CardSetting[]>(initialCardsList);
  const [cardStyle, setCardStyle] = useState<CardStyle>(initialStyle);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [zoomRatio, setZoomRatio] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardListRef = useRef(cardList);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    cardListRef.current = cardList;
  }, [cardList]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // ズーム倍率を画面幅に追従
  useEffect(() => {
    const handleResize = () => {
      const { zoomRatio: nextZoom } = calculateAndUpdateGrid(
        window.outerWidth,
        window.innerWidth
      );
      setZoomRatio(nextZoom);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ローカルストレージから復元
  useEffect(() => {
    setCardList(getLocalJson("cardList", initialCardsList));
    setCardStyle(getLocalJson("cardStyle", initialStyle));
    setPlayers(getLocalJson("players", initialPlayers));
  }, []);

  // PC 由来の setter カードは SP では不要なので除去
  useEffect(() => {
    const withoutSetter = cardList.filter((card) => card.component !== "setter");
    if (withoutSetter.length !== cardList.length) {
      setCardList(withoutSetter);
    }
  }, [cardList]);

  // 変更を保存
  useEffect(() => {
    if (cardList === initialCardsList) return;
    setLocalStorage("cardList", JSON.stringify(cardList));
  }, [cardList]);

  useEffect(() => {
    if (cardStyle === initialStyle) return;
    setLocalStorage("cardStyle", JSON.stringify(cardStyle));
  }, [cardStyle]);

  // タッチ座標は ref で持ち、移動中の不要な再レンダーを抑える
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimatingRef.current) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchEndRef.current = { x: touch.clientX, y: touch.clientY };
    setSwipeOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || isAnimatingRef.current) return;
    const touch = e.touches[0];
    touchEndRef.current = { x: touch.clientX, y: touch.clientY };
    const deltaX = touch.clientX - touchStartRef.current.x;

    if (Math.abs(deltaX) < SWIPE_EFFECT_THRESHOLD) {
      setSwipeOffset(0);
      return;
    }

    // 遊びを除いた量を平方根スケールで視覚オフセットに変換
    const effectiveDeltaX =
      (Math.abs(deltaX) - SWIPE_EFFECT_THRESHOLD) * (deltaX > 0 ? 1 : -1);
    const newOffset =
      Math.sqrt(Math.abs(effectiveDeltaX)) * 5 * (effectiveDeltaX > 0 ? 1 : -1);
    setSwipeOffset(newOffset);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const touchStart = touchStartRef.current;
    const touchEnd = touchEndRef.current;
    if (!touchStart || !touchEnd || isAnimatingRef.current) return;

    const deltaX = touchEnd.x - touchStart.x;
    const width = window.innerWidth;

    // タップ（閾値未満）はスワイプ処理しない → 3D の pointer を邪魔しない
    if (Math.abs(deltaX) < CARD_TRANSITION_THRESHOLD) {
      setSwipeOffset(0);
      touchStartRef.current = null;
      touchEndRef.current = null;
      return;
    }

    setIsAnimating(true);
    isAnimatingRef.current = true;

    if (deltaX > CARD_TRANSITION_THRESHOLD) {
      setSwipeOffset(width * 0.3);
      setTimeout(() => {
        setCurrentIndex(
          (prev) =>
            (prev - 1 + cardListRef.current.length) % cardListRef.current.length
        );
        setSwipeOffset(0);
        setIsAnimating(false);
        isAnimatingRef.current = false;
      }, 100);
    } else {
      setSwipeOffset(-width * 0.3);
      setTimeout(() => {
        setCurrentIndex(
          (prev) => (prev + 1) % cardListRef.current.length
        );
        setSwipeOffset(0);
        setIsAnimating(false);
        isAnimatingRef.current = false;
      }, 100);
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, []);

  const pageIndicator = useMemo(
    () => (
      <div className="absolute z-10 bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        {cardList.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 mx-1 rounded-full ${
              i === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    ),
    [cardList, currentIndex]
  );

  const cardColors = useMemo(
    () =>
      cardList.map((_, index) => {
        const isEven = index % 2 === 0;
        return {
          bgColor: isEven ? cardStyle.bgColor_1 : cardStyle.bgColor_2,
          fontColor: isEven ? cardStyle.fontColor_1 : cardStyle.fontColor_2,
        };
      }),
    [cardList, cardStyle]
  );

  // 現在・前後カードのみ表示。本体は memo 化しているためスワイプ中はシェルだけ更新
  const cards = useMemo(() => {
    const len = cardList.length;
    if (len === 0) return null;

    return cardList.map((card, index) => {
      const positionDiff = index - currentIndex;
      const normalized = ((positionDiff % len) + len) % len;

      let translateX = 0;
      let zIndex = 0;
      let visible = false;

      if (normalized === 0) {
        translateX = swipeOffset;
        zIndex = 2;
        visible = true;
      } else if (normalized === len - 1) {
        translateX = -100 + swipeOffset;
        zIndex = 1;
        visible = true;
      } else if (normalized === 1) {
        translateX = 100 + swipeOffset;
        zIndex = 1;
        visible = true;
      }

      // 表示中カードのみ WebGL を起動（同時 Canvas を 1 つに抑える）
      const isActive = normalized === 0;
      const colors = cardColors[index];

      return (
        <div
          key={`${card.component}-${index}`}
          className="absolute w-full h-full text-center"
          style={{
            transform: `translate3d(${translateX}%, 0, 0)`,
            transition: isAnimating ? "transform 0.1s ease-out" : "none",
            zIndex,
            // display:none は再表示コストが大きいので visibility + 画面外で隠す
            visibility: visible ? "visible" : "hidden",
            pointerEvents: visible ? "auto" : "none",
            contentVisibility: visible ? "visible" : "hidden",
            willChange: visible ? "transform" : "auto",
          }}
        >
          <CardContent
            card={card}
            isActive={isActive}
            zoomRatio={zoomRatio}
            players={players}
            setPlayers={setPlayers}
            cardStyle={cardStyle}
            setCardStyle={setCardStyle}
            setCardList={setCardList}
            bgColor={colors.bgColor}
            fontColor={colors.fontColor}
          />
        </div>
      );
    });
  }, [
    cardList,
    currentIndex,
    swipeOffset,
    isAnimating,
    zoomRatio,
    players,
    cardStyle,
    cardColors,
  ]);

  const fontClass = fonts[cardStyle.fontStyle - 1]?.className ?? "";

  return (
    <div
      className={`relative w-full h-dvh overflow-hidden ${fontClass}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {cards}
      {pageIndicator}
    </div>
  );
}
