export default function StyleSetting({
  cardStyle,
  setCardStyle,
}: // initialCards,
// setCardList,
// updateGrid,
{
  cardStyle: {
    bgColor_1: string;
    fontColor_1: string;
    bgColor_2: string;
    fontColor_2: string;
    fontStyle: string;
  };
  setCardStyle: (cardStyle: {
    bgColor_1: string;
    fontColor_1: string;
    bgColor_2: string;
    fontColor_2: string;
    fontStyle: string;
  }) => void;
  initialCards: { component: string; x: number; y: number }[];
  // setCardList: (cardList: { component: string; x: number; y: number }[]) => void;
  // updateGrid: () => void;
}) {
  return (
    <div className={"relative w-56 h-56 text-center"}>
      <div className="py-6 flex flex-col justify-center items-center gap-3">
        <div className="px-8 grid grid-cols-2 gap-x-2 justify-center items-center">
          <div className="pt-0.5 block text-left">{"Base 1"}: </div>
          <input
            className="block w-6 m-auto bg-transparent cursor-pointer"
            type="color"
            value={cardStyle.bgColor_1}
            onChange={(e) =>
              setCardStyle({ ...cardStyle, bgColor_1: e.target.value })
            }
          />
          <div className="h-6 pt-0.5 block text-left">{"Font 1"}: </div>
          <input
            className="block w-6 m-auto bg-transparent cursor-pointer"
            type="color"
            value={cardStyle.fontColor_1}
            onChange={(e) =>
              setCardStyle({ ...cardStyle, fontColor_1: e.target.value })
            }
          />
          <div className="h-6 pt-0.5 block text-left">{"Base 2"}: </div>
          <input
            className="block w-6 m-auto bg-transparent cursor-pointer"
            type="color"
            value={cardStyle.bgColor_2}
            onChange={(e) =>
              setCardStyle({ ...cardStyle, bgColor_2: e.target.value })
            }
          />
          <div className="h-6 pt-0.5 block text-left">{"Font 2"}: </div>
          <input
            className="block w-6 m-auto bg-transparent cursor-pointer"
            type="color"
            value={cardStyle.fontColor_2}
            onChange={(e) =>
              setCardStyle({ ...cardStyle, fontColor_2: e.target.value })
            }
          />
        </div>
        <select
          className="block w-40 bg-transparent cursor-pointer"
          value={cardStyle.fontStyle}
          onChange={(e) =>
            setCardStyle({ ...cardStyle, fontStyle: e.target.value })
          }
        >
          <option className="bg-transparent text-black" value="Comic Sans MS">
            Comic Sans MS
          </option>
          <option className="bg-transparent text-black" value="Arial">
            Arial
          </option>
          <option className="bg-transparent text-black" value="Courier">
            Courier
          </option>
          <option className="bg-transparent text-black" value="Georgia">
            Georgia
          </option>
          <option className="bg-transparent text-black" value="Impact">
            Impact
          </option>
          <option className="bg-transparent text-black" value="Times New Roman">
            Times New Roman
          </option>
          <option className="bg-transparent text-black" value="Trebuchet MS">
            Trebuchet MS
          </option>
          <option className="bg-transparent text-black" value="Verdana">
            Verdana
          </option>
        </select>
        {/* <button
          className="w-40 h-8 text-white rounded-lg duration-200 hover:bg-red-500"
          onClick={() => {
            setCardList(initialCards);
            updateGrid();
          }}
        >
          {"Reset Cards"}
        </button> */}
      </div>
    </div>
  );
}
