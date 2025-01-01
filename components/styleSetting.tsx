"use client";

export default function StyleSetting({
  bgColor_1,
  setBgColor_1,
  bgColor_2,
  setBgColor_2,
  fontColor,
  setFontColor,
}: {
  bgColor_1: string;
  setBgColor_1: (color: string) => void;
  bgColor_2: string;
  setBgColor_2: (color: string) => void;
  fontColor: string;
  setFontColor: (color: string) => void;
}) {
  return (
    <div
      className={"relative w-56 h-56 text-center"}
      style={{ backgroundColor: bgColor_1, color: fontColor }}
    >
      <div className="py-10 px-5 flex flex-col gap-4 justify-center items-center">
        <div className="grid grid-cols-2 gap-4 place-content-between">
          <div className="block w-28 text-left">{"Color 1"}: </div>
          <input
            className="block w-16"
            type="color"
            value={bgColor_1}
            onChange={(e) => setBgColor_1(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 place-content-between">
          <div className="block w-28 text-left">{"Color 2"}: </div>
          <input
            className="block w-16"
            type="color"
            value={bgColor_2}
            onChange={(e) => setBgColor_2(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 place-content-between">
          <div className="block w-28 text-left">{"Font Color"}: </div>
          <input
            className="block w-16"
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
