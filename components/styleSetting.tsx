export default function StyleSetting({
  bgColor_1,
  setBgColor_1,
  bgColor_2,
  setBgColor_2,
  fontColor_1,
  setFontColor_1,
  fontColor_2,
  setFontColor_2,
}: {
  bgColor_1: string;
  setBgColor_1: (color: string) => void;
  bgColor_2: string;
  setBgColor_2: (color: string) => void;
  fontColor_1: string;
  setFontColor_1: (color: string) => void;
  fontColor_2: string;
  setFontColor_2: (color: string) => void;
}) {
  return (
    <div
      className={"relative w-56 h-56 text-center"}
      style={{ backgroundColor: bgColor_1, color: fontColor_1 }}
    >
      <div className="py-10 px-5 flex flex-col gap-4 justify-center items-center">
        <div className="grid grid-cols-2 gap-4 place-content-between">
          <div className="block w-28 text-left">{"Base 1"}: </div>
          <input
            className="block w-16"
            type="color"
            value={bgColor_1}
            onChange={(e) => setBgColor_1(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 place-content-between">
          <div className="block w-28 text-left">{"Font 1"}: </div>
          <input
            className="block w-16"
            type="color"
            value={fontColor_1}
            onChange={(e) => setFontColor_1(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 place-content-between">
          <div className="block w-28 text-left">{"Base 2"}: </div>
          <input
            className="block w-16"
            type="color"
            value={bgColor_2}
            onChange={(e) => setBgColor_2(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 place-content-between">
          <div className="block w-28 text-left">{"Font 2"}: </div>
          <input
            className="block w-16"
            type="color"
            value={fontColor_2}
            onChange={(e) => setFontColor_2(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}