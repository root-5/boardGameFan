"use client";

import { useState } from "react";

export default function Setter(props: {
  componentMap: { [key: string]: React.ComponentType<any> };
  componentList: { component: string }[];
  setComponentList: (arg: { component: string }[]) => void;
}) {
  const { componentMap, componentList, setComponentList } = props;

  const moveComponentUp = (index: number) => {
    if (index > 0) {
      const newList = [...componentList];
      const temp = newList[index - 1];
      newList[index - 1] = newList[index];
      newList[index] = temp;
      setComponentList(newList);
    }
  };

  const moveComponentDown = (index: number) => {
    if (index < componentList.length - 1) {
      const newList = [...componentList];
      const temp = newList[index + 1];
      newList[index + 1] = newList[index];
      newList[index] = temp;
      setComponentList(newList);
    }
  };

  return (
    <>
      <div className="p-4">
        {
          // componentMap の key 一覧を表示
          Object.keys(componentMap).map((key, index) => {
            return (
              <div key={index} className="flex flex-row gap-1">
                <button
                  className="p-1 hover:opacity-50"
                  onClick={() => {
                    setComponentList([...componentList, { component: key }]);
                  }}
                >
                  {key}
                </button>
                <button
                  className="p-1 hover:opacity-50"
                  onClick={() => moveComponentUp(index)}
                >
                  ↑
                </button>
                <button
                  className="p-1 hover:opacity-50"
                  onClick={() => moveComponentDown(index)}
                >
                  ↓
                </button>
              </div>
            );
          })
        }
      </div>
    </>
  );
}
