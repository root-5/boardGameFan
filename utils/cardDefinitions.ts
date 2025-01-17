import Score from "../components/cardMain/Score";
import Dice from "../components/cardMain/Dice";
import Token from "../components/cardMain/Token";
import Timer from "../components/cardMain/Timer";
import Roulette from "../components/cardMain/Roulette";
import Turn from "../components/cardMain/Turn";
import Winner from "../components/cardMain/Winner";
import Info from "../components/cardMain/Info";
import StyleSetting from "../components/cardMain/StyleSetting";
import PlayerSetting from "../components/cardMain/PlayerSetting";
import { CardComponent } from "./types";

// カードコンポーネントとカード名の対応表
export const cardMap: {
  [key: string]: CardComponent;
} = {
  score: Score,
  dice: Dice,
  token: Token,
  timer: Timer,
  roulette: Roulette,
  turn: Turn,
  winner: Winner,
  info: Info,
  styleSetting: StyleSetting,
  playerSetting: PlayerSetting,

  // setter は特殊なコンポーネントなので、ここでは設定しない
  // setter: Setter,
};

// 初期カード
export const initialCardsSetting = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 1, y: 0 },
  { component: "dice", x: 2, y: 0 },
  { component: "token", x: 0, y: 1 },
  { component: "roulette", x: 1, y: 1 },
  { component: "timer", x: 2, y: 1 },
  { component: "score", x: 0, y: 2 },
  { component: "styleSetting", x: 1, y: 2 },
  { component: "playerSetting", x: 2, y: 2 },
  { component: "info", x: 0, y: 3 },
];

// 初期カード（SPモード、x=0 のみ）
export const initialCardsSettingSP = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 0, y: 1 },
  { component: "dice", x: 0, y: 2 },
  { component: "token", x: 0, y: 3 },
  { component: "roulette", x: 0, y: 4 },
  { component: "timer", x: 0, y: 5 },
  { component: "score", x: 0, y: 6 },
  { component: "styleSetting", x: 0, y: 7 },
  { component: "info", x: 0, y: 8 },
  { component: "playerSetting", x: 0, y: 9 },
];

// 初期スタイル
export const initialStyle = {
  bgColor_1: "#432E54",
  bgColor_2: "#4B4376",
  fontColor_1: "#f0f6fc",
  fontColor_2: "#f0f6fc",
  fontStyle: "Comic Sans MS",
};

// 初期プレイヤー
export const initialPlayers = [
  { name: "Player 1", color: "#aa11ff" },
  { name: "Player 2", color: "#5b97f9" },
  { name: "Player 3", color: "#11ff11" },
  { name: "Player 4", color: "#ffaa11" },
  { name: "Player 5", color: "#a91111" },
];
