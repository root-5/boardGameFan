/**
 * カード系で使用する関数をまとめる
 */

import { Dispatch, SetStateAction } from "react";

/**
 * setInitialCardsList 関数
 * 初期カードリストを設定する関数
 * 
 * @param {{ component: string, x: number, y: number }[]} initialCardsList - 初期カードリスト
 * @param {number} maxRows - 最大行数
 * @param {number} maxCols - 最大列数
 * @returns {{ component: string, x: number, y: number }[]} 初期カードリスト
 */
export const setInitialCardsList = (
  initialCardsList: { component: string, x: number, y: number }[],
  maxRows: number,
  maxCols: number
): { component: string, x: number, y: number }[] => {
  for (let y = 0; y < maxRows; y++) {
    for (let x = 0; x < maxCols; x++) {
      const existingComponent = initialCardsList.find(
        (comp) => comp.x === x && comp.y === y
      );
      if (!existingComponent) {
        initialCardsList.push({ component: "setter", x, y });
      }
    }
  }
  return initialCardsList;
};

/**
 * useDragDrop カスタムフック
 * ドラッグ＆ドロップの処理を管理するためのフック
 * 
 * @param {Dispatch<SetStateAction<number | null>>} setDragIndex - ドラッグ中のカードのインデックスを設定する関数
 * @param {Dispatch<SetStateAction<{ x: number; y: number } | null>>} setDragOffset - ドラッグ中のカードのオフセットを設定する関数
 * @param {number | null} dragIndex - ドラッグ中のカードのインデックス
 * @param {{ x: number; y: number } | null} dragOffset - ドラッグ中のカードのオフセット
 * @param {any[]} cardList - カードのリスト
 * @param {Dispatch<SetStateAction<any[]>>} setCardList - カードのリストを更新する関数
 * @returns {{ handleDragStart: (index: number, e: React.DragEvent<HTMLDivElement>) => void, handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void, handleDrop: (e: React.DragEvent<HTMLDivElement>) => void }} ドラッグ＆ドロップのイベントハンドラを含むオブジェクト
 */
export const useDragDrop = (
  setDragIndex: Dispatch<SetStateAction<number | null>>,
  setDragOffset: Dispatch<SetStateAction<{ x: number; y: number } | null>>,
  dragIndex: number | null,
  dragOffset: { x: number; y: number } | null,
  cardList: any[],
  setCardList: Dispatch<SetStateAction<any[]>>
) => {
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
    const cardSize = 224;
    const newList = [...cardList];
    const newX = Math.floor((e.clientX - dragOffset.x) / cardSize);
    const newY = Math.floor((e.clientY - dragOffset.y) / cardSize);
    if (newX >= 0 && newY >= 0) {
      const targetIndex = newList.findIndex(
        (item) => item.x === newX && item.y === newY
      );
      if (targetIndex !== -1) {
        [newList[targetIndex], newList[dragIndex]] = [
          { ...newList[dragIndex], x: newX, y: newY },
          {
            ...newList[targetIndex],
            x: newList[dragIndex].x,
            y: newList[dragIndex].y,
          },
        ];
      } else {
        newList[dragIndex] = { ...newList[dragIndex], x: newX, y: newY };
      }
      setCardList(newList);
    }
    setDragIndex(null);
    setDragOffset(null);
  };

  return { handleDragStart, handleDragOver, handleDrop };
};

/**
 * calculateAndUpdateGrid 関数
 * ウィンドウの幅を基にカードの列数とズーム倍率を計算し、行数を返す関数
 * 
 * @param {number} outerWidth - ウィンドウの外幅
 * @param {number} innerWidth - ウィンドウの内幅
 * @returns {{ zoomRatio: number, cols: number, rows: number }} ズーム倍率、列数、行数を含むオブジェクト
 */
export const calculateAndUpdateGrid = (outerWidth: number, innerWidth: number) => {
  const cardSize = 224; // 基本のカードの幅（w-56 h-56 の px 値）
  let zoomRatio = 1;
  let cols = 1;
  // 幅が 500px 以下は列数を１にしてカード幅を画面幅に合わせる
  if (outerWidth <= 500) {
    zoomRatio = outerWidth / cardSize;
  } else {
    cols = Math.floor(innerWidth / cardSize);
    zoomRatio = Math.min(innerWidth / (cols * cardSize));
  }
  const rows = Math.floor(innerHeight / 224);
  return { zoomRatio, cols, rows };
};