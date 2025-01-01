"use client";

export default function Setter(props: {
  item: { component: string; x: number; y: number };
  componentMap: { [key: string]: React.ComponentType<any> };
  componentList: { component: string; x: number; y: number }[];
  setComponentList: (
    arg: { component: string; x: number; y: number }[]
  ) => void;
  itemBgColor: string;
}) {
  const { item, componentMap, componentList, setComponentList, itemBgColor } =
    props;

  if (!componentMap || !componentList) {
    return null; // componentMap または componentList が未定義の場合は何も表示しない
  }

  return (
    <>
      <div
        className={"absolute w-56 h-56 text-center"}
        style={{
          left: item.x * 224, // 224 は カードの幅
          top: item.y * 224, // 224 は カードの幅
        }}
        draggable
      >
        <div
          className="px-8 py-4 w-full h-full duration-200 opacity-0 hover:opacity-70"
          style={{ backgroundColor: itemBgColor }}
        >
          {
            // componentMap の key 一覧を表示
            Object.keys(componentMap).map((key, index) => {
              // styleSetting, setter は表示しない
              if (key === "styleSetting" || key === "setter") {
                return null;
              }
              return (
                <div key={index} className="flex flex-row gap-1">
                  <button
                    className="p-1 w-full duration-200 hover:opacity-50"
                    onClick={() => {
                      // 同じ x, y をもつ item の component を変更
                      setComponentList(
                        componentList.map((c) =>
                          c.x === item.x && c.y === item.y
                            ? { component: key, x: item.x, y: item.y }
                            : c
                        )
                      );
                    }}
                  >
                    {
                      // 頭文字を大文字に変換
                      key.charAt(0).toUpperCase() + key.slice(1)
                    }
                  </button>
                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
}
