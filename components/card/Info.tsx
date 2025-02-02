"use client";

import { CardSetting } from "../../utils/types";
import { initialCardsList } from "../../utils/cardDefinitions";
import { setLocalStorage } from "../../utils/localFuncs";

export default function TurnCounter(props: {
  setCardList: (arg: CardSetting[]) => void;
}) {
  const { setCardList } = props;

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <div className="mt-4 flex items-center justify-center gap-x-2">
        <a
          href="https://x.com/root_5_web"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl duration-200 hover:opacity-70"
        >
          X
        </a>
        <div> / </div>
        <a
          href="https://github.com/root-5/boardGameFan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl duration-200 hover:opacity-70"
        >
          GitHub
        </a>
      </div>
      <div className="flex flex-col items-center gap-1 mt-4 text-xs">
        <p>Free for Everyone !</p>
        <p>Use for anything !</p>
      </div>
      <button
        onClick={() => {
          setCardList(initialCardsList);
          setLocalStorage("cardList", JSON.stringify(initialCardsList));
        }}
        className="mt-2 p-2 rounded-md duration-200 hover:bg-red-500"
      >
        Reset Cards
      </button>
      <p className="mt-2 text-xs">© 2024 root-5</p>
    </div>
  );
}
