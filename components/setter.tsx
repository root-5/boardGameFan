"use client";

import { useState } from "react";
import { CardComponent } from "../utils/types";

export default function Setter(props: {
  item: { component: string; x: number; y: number };
  cardMap: { [key: string]: CardComponent };
  cardList: { component: string; x: number; y: number }[];
  setCardList: (arg: { component: string; x: number; y: number }[]) => void;
  itemBgColor: string;
  fontColor: string;
}) {
  const { item, cardMap, cardList, setCardList, itemBgColor, fontColor } =
    props;

  // カードの状態（表示なし、＋ボタン表示、コンポーネントリスト表示）
  const [setterDisplay, setSetterDisplay] = useState("none");

  const handleClick = (key: string) => {
    setCardList(
      cardList.map((c) =>
        c.x === item.x && c.y === item.y
          ? { component: key, x: item.x, y: item.y }
          : c
      )
    );
    setSetterDisplay("none");
  };

  if (!cardMap || !cardList) {
    return null; // cardMap または cardList が未定義の場合は何も表示しない
  }

  const componentKeys = Object.keys(cardMap).filter(
    (key) => key !== "styleSetting" && key !== "setter"
  );

  return (
    <div className="relative">
      <div
        className={"absolute w-56 h-56 text-center"}
        style={{
          left: item.x * 224, // 224 は カードの幅
          top: item.y * 224, // 224 は カードの幅
          color: fontColor,
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          onMouseEnter={() => setSetterDisplay("button")}
          onMouseLeave={() => setSetterDisplay("none")}
        >
          {setterDisplay === "button" && (
            <button
              className="w-full h-full text-6xl backdrop-brightness-75 border-2 border-dashed duration-200"
              onClick={() => setSetterDisplay("list")}
              style={{
                borderColor: fontColor,
              }}
            >
              +
            </button>
          )}
        </div>
        {setterDisplay === "list" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full grid grid-cols-4 grid-rows-4"
              onMouseLeave={() => setSetterDisplay("none")}
            >
              {componentKeys.map((key, index) =>
                key === "info" ? null : key === "playerSetting" ? null : (
                  <button
                    key={index}
                    className="flex items-center justify-center text-sm duration-200 hover:brightness-150"
                    onClick={() => handleClick(key)}
                    style={{
                      backgroundColor: itemBgColor,
                      borderColor: fontColor,
                      borderWidth: 1,
                      borderStyle: "dashed",
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
