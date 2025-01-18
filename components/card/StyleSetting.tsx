import { CardStyle } from "../../utils/types";
import { initialStyle } from "../../utils/cardDefinitions";
import { useSelector, useDispatch } from "react-redux";
import { setCardStyleState } from "../../store/cardStyleSlice";

export default function StyleSetting() {
  const cardStyle = useSelector((state: { cardStyle: CardStyle }) => state.cardStyle);
  const dispatch = useDispatch();

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
              dispatch(setCardStyleState({ ...cardStyle, bgColor_1: e.target.value }))
            }
          />
          <div className="h-6 pt-0.5 block text-left">{"Font 1"}: </div>
          <input
            className="block w-6 m-auto bg-transparent cursor-pointer"
            type="color"
            value={cardStyle.fontColor_1}
            onChange={(e) =>
              dispatch(setCardStyleState({ ...cardStyle, fontColor_1: e.target.value }))
            }
          />
          <div className="h-6 pt-0.5 block text-left">{"Base 2"}: </div>
          <input
            className="block w-6 m-auto bg-transparent cursor-pointer"
            type="color"
            value={cardStyle.bgColor_2}
            onChange={(e) =>
              dispatch(setCardStyleState({ ...cardStyle, bgColor_2: e.target.value }))
            }
          />
          <div className="h-6 pt-0.5 block text-left">{"Font 2"}: </div>
          <input
            className="block w-6 m-auto bg-transparent cursor-pointer"
            type="color"
            value={cardStyle.fontColor_2}
            onChange={(e) =>
              dispatch(setCardStyleState({ ...cardStyle, fontColor_2: e.target.value }))
            }
          />
        </div>
        <select
          className="block w-40 bg-transparent cursor-pointer"
          value={cardStyle.fontStyle}
          onChange={(e) =>
            dispatch(setCardStyleState({ ...cardStyle, fontStyle: e.target.value }))
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
      </div>
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
        onClick={() => {
          dispatch(setCardStyleState(initialStyle));
        }}
      >
        ↺
      </div>
    </div>
  );
}
