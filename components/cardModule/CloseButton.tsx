import React from "react";
import { CardSetting } from "../../utils/types";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

interface CloseButtonProps {
  index: number;
  cardList: CardSetting[];
  setCardList: (list: CardSetting[]) => void;
  isHidden?: boolean;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  index,
  cardList,
  setCardList,
  isHidden,
}) => {
  return (
    <div
      className={
        "absolute z-10 top-1 right-1 px-1 cursor-pointer text-2xl leading-none duration-200 opacity-30 hover:opacity-100"
      }
      style={{
        display: isHidden ? "none" : "block",
      }}
      onClick={() => {
        const newList = [...cardList];
        newList[index] = {
          component: "setter",
          x: newList[index].x,
          y: newList[index].y,
        };
        setCardList(newList);
      }}
    >
      ×
    </div>
  );
};

export default CloseButton;
