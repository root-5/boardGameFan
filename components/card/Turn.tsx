"use client";

import { useSelector, useDispatch } from "react-redux";
import { setTurnCount, setTurnPlayerIndex, toggleTurnMode, resetTurn } from "../../store/turnSlice";
import { Player } from "../../utils/types";

export default function TurnCounter(props: { players: Player[] }) {
  const { players } = props;

  const turnCount = useSelector((state: { turn: { turnCount: number } }) => state.turn.turnCount);
  const turnPlayerIndex = useSelector((state: { turn: { turnPlayerIndex: number } }) => state.turn.turnPlayerIndex);
  const isTurnCountMode = useSelector((state: { turn: { isTurnCountMode: boolean } }) => state.turn.isTurnCountMode);
  const dispatch = useDispatch();

  const handleNext = () => {
    if (isTurnCountMode) {
      dispatch(setTurnCount(turnCount + 1));
    } else {
      dispatch(setTurnPlayerIndex((turnPlayerIndex + 1) % players.length));
    }
  };

  const handlePrevious = () => {
    if (isTurnCountMode) {
      dispatch(setTurnCount(Math.max(turnCount - 1, 0)));
    } else {
      dispatch(setTurnPlayerIndex((turnPlayerIndex - 1 + players.length) % players.length));
    }
  };

  const handleReset = () => {
    dispatch(resetTurn());
  };

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <p className="text-2xl">Turn</p>
      <p
        className={
          isTurnCountMode
            ? "text-6xl mt-4 leading-none cursor-pointer"
            : "text-4xl mt-4 leading-none cursor-pointer"
        }
        onClick={() => dispatch(toggleTurnMode())}
      >
        {isTurnCountMode ? turnCount : players[turnPlayerIndex].name}
      </p>
      <div className="mt-4 flex justify-center items-center">
        <button
          className="px-8 text-4xl leading-none cursor-pointer duration-200 hover:opacity-70"
          onClick={handlePrevious}
        >
          {"<"}
        </button>
        <button
          className="px-8 text-4xl leading-none cursor-pointer duration-200 hover:opacity-70"
          onClick={handleNext}
        >
          {">"}
        </button>
      </div>
      <div
        className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
        onClick={handleReset}
      >
        ↺
      </div>
    </div>
  );
}
