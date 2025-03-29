'use Client';

import { CardStyle } from "../../utils/types";
import { initialStyle } from "../../utils/cardDefinitions";
import { setLocalStorage } from "../../utils/localFuncs";

const colorFields = [
  { label: "Base 1", key: "bgColor_1" },
  { label: "Font 1", key: "fontColor_1" },
  { label: "Base 2", key: "bgColor_2" },
  { label: "Font 2", key: "fontColor_2" },
];

const fontsMax = 10;

export default function StyleSetting({
  cardStyle,
  setCardStyle,
}: {
  cardStyle: CardStyle;
  setCardStyle: (cardStyle: CardStyle) => void;
}) {
  return (
    <div className={"relative w-56 h-56 text-center"}>
      <div className="py-6 flex flex-col justify-center items-center gap-2">
        {colorFields.map((field) => (
          <div key={field.key} className="px-8 grid grid-cols-2 gap-x-2 justify-center items-center">
            <div className="block text-left">{field.label}: </div>
            <input
              className="block w-6 m-auto bg-transparent cursor-pointer"
              type="color"
              value={cardStyle[field.key as keyof CardStyle]}
              onChange={(e) =>
                setCardStyle({ ...cardStyle, [field.key]: e.target.value })
              }
            />
          </div>
        ))}
        <div
          className="flex justify-center items-center text-xl"
        >
          <div
            onClick={() => {
              setCardStyle({
                ...cardStyle,
                fontStyle: cardStyle.fontStyle - 1 < 1 ? fontsMax : cardStyle.fontStyle - 1,
              });
            }}
            className="w-4 cursor-pointer duration-200 opacity-30 hover:opacity-100"
          >
            {"<"}
          </div>
          <div className="text-center w-32">
            Font Style {cardStyle.fontStyle}
          </div>
          <div
            onClick={() => {
              setCardStyle({
                ...cardStyle,
                fontStyle: cardStyle.fontStyle + 1 > fontsMax ? 1 : cardStyle.fontStyle + 1,
              });
            }}
            className="w-4 cursor-pointer duration-200 opacity-30 hover:opacity-100"
          >
            {">"}
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
        onClick={() => {
          setCardStyle(initialStyle);
          setLocalStorage("cardStyle", JSON.stringify(initialStyle));
        }}
      >
        ↺
      </div>
    </div>
  );
}