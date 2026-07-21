"use client";

/**
 * PC 向けグリッド表示
 *
 * カードを 224px マスの絶対配置で並べ、ドラッグ＆ドロップで入れ替えできます。
 * 空きマスには Setter（＋ボタン）を表示します。
 */

import { useState, useEffect, useRef } from "react";
import {
  cardMap,
  maxRange,
  initialCardsList,
  initialStyle,
  initialPlayers,
  fonts,
} from "@/utils/cardDefinitions";
import {
  fillEmptySlotsWithSetter,
  useDragDrop,
  calculateAndUpdateGrid,
  CARD_SIZE_PX,
} from "@/utils/cardFuncs";
import { getLocalJson, setLocalStorage } from "@/utils/localFuncs";
import type { CardSetting, CardStyle, Player } from "@/utils/types";
import DragIcon from "@/components/card/module/DragIcon";
import CloseButton from "@/components/card/module/CloseButton";
import Setter from "@/components/Setter";

/** setter で埋めた初期カードリスト（ローカル未保存時のデフォルト） */
const initialCardsListFilled = fillEmptySlotsWithSetter(
  initialCardsList,
  maxRange.rows,
  maxRange.cols
);

export default function Grid() {
  const [cardList, setCardList] = useState<CardSetting[]>(initialCardsListFilled);
  const [cardStyle, setCardStyle] = useState<CardStyle>(initialStyle);
  const [zoomRatio, setZoomRatio] = useState(1);
  const [viewRange, setViewRange] = useState<{ x: number; y: number }>({
    x: maxRange.cols,
    y: maxRange.rows,
  });
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  const cardListRef = useRef(cardList);
  useEffect(() => {
    cardListRef.current = cardList;
  }, [cardList]);

  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop(
    setDragIndex,
    setDragOffset,
    dragIndex,
    dragOffset,
    cardList,
    setCardList
  );

  // リサイズに応じて列数・行数・ズーム倍率を更新
  useEffect(() => {
    const handleResize = () => {
      const { zoomRatio: nextZoom, cols, rows } = calculateAndUpdateGrid(
        window.outerWidth,
        window.innerWidth
      );
      setZoomRatio(nextZoom);
      setViewRange({ x: cols, y: rows });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 初回マウント時にローカルストレージから復元
  // SP 保存分には setter が無い場合があるため、空きマスを埋めてから使う
  useEffect(() => {
    const storedList = getLocalJson<CardSetting[] | null>("cardList", null);
    setCardList(
      storedList
        ? fillEmptySlotsWithSetter(storedList, maxRange.rows, maxRange.cols)
        : initialCardsListFilled
    );
    setCardStyle(getLocalJson("cardStyle", initialStyle));
    setPlayers(getLocalJson("players", initialPlayers));
  }, []);

  // 変更をローカルストレージへ保存（初期値のままならスキップ）
  useEffect(() => {
    if (cardList === initialCardsListFilled) return;
    setLocalStorage("cardList", JSON.stringify(cardList));
  }, [cardList]);

  useEffect(() => {
    if (cardStyle === initialStyle) return;
    setLocalStorage("cardStyle", JSON.stringify(cardStyle));
  }, [cardStyle]);

  const fontClass = fonts[cardStyle.fontStyle - 1]?.className ?? "";

  return (
    <div
      className={`relative w-full h-full ${fontClass}`}
      id="card-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ zoom: zoomRatio }}
    >
      {cardList.map((item, index) => {
        // 表示範囲外は描画しない（パフォーマンス）
        if (item.x >= viewRange.x || item.y >= viewRange.y) return null;

        const isEven = (item.x + item.y) % 2 === 0;
        const bgColor = isEven ? cardStyle.bgColor_1 : cardStyle.bgColor_2;
        const fontColor = isEven
          ? cardStyle.fontColor_1
          : cardStyle.fontColor_2;
        const Component = cardMap[item.component];

        return (
          <div key={`${item.x}-${item.y}`}>
            {item.component === "setter" || !Component ? (
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
                className="absolute w-56 h-56 text-center"
                style={{
                  backgroundColor: bgColor,
                  color: fontColor,
                  left: item.x * CARD_SIZE_PX,
                  top: item.y * CARD_SIZE_PX,
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
  );
}
