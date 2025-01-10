import { Dispatch, SetStateAction } from "react";

interface DragDropHandlers {
  handleDragStart: (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const useDragDrop = (
  setDragIndex: Dispatch<SetStateAction<number | null>>,
  setDragOffset: Dispatch<SetStateAction<{ x: number; y: number } | null>>,
  dragIndex: number | null,
  dragOffset: { x: number; y: number } | null,
  cardList: any[],
  setCardList: Dispatch<SetStateAction<any[]>>
): DragDropHandlers => {
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