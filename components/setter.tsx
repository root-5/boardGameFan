"use client";

export default function Setter(props: {
  item: { component: string; x: number; y: number };
  componentMap: { [key: string]: React.ComponentType<any> };
  componentList: { component: string; x: number; y: number }[];
  setComponentList: (
    arg: { component: string; x: number; y: number }[]
  ) => void;
}) {
  const { item, componentMap, componentList, setComponentList } = props;

  return (
    <>
      <div className="px-8 py-4">
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
                  className="p-1 hover:opacity-50"
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
