"use client";

/**
 * 空きマス用のカード追加 UI
 *
 * ホバーで「＋」を出し、クリックで追加可能なカード一覧を表示します。
 * ＋と一覧を同じホバー領域に置くことで、
 * 一覧表示直後に mouseLeave で消えてしまう問題を防いでいます。
 */

import { useState } from "react";
import type { CardComponent, CardSetting } from "@/utils/types";
import { CARD_SIZE_PX } from "@/utils/cardFuncs";

type SetterProps = {
  item: CardSetting;
  cardMap: Record<string, CardComponent>;
  cardList: CardSetting[];
  setCardList: (list: CardSetting[]) => void;
  bgColor: string;
  fontColor: string;
};

export default function Setter({
  item,
  cardMap,
  cardList,
  setCardList,
  bgColor,
  fontColor,
}: SetterProps) {
  // none: 非表示 / button: ＋ボタン / list: カード選択一覧
  const [display, setDisplay] = useState<"none" | "button" | "list">("none");

  const handleSelect = (key: string) => {
    setCardList(
      cardList.map((card) =>
        card.x === item.x && card.y === item.y
          ? { component: key, x: item.x, y: item.y }
          : card
      )
    );
    setDisplay("none");
  };

  /** camelCase を改行付き表示用に整形（例: oneOnOne → One\nOn\nOne） */
  const formatKey = (key: string) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1\n$2")
      .replace(/^./, (c) => c.toUpperCase());

  const componentKeys = Object.keys(cardMap);

  return (
    <div className="relative">
      <div
        className="absolute w-56 h-56 text-center"
        style={{
          left: item.x * CARD_SIZE_PX,
          top: item.y * CARD_SIZE_PX,
          color: fontColor,
        }}
        onMouseEnter={() =>
          setDisplay((prev) => (prev === "none" ? "button" : prev))
        }
        onMouseLeave={() => setDisplay("none")}
      >
        {display === "button" && (
          <button
            type="button"
            className="w-full h-full text-6xl backdrop-brightness-75 border-2 border-dashed duration-200"
            style={{ borderColor: fontColor }}
            onClick={() => setDisplay("list")}
          >
            +
          </button>
        )}
        {display === "list" && (
          <div className="w-full h-full grid grid-cols-4 grid-rows-4">
            {componentKeys.map((key) => (
              <button
                type="button"
                key={key}
                className="flex items-center justify-center text-xs duration-200 hover:brightness-150 whitespace-pre-line"
                style={{
                  backgroundColor: bgColor,
                  borderColor: fontColor,
                  borderWidth: 1,
                  borderStyle: "dashed",
                }}
                onClick={() => handleSelect(key)}
              >
                {formatKey(key)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
