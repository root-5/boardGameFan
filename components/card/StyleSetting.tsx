"use client";

/**
 * スタイル設定カード
 *
 * 交互に使う背景色・文字色と、フォントスタイル番号を変更できます。
 */

import type { CardStyle } from "@/utils/types";
import { initialStyle, fonts } from "@/utils/cardDefinitions";
import { setLocalStorage } from "@/utils/localFuncs";
import ResetButton from "@/components/card/module/ResetButton";

const COLOR_FIELDS: { label: string; key: keyof CardStyle }[] = [
  { label: "Base 1", key: "bgColor_1" },
  { label: "Font 1", key: "fontColor_1" },
  { label: "Base 2", key: "bgColor_2" },
  { label: "Font 2", key: "fontColor_2" },
];

type StyleSettingProps = {
  cardStyle?: CardStyle;
  setCardStyle?: (style: CardStyle) => void;
};

export default function StyleSetting({
  cardStyle = initialStyle,
  setCardStyle,
}: StyleSettingProps) {
  const updateStyle = (partial: Partial<CardStyle>) => {
    setCardStyle?.({ ...cardStyle, ...partial });
  };

  return (
    <div className="relative w-56 h-56 text-center">
      <div className="py-6 flex flex-col justify-center items-center gap-2">
        {COLOR_FIELDS.map((field) => (
          <div
            key={field.key}
            className="px-8 grid grid-cols-2 gap-x-2 justify-center items-center"
          >
            <div className="block text-left">{field.label}: </div>
            <input
              className="block w-6 m-auto bg-transparent cursor-pointer"
              type="color"
              value={String(cardStyle[field.key])}
              onChange={(e) => updateStyle({ [field.key]: e.target.value })}
            />
          </div>
        ))}

        <div className="flex justify-center items-center text-xl">
          <button
            type="button"
            className="w-4 cursor-pointer duration-200 opacity-30 hover:opacity-100"
            onClick={() =>
              updateStyle({
                fontStyle:
                  cardStyle.fontStyle - 1 < 1
                    ? fonts.length
                    : cardStyle.fontStyle - 1,
              })
            }
          >
            {"<"}
          </button>
          <div className="text-center w-32">
            Font Style {cardStyle.fontStyle}
          </div>
          <button
            type="button"
            className="w-4 cursor-pointer duration-200 opacity-30 hover:opacity-100"
            onClick={() =>
              updateStyle({
                fontStyle:
                  cardStyle.fontStyle + 1 > fonts.length
                    ? 1
                    : cardStyle.fontStyle + 1,
              })
            }
          >
            {">"}
          </button>
        </div>
      </div>

      <ResetButton
        label="Reset style"
        onClick={() => {
          setCardStyle?.(initialStyle);
          setLocalStorage("cardStyle", JSON.stringify(initialStyle));
        }}
      />
    </div>
  );
}
