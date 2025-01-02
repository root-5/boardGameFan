"use client";

import { useState } from "react";

export default function Setter(props: {
  item: { component: string; x: number; y: number };
  componentMap: { [key: string]: React.ComponentType<{ zoomRatio: number }> };
  componentList: { component: string; x: number; y: number }[];
  setComponentList: (
    arg: { component: string; x: number; y: number }[]
  ) => void;
  itemBgColor: string;
  fontColor: string;
}) {
  const {
    item,
    componentMap,
    componentList,
    setComponentList,
    itemBgColor,
    fontColor,
  } = props;

  // カードの状態（表示なし、＋ボタン表示、コンポーネントリスト表示）
  const [setterDisplay, setSetterDisplay] = useState("none");

  const handleClick = (key: string) => {
    setComponentList(
      componentList.map((c) =>
        c.x === item.x && c.y === item.y
          ? { component: key, x: item.x, y: item.y }
          : c
      )
    );
    setSetterDisplay("none");
  };

  if (!componentMap || !componentList) {
    return null; // componentMap または componentList が未定義の場合は何も表示しない
  }

  const componentKeys = Object.keys(componentMap).filter(
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
              className="w-full h-full text-6xl border-2 border-dashed"
              onClick={() => setSetterDisplay("list")}
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
                  className="flex items-center justify-center text-sm duration-200 hover:opacity-70"
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
