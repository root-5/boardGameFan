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