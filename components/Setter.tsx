"use client";

import { useState } from "react";
import { CardComponent, CardSetting } from "../utils/types";

export default function Setter(props: {
  item: CardSetting;
  cardMap: { [key: string]: CardComponent };
  cardList: CardSetting[];
  setCardList: (arg: CardSetting[]) => void;
  bgColor: string;
  fontColor: string;
}) {
  const { item, cardMap, cardList, setCardList, bgColor, fontColor } = props;

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

  const componentKeys = Object.keys(cardMap);

  // StyleSetting のような 2 単語で構成される文字列を改行する関数
  const formatKey = (key: string) => {
    return key.replace(/([a-z])([A-Z])/g, "$1\n$2");
  };

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
              {componentKeys.map((key, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center text-xs duration-200 hover:brightness-150"
                  onClick={() => handleClick(key)}
                  style={{
                    backgroundColor: bgColor,
                    borderColor: fontColor,
                    borderWidth: 1,
                    borderStyle: "dashed",
                  }}
                >
                  {formatKey(key.charAt(0).toUpperCase() + key.slice(1))}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
