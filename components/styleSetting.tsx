export default function StyleSetting({
  bgColor_1,
  setBgColor_1,
  bgColor_2,
  setBgColor_2,
  fontColor_1,
  setFontColor_1,
  fontColor_2,
  setFontColor_2,
  fontStyle,
  setFontStyle,
  downloadStateAsJson,
  loadStateFromJson,
}: {
  bgColor_1: string;
  setBgColor_1: (color: string) => void;
  bgColor_2: string;
  setBgColor_2: (color: string) => void;
  fontColor_1: string;
  setFontColor_1: (color: string) => void;
  fontColor_2: string;
  setFontColor_2: (color: string) => void;
  fontStyle: string;
  setFontStyle: (style: string) => void;
  downloadStateAsJson: () => void;
  loadStateFromJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={"relative w-56 h-56 text-center"}>
      <div className="py-6 flex flex-col justify-center items-center gap-3">
        <div className="px-8 grid grid-cols-2 gap-1 justify-center items-center">
          <div className="pt-0.5 block w-28 text-left">{"Base 1"}: </div>
          <input
            className="h-6 block w-16"
            type="color"
            value={bgColor_1}
            onChange={(e) => setBgColor_1(e.target.value)}
          />
          <div className="h-6 pt-0.5 block w-28 text-left">{"Font 1"}: </div>
          <input
            className="h-6 block w-16"
            type="color"
            value={fontColor_1}
            onChange={(e) => setFontColor_1(e.target.value)}
          />
          <div className="h-6 pt-0.5 block w-28 text-left">{"Base 2"}: </div>
          <input
            className="h-6 block w-16"
            type="color"
            value={bgColor_2}
            onChange={(e) => setBgColor_2(e.target.value)}
          />
          <div className="h-6 pt-0.5 block w-28 text-left">{"Font 2"}: </div>
          <input
            className="h-6 block w-16"
            type="color"
            value={fontColor_2}
            onChange={(e) => setFontColor_2(e.target.value)}
          />
        </div>
        <select
          className="block w-40 bg-transparent"
          value={fontStyle}
          onChange={(e) => setFontStyle(e.target.value)}
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
        <div className="w-full flex gap-1 justify-center items-center">
          <button
            className="px-2 py-1 text-[12px] whitespace-nowrap rounded duration-200 hover:opacity-70"
            onClick={downloadStateAsJson}
          >
            Save Setting
          </button>
          <input
            type="file"
            accept=".json"
            className="hidden"
            id="upload-json"
            onChange={loadStateFromJson}
          />
          <label
            htmlFor="upload-json"
            className="px-2 py-1 text-[12px] whitespace-nowrap rounded cursor-pointer duration-200 hover:opacity-70"
          >
            Load Setting
          </label>
        </div>
      </div>
    </div>
  );
}
