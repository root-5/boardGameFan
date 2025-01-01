"use client";

import { useState } from "react";

export default function Setter(props: {
  componentMap: { [key: string]: React.ComponentType<any> };
  componentList: { component: string }[];
  setComponentList: (arg: { component: string }[]) => void;
}) {
  const { componentMap, componentList, setComponentList } = props;

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
              </div>
            );
          })
        }
      </div>
    </>
  );
}
