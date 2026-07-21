/**
 * カードを閉じる（setter に戻す）ボタン
 */

import type { CardSetting } from "@/utils/types";

type CloseButtonProps = {
  index: number;
  cardList: CardSetting[];
  setCardList: (list: CardSetting[]) => void;
  isHidden?: boolean;
};

export default function CloseButton({
  index,
  cardList,
  setCardList,
  isHidden = false,
}: CloseButtonProps) {
  if (isHidden) return null;

  return (
    <button
      type="button"
      aria-label="Close card"
      className="absolute z-10 top-1 right-1 px-1 cursor-pointer text-2xl leading-none duration-200 opacity-30 hover:opacity-100"
      onClick={() => {
        const next = [...cardList];
        next[index] = {
          component: "setter",
          x: next[index].x,
          y: next[index].y,
        };
        setCardList(next);
      }}
    >
      ×
    </button>
  );
}
