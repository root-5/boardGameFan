/**
 * カード配置・ドラッグ＆ドロップ・グリッド計算まわりの関数群
 */

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { CardSetting } from "./types";

/** カード 1 枚の基準サイズ（Tailwind の w-56 / h-56 = 224px） */
export const CARD_SIZE_PX = 224;

/**
 * 初期カードリストの空きマスを "setter" で埋める
 *
 * PC グリッドでは空き枠に＋ボタン（Setter）を置くため、
 * 表示範囲内の全マスを埋めた配列を返します。
 * 元配列は破壊しません（SP / PC で同じ initialCardsList を共有するため）。
 *
 * @param initialCardsList - 初期カード配置
 * @param maxRows - 最大行数
 * @param maxCols - 最大列数
 * @returns setter で埋めたカードリスト
 */
export const fillEmptySlotsWithSetter = (
  initialCardsList: CardSetting[],
  maxRows: number,
  maxCols: number
): CardSetting[] => {
  const result = initialCardsList.map((card) => ({ ...card }));

  for (let y = 0; y < maxRows; y++) {
    for (let x = 0; x < maxCols; x++) {
      const occupied = result.some((card) => card.x === x && card.y === y);
      if (!occupied) {
        result.push({ component: "setter", x, y });
      }
    }
  }

  return result;
};

/** @deprecated fillEmptySlotsWithSetter を使用してください */
export const setInitialCardsList = fillEmptySlotsWithSetter;

/**
 * ドラッグ＆ドロップでカード位置を入れ替えるカスタムフック
 *
 * @param setDragIndex - ドラッグ中カードのインデックス
 * @param setDragOffset - ドラッグ開始時のポインタ相対位置
 * @param dragIndex - 現在ドラッグ中のインデックス
 * @param dragOffset - 現在のオフセット
 * @param cardList - カードリスト
 * @param setCardList - カードリスト更新関数
 */
export const useDragDrop = (
  setDragIndex: Dispatch<SetStateAction<number | null>>,
  setDragOffset: Dispatch<SetStateAction<{ x: number; y: number } | null>>,
  dragIndex: number | null,
  dragOffset: { x: number; y: number } | null,
  cardList: CardSetting[],
  setCardList: Dispatch<SetStateAction<CardSetting[]>>
) => {
  const handleDragStart = useCallback(
    (index: number, e: React.DragEvent<HTMLDivElement>) => {
      setDragIndex(index);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [setDragIndex, setDragOffset]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (dragIndex === null || dragOffset === null) return;

      const newList = [...cardList];
      const newX = Math.floor((e.clientX - dragOffset.x) / CARD_SIZE_PX);
      const newY = Math.floor((e.clientY - dragOffset.y) / CARD_SIZE_PX);

      if (newX < 0 || newY < 0) {
        setDragIndex(null);
        setDragOffset(null);
        return;
      }

      const targetIndex = newList.findIndex(
        (item) => item.x === newX && item.y === newY
      );

      if (targetIndex !== -1) {
        // ドロップ先にカードがある場合は位置を入れ替える
        const dragged = newList[dragIndex];
        const target = newList[targetIndex];
        newList[targetIndex] = { ...dragged, x: newX, y: newY };
        newList[dragIndex] = { ...target, x: dragged.x, y: dragged.y };
      } else {
        newList[dragIndex] = { ...newList[dragIndex], x: newX, y: newY };
      }

      setCardList(newList);
      setDragIndex(null);
      setDragOffset(null);
    },
    [cardList, dragIndex, dragOffset, setCardList, setDragIndex, setDragOffset]
  );

  return { handleDragStart, handleDragOver, handleDrop };
};

/**
 * ウィンドウ幅からズーム倍率・列数・行数を計算する
 *
 * - 幅 500px 以下（SP）: 1 列、カード幅を画面幅に合わせる
 * - それ以外（PC）: 横に収まる列数を計算し、余白に合わせてズーム
 *
 * @param outerWidth - window.outerWidth
 * @param innerWidth - window.innerWidth
 */
export const calculateAndUpdateGrid = (
  outerWidth: number,
  innerWidth: number
): { zoomRatio: number; cols: number; rows: number } => {
  let zoomRatio = 1;
  let cols = 1;

  if (outerWidth <= 500) {
    zoomRatio = outerWidth / CARD_SIZE_PX;
  } else {
    cols = Math.floor(innerWidth / CARD_SIZE_PX);
    zoomRatio = innerWidth / (cols * CARD_SIZE_PX);
  }

  const rows = Math.floor(
    (typeof window !== "undefined" ? window.innerHeight : CARD_SIZE_PX) /
      CARD_SIZE_PX
  );

  return { zoomRatio, cols, rows };
};
