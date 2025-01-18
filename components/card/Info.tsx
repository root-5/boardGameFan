"use client";

import { CardSetting } from "../../utils/types";
import { initialCardsSetting } from "../../utils/cardDefinitions";
import { useSelector, useDispatch } from "react-redux";
import { setCardList } from "../../store/cardSlice";

export default function TurnCounter() {
  const cardList = useSelector((state: { card: CardSetting[] }) => state.card);
  const dispatch = useDispatch();

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <div className="flex items-center justify-center gap-x-2">
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
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
        <p>Next.js</p>
        <p>Cloudflare Pages</p>
        <p>GitHub</p>
        <p>GitHub Copilot</p>
        <p>Copilot Workspace</p>
      </div>
      <button
        onClick={() => {
          dispatch(setCardList(initialCardsSetting));
        }}
        className="mt-4 p-2 rounded-md duration-200 hover:bg-red-500"
      >
        Reset Cards
      </button>
      <p className="mt-4 text-xs">© 2024 root-5</p>
    </div>
  );
}
