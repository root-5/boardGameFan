import React from "react";

export type Player = {
  name: string;
  color: string;
};

export type CardComponent = React.ComponentType<{
  zoomRatio: number;
  players:  Player[];
  setPlayers: (arg: Player[]) => void;
}>;

export type CardSetting = {
  componentName: string;
  x: number;
  y: number;
};

export type CardStyle = {
  bgColor_1: string;
  fontColor_1: string;
  bgColor_2: string;
  fontColor_2: string;
  fontStyle: string;
};