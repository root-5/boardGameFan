/**
 * カード全体にかかわる型をまとめる
 * カード個別の型は、各カードのコンポーネント内に記述する
 */

import React from "react";

export type Player = {
  name: string;
  color: string;
};

export type CardSetting = {
  component: string;
  x: number;
  y: number;
};

export type CardStyle = {
  bgColor_1: string;
  fontColor_1: string;
  bgColor_2: string;
  fontColor_2: string;
  fontStyle: number;
};

export type CardComponent = React.ComponentType<{
  zoomRatio: number;
  players:  Player[];
  setPlayers: (arg: Player[]) => void;
  cardStyle: CardStyle;
  setCardStyle: (arg: CardStyle) => void;
  setCardList: (arg: CardSetting[]) => void;
}>;